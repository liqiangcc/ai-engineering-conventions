# Adapter 与 Contract 测试规范

## 目的

Adapter / Contract 测试用于证明外围技术实现满足核心 Port、协议或数据契约。

它不负责重新验证领域业务规则。

## 基本关系

```text
Application Port
      ↑
Adapter Implementation
      ↓
Database / HTTP / MQ / File / External SDK
```

例如：

```text
OrderRepository
      ↑
JpaOrderRepositoryAdapter
      ↓
JPA / MySQL
```

Contract Test 的核心问题是：

> 如果 Application 只依赖 Port，这个 Adapter 是否真的提供了 Port 承诺的行为？

## 共享契约测试

当一个 Port 存在多个实现时，优先建立共享契约测试。

例如：

```java
abstract class OrderRepositoryContract {

    protected abstract OrderRepository repository();

    @Test
    void saves_and_loads_order_by_id() {
        Order order = OrderFixtures.createdOrder();

        repository().save(order);

        assertThat(repository().findById(order.id()))
                .contains(order);
    }

    @Test
    void returns_empty_when_order_does_not_exist() {
        assertThat(repository().findById(new OrderId("missing")))
                .isEmpty();
    }
}
```

然后：

```text
InMemoryOrderRepositoryContractTest
JpaOrderRepositoryAdapterContractTest
```

都复用同一组核心行为。

## Persistence Adapter

重点验证：

- Domain ↔ Persistence Model 映射；
- ID、Money、枚举、时间等值对象是否无损；
- 保存后能否按照契约读取；
- 不存在、并发冲突、唯一约束等错误是否按约定映射；
- 查询语义和排序/分页契约（若 Port 明确定义）。

不要在 Repository Adapter 测试中验证 Controller 或完整 Use Case。

## HTTP / External Gateway Adapter

例如：

```text
PaymentGateway
      ↑
StripePaymentGatewayAdapter
      ↓
StripeHttpClient
```

重点验证：

- 业务请求如何映射为外部请求；
- 外部成功结果如何映射为应用结果；
- 4xx、5xx、超时、连接失败如何分类；
- 幂等键、请求 ID 等协议字段是否按契约发送；
- 外部协议变化不会直接泄漏到 Domain / Application。

可以使用 Mock Server / Stub Server 验证协议，不要 Mock Adapter 本身。

## Message Adapter

重点验证：

- 事件名 / Topic / Routing Key；
- 序列化字段；
- 版本兼容；
- 重复消息处理策略；
- 错误消息和不可反序列化消息的处理；
- 业务 Event 与传输 DTO 不混用。

## Testcontainers 与真实依赖

当技术行为无法通过内存替代物可靠模拟时，可使用 Testcontainers 或等价隔离环境。

适合：

```text
数据库约束 / SQL 行为
Kafka 序列化和 Topic 行为
Redis 原子操作
```

不适合为了“更真实”让所有 Use Case Test 都依赖容器。

## 测试数据

测试 Fixture 应表达业务语义：

```text
createdOrder()
shippedOrder()
paidPayment()
```

不要把数据库行结构直接扩散为全项目测试数据模型。

## 失败分类

Adapter Test 失败优先归类：

```text
MAPPING_ERROR
PROTOCOL_ERROR
CONTRACT_VIOLATION
DEPENDENCY_BEHAVIOR_CHANGE
TEST_ENVIRONMENT_FAILURE
```

不要直接归类为 Business Rule Bug，除非进一步证据指向业务规则。

## 完成标准

重要 Adapter 至少应验证：

```text
主要成功映射
+ 关键失败映射
+ Port 的核心契约
+ 技术边界特有风险
```

多个 Adapter 实现同一 Port 时，应尽量复用同一契约测试，而不是各写一套语义不同的测试。