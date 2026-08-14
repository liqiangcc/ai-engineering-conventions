# Business Rule 测试规范

## 目的

Business Rule 测试用于证明某条业务规则在给定业务事实下产生正确决策。

它不负责验证 HTTP、数据库、Spring Bean 装配或完整业务流程。

## 定位规则

重要业务规则使用稳定 BR ID，例如：

```text
BR-ORDER-003：已发货订单禁止取消
```

实现：

```java
@BusinessRule("BR-ORDER-003")
public final class OrderCancellationPolicy {
    public CancellationDecision evaluate(Order order) {
        // ...
    }
}
```

测试名称必须可以通过 BR ID 或规则业务名搜索到：

```java
@DisplayName("BR-ORDER-003 订单取消资格")
class OrderCancellationPolicyTest {
}
```

## 决策表优先

有多个输入维度的规则，优先先写决策表，再写测试。

例如：

| 已发货 | 已取消 | 结果 |
|---|---|---|
| 否 | 否 | ALLOW |
| 是 | 否 | REJECT_SHIPPED |
| 否 | 是 | REJECT_ALREADY_CANCELLED |
| 是 | 是 | REJECT_ALREADY_CANCELLED 或按已定义优先级处理 |

决策表必须明确：

- 输入事实；
- 输出决策；
- 冲突条件的优先级；
- 边界值；
- 默认分支。

不要仅根据当前代码分支补测试案例。

## 测试结构

推荐：

```java
@DisplayName("BR-ORDER-003 订单取消资格")
class OrderCancellationPolicyTest {

    private final OrderCancellationPolicy policy =
            new OrderCancellationPolicy();

    @Test
    void unshipped_order_can_be_cancelled() {
        Order order = OrderFixtures.createdOrder();

        CancellationDecision result = policy.evaluate(order);

        assertThat(result).isEqualTo(CancellationDecision.allowed());
    }

    @Test
    void shipped_order_cannot_be_cancelled() {
        Order order = OrderFixtures.shippedOrder();

        CancellationDecision result = policy.evaluate(order);

        assertThat(result.reason()).isEqualTo("ORDER_ALREADY_SHIPPED");
    }
}
```

## 测试输入

业务规则依赖的事实应显式传入或通过领域对象表达。

推荐：

```java
policy.evaluate(order, operator, now);
```

不推荐让 Rule 测试依赖：

```text
Spring SecurityContext
系统当前时间
真实数据库
环境变量
远程 API
随机结果
```

如果规则依赖时间，使用明确的 `Instant` 或可控 `Clock`。

## 场景命名

测试名使用业务语义：

```text
shipped_order_cannot_be_cancelled
expired_coupon_cannot_be_applied
vip_customer_receives_member_discount
```

避免：

```text
test1
returnsFalse
caseA
shouldWork
```

## Bug 修复

与 BR 有关的 Bug，优先流程：

```text
Incident
→ 找到 BR
→ 找到缺失的决策表格子
→ 增加失败测试
→ 确认测试可复现
→ 修改实现
→ 原测试 + 新测试通过
```

如果无法先得到失败测试，应在 Verification Report 中解释原因。

## 禁止事项

- 为了让测试通过而复制生产实现中的条件表达式。
- Mock 被测 Rule 本身。
- 在 Rule 测试中启动完整 Spring Context。
- 用 E2E 测试替代决策表测试。
- 为每一个普通 `if` 创建独立 BR；BR 的粒度仍遵守业务可独立描述、独立修改、独立验证原则。

## 完成标准

重要 BR 至少应满足：

```text
BR ID 可搜索
+ 当前规则有明确场景
+ 正反例覆盖
+ 边界/冲突场景（适用时）
+ 测试无需真实基础设施
```