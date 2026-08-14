# Java 类命名规范

## 目标

类名必须让开发者和 AI 在不打开文件的情况下，大致判断：

```text
属于什么业务
正在做什么
承担什么架构职责
```

统一公式：

```text
业务语义 + 职责后缀
```

## 业务对象

业务对象直接使用业务名词：

```text
Order
OrderId
OrderItem
Money
Customer
PaymentMethod
```

SHOULD NOT 使用无信息量后缀：

```text
Model
Bean
Object
Data
Info
```

边界对象必须体现所在边界：

```text
Order                 # Domain
OrderJpaEntity        # Persistence
OrderProjection       # Query projection
CancelOrderRequest    # HTTP input
CancelOrderCommand    # Application input
CancelOrderResult     # Application output
CancelOrderResponse   # HTTP output
```

## 业务操作

统一公式：

```text
Verb + BusinessObject + Role
```

例如：

```text
CancelOrderUseCase
CancelOrderCommand
CancelOrderResult
CancelOrderRequest
CancelOrderResponse
```

同一个 Operation MUST 使用相同业务前缀，使全文搜索能够找齐相关文件。

## 业务决策

使用明确职责后缀：

| 后缀 | 含义 | 示例 |
|---|---|---|
| `Rule` | 一条明确业务判断 | `RefundEligibilityRule` |
| `Policy` | 一组规则或策略选择 | `OrderCancellationPolicy` |
| `Calculator` | 确定性业务计算 | `RefundAmountCalculator` |
| `Classifier` | 业务分类 | `PaymentRiskClassifier` |
| `Selector` | 从候选中选择 | `WarehouseSelector` |
| `Specification` | 可组合业务条件 | `CancellableOrderSpecification` |
| `StateMachine` | 明确状态转换 | `OrderStateMachine` |
| `Factory` | 创建满足业务约束的对象 | `OrderFactory` |

## Application 角色

| 后缀 | 职责 |
|---|---|
| `UseCase` | 一个明确业务操作 |
| `Command` | 改变状态的输入 |
| `Query` | 查询输入 |
| `Result` | 应用执行结果 |
| `Workflow` | 长流程、多步骤流程 |
| `Coordinator` | 协调多个模块或能力 |
| `Saga` | 跨事务长时间过程 |
| `Repository` | 聚合加载/保存契约 |
| `QueryRepository` | 查询数据能力 |
| `Gateway` | 外部业务系统能力 |
| `Publisher` | 事件/消息发布能力 |
| `Reader` | 只读外部信息能力 |
| `Generator` | 生成编号等能力 |

## Adapter 角色

| 后缀 | 职责 | 示例 |
|---|---|---|
| `Controller` | HTTP 入口 | `OrderController` |
| `Consumer` | MQ 消费入口 | `OrderCancelledConsumer` |
| `Listener` | 事件监听 | `PaymentCompletedListener` |
| `Job` | 定时/批处理任务 | `CloseExpiredOrdersJob` |
| `Tool` | MCP / Tool 入口 | `SearchLogsMcpTool` |
| `Client` | 具体协议或 SDK 客户端 | `StripeHttpClient` |
| `Adapter` | Port 的技术实现 | `JpaOrderRepositoryAdapter` |
| `Mapper` | 边界模型转换 | `OrderPersistenceMapper` |
| `Properties` | 配置绑定 | `PaymentClientProperties` |
| `Configuration` | Bean/模块装配 | `OrderModuleConfiguration` |

## Adapter 命名公式

Port：

```text
OrderRepository
PaymentGateway
```

Adapter：

```text
Technology + PortName + Adapter
```

例如：

```text
JpaOrderRepositoryAdapter
MyBatisOrderRepositoryAdapter
StripePaymentGatewayAdapter
HttpCustomerGatewayAdapter
```

Domain / Application 类名 MUST NOT 带 `Jpa`、`Redis`、`Kafka`、`Http` 等具体技术名称。

## 事件命名

Command 表达“希望发生”：

```text
CancelOrderCommand
ReserveInventoryCommand
```

Event 表达“已经发生”，使用过去式：

```text
OrderCancelledEvent
InventoryReservedEvent
PaymentCompletedEvent
```

## 查询动词

统一语义：

| 动词 | 含义 |
|---|---|
| `Get` | 获取明确对象，不存在通常视为失败 |
| `Find` | 尝试查找，允许不存在 |
| `List` | 获取范围明确的集合 |
| `Search` | 动态条件检索 |
| `Count` | 返回数量 |
| `Exists` | 判断存在性 |
| `Export` | 导出文件/报表 |

## 默认禁止的模糊名称

以下名称默认不允许作为核心业务类名：

```text
ServiceImpl
CommonService
Manager
Helper
Utils
Processor
DataHandler
BaseService
BusinessManager
```

`Service` 仅在它表达一个明确且不自然属于单一实体的领域能力时 MAY 使用，例如 `CurrencyConversionService`。

## 方法名与职责匹配

推荐：

```text
UseCase.execute
Rule.evaluate / check
Policy.evaluate / decide
Calculator.calculate
Classifier.classify
Selector.select
Resolver.resolve
Factory.create
Validator.validate
Publisher.publish
Repository.findById / save
```

不要在所有类型中滥用 `process()`、`handle()`、`doWork()`。

## 统一业务词汇

同一业务概念必须使用同一术语。若 `Cancel`、`Close`、`Void`、`Delete` 在业务上含义不同，应在项目词汇表中明确，而不是由开发者自由替换。

命名规范的最终目标：

> 前缀表达业务语义，动作表达意图，后缀表达职责。
