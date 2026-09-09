# 逻辑与控制分离

## 定义

**逻辑（Logic）**回答：

- 是否允许；
- 如何计算；
- 如何分类；
- 状态如何转换；
- 某个业务事实意味着什么。

**控制（Control）**回答：

- 什么时候执行；
- 先执行什么；
- 后执行什么；
- 事务边界在哪里；
- 失败后重试、补偿还是终止；
- 哪些能力需要被组合。

## 基本结构

```text
Controller / Consumer / Tool
            ↓
          Use Case       ← 控制
            ├──→ Domain Rule/Policy  ← 逻辑
            └──→ Application Port
                          ↑
                     Adapter        ← 副作用实现
```

箭头表示源代码依赖，不表示执行顺序。Use Case 分别依赖领域规则与外部能力契约，Adapter 实现 Port；Domain 不依赖 Application Port。执行时由 Use Case 获取事实、调用规则，再按决策组织副作用，避免把基础设施访问混入业务判断。

## 逻辑的要求

业务逻辑 SHOULD：

- 使用业务语言命名；
- 尽量不依赖框架；
- 能够单独测试；
- 显式接收所需事实；
- 返回明确的 Decision / Result，而不是依靠隐藏副作用表达结果。

例如：

```java
@BusinessRule("BR-ORDER-003")
public final class OrderCancellationPolicy {
    public CancellationDecision evaluate(Order order, Operator operator) {
        if (order.isShipped()) {
            return CancellationDecision.rejected("ORDER_ALREADY_SHIPPED");
        }
        if (!operator.canCancel(order)) {
            return CancellationDecision.rejected("OPERATOR_NOT_ALLOWED");
        }
        return CancellationDecision.allowed();
    }
}
```

业务规则中 SHOULD NOT 直接：

```text
访问数据库
调用 HTTP
发送 MQ
读取 Redis
读取 SecurityContext
调用 Instant.now()
启动线程
sleep
```

时间、身份、配置阈值等事实应通过参数或 Port 显式提供。

## 控制的要求

Application Use Case 负责一次业务操作的编排，例如：

```text
读取订单
→ 获取必要事实
→ 调业务规则
→ 改变状态
→ 持久化
→ 发布事件
→ 返回结果
```

示例：

```java
@UseCase(id = "UC-ORDER-004", operationId = "cancelOrder")
public final class CancelOrderUseCase {
    private final OrderRepository orders;
    private final DomainEventPublisher events;
    private final OrderCancellationPolicy policy;

    public CancelOrderUseCase(OrderRepository orders,
                             DomainEventPublisher events,
                             OrderCancellationPolicy policy) {
        this.orders = orders;
        this.events = events;
        this.policy = policy;
    }

    public CancelOrderResult execute(CancelOrderCommand command) {
        Order order = orders.findById(command.orderId())
                .orElseThrow(OrderNotFoundException::new);

        CancellationDecision decision =
                policy.evaluate(order, command.operator());

        if (!decision.isAllowed()) {
            return CancelOrderResult.rejected(decision.reason());
        }

        order.cancel(command.operator().id());
        orders.save(order);
        events.publish(order.pullEvents());
        return CancelOrderResult.success(order.id());
    }
}
```

示例中 `CancellationDecision.allowed()` 是允许决策的静态工厂，`decision.isAllowed()` 读取实例决策；Policy 通过构造器注入，保持实例方法与调用方式一致。

Use Case MAY 管理：

- 事务；
- 幂等入口；
- 调用顺序；
- 多能力协调；
- 应用级重试与补偿决策。

Use Case SHOULD NOT 自己实现：

- SQL；
- HTTP SDK 细节；
- Redis 操作；
- 复杂业务资格判断；
- 与具体框架绑定的协议转换。

## 常见错误

### Controller 中写规则

错误：

```java
if (order.isShipped()) {
    throw ...;
}
```

如果 MQ、CLI 或 Scheduler 调用相同业务能力，就可能绕过该规则。

### Use Case 变成新的大 Service

`XXXUseCase` 不是把旧 `OrderService` 内容整体搬进去。Use Case 应只组织流程，复杂决策仍应下沉到 Domain Rule / Policy。

### Adapter 决定业务行为

例如在 JPA Repository Adapter 中根据订单状态决定是否保存，这会把业务语义隐藏在技术层。

## Review 判断

Reviewer 看到一个条件判断时，应问：

> 这是业务上“应该怎样”的判断，还是流程上“接下来做什么”的判断？

前者通常属于 Domain；后者通常属于 Application。
