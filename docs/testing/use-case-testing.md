# Use Case 测试规范

## 目的

Use Case 测试用于证明一次应用级业务操作的控制流程正确。

它重点验证：

```text
加载事实
→ 调用业务规则
→ 修改状态
→ 调用外部能力
→ 持久化
→ 产生事件/结果
```

Use Case 测试不重复验证 Rule 内部的全部决策表，也不验证具体 JPA、HTTP、Kafka 实现。

## 定位规则

重要 Use Case 使用稳定 UC ID，例如：

```text
UC-ORDER-004：取消订单
```

实现：

```java
@UseCase("UC-ORDER-004")
public class CancelOrderUseCase {
}
```

测试：

```java
@DisplayName("UC-ORDER-004 取消订单")
class CancelOrderUseCaseTest {
}
```

通过 `UC-ORDER-004` 或 `CancelOrder` 应能够快速找到实现和测试。

## 测试依赖

Use Case 对外部能力应依赖 Port，并在测试中优先使用 Fake / Stub / Spy：

```java
FakeOrderRepository orders = new FakeOrderRepository();
FakeDomainEventPublisher events = new FakeDomainEventPublisher();
FixedClock clock = new FixedClock(...);

CancelOrderUseCase useCase = new CancelOrderUseCase(
        orders,
        events,
        clock
);
```

不要为了测试 Use Case 启动真实 MySQL、Redis 或远程 HTTP 服务。

## 验证重点

### 正常路径

验证：

- 读取了正确对象；
- 调用了正确业务能力；
- 状态变化正确；
- 保存了正确结果；
- 发布了正确事件；
- 返回了正确 Result。

### 失败路径

验证：

- Rule 拒绝后是否停止后续副作用；
- 外部依赖失败时是否按约定映射错误；
- 不允许发生的保存、通知、支付等调用没有发生；
- 幂等操作不会重复产生副作用。

### 调用顺序

只有业务语义依赖顺序时才验证顺序。

例如：

```text
先锁定库存再创建支付
```

如果顺序只是实现细节，不要把测试绑定到无意义的内部调用顺序。

## 与 Rule 测试的分工

例如：

```text
OrderCancellationPolicyTest
→ 验证“已发货订单是否允许取消”

CancelOrderUseCaseTest
→ 验证“Use Case 是否调用取消规则，并在允许时保存和发布事件”
```

不要在 Use Case 测试中重新枚举 BR 的全部组合。

## 示例

```java
@DisplayName("UC-ORDER-004 取消订单")
class CancelOrderUseCaseTest {

    @Test
    void saves_order_and_publishes_event_when_cancellation_is_allowed() {
        FakeOrderRepository orders = new FakeOrderRepository();
        FakeDomainEventPublisher events = new FakeDomainEventPublisher();
        Order order = OrderFixtures.createdOrder();
        orders.add(order);

        CancelOrderUseCase useCase = TestUseCases.cancelOrder(orders, events);

        CancelOrderResult result = useCase.execute(
                new CancelOrderCommand(order.id(), "operator-1")
        );

        assertThat(result.success()).isTrue();
        assertThat(orders.saved(order.id()).status())
                .isEqualTo(OrderStatus.CANCELLED);
        assertThat(events.publishedEvents())
                .anyMatch(OrderCancelledEvent.class::isInstance);
    }
}
```

## Fake 与 Mock 的选择

默认优先：

```text
简单 Fake > Stub > Spy > 大量 Mock
```

原因：

- Fake 更接近 Port 的行为契约；
- 测试更关注结果而非框架调用细节；
- AI 更容易理解测试意图；
- 重构内部实现时测试更稳定。

Mock 适用于必须断言特定外部交互且 Fake 成本明显更高的场景。

## 事务与幂等

Use Case 测试应验证业务可观察结果；具体数据库事务实现由 Integration Test 验证。

如果幂等是业务要求，应明确场景：

```text
同一 Command 重复执行
→ 返回相同业务结果或明确的幂等结果
→ 不重复扣款
→ 不重复发事件
```

## 完成标准

一个重要 UC 至少应覆盖：

```text
主要成功路径
+ 关键拒绝/失败路径
+ 关键副作用
+ 幂等/补偿（适用时）
+ 不依赖真实基础设施
```

测试名称、Fixture 和 Fake 应使用业务语言，避免隐藏业务语义的 `testData1`、`mockService`、`doSomething()`。