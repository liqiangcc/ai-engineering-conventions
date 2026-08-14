# Java / Spring 包结构规范

## 总原则

Java 项目 MUST 优先按业务能力组织，而不是在项目顶层按 `controller/service/repository/entity` 组织。

推荐：

```text
com.example.system
├── order/
├── inventory/
├── payment/
└── bootstrap/
```

每个业务模块内部再按代码职责分离：

```text
order/
├── api/            # 可选：模块对外公开契约
├── domain/         # 业务事实、状态、规则、决策
├── application/    # Use Case、流程控制、Port
├── adapter/        # HTTP、MQ、DB、Redis、外部 API 等技术适配
└── config/         # 模块装配
```

## 推荐结构

```text
order/
├── api/
│   └── OrderApi.java
│
├── domain/
│   ├── Order.java
│   ├── OrderId.java
│   ├── OrderStatus.java
│   ├── OrderCancellationPolicy.java
│   └── OrderCancelledEvent.java
│
├── application/
│   ├── create/
│   │   ├── CreateOrderCommand.java
│   │   ├── CreateOrderUseCase.java
│   │   └── CreateOrderResult.java
│   ├── cancel/
│   │   ├── CancelOrderCommand.java
│   │   ├── CancelOrderUseCase.java
│   │   └── CancelOrderResult.java
│   └── port/
│       ├── OrderRepository.java
│       └── PaymentGateway.java
│
├── adapter/
│   ├── in/
│   │   ├── web/
│   │   │   ├── OrderController.java
│   │   │   ├── CancelOrderRequest.java
│   │   │   └── CancelOrderResponse.java
│   │   └── message/
│   └── out/
│       ├── persistence/
│       │   ├── JpaOrderRepositoryAdapter.java
│       │   ├── OrderJpaEntity.java
│       │   └── OrderPersistenceMapper.java
│       └── payment/
│           └── HttpPaymentGatewayAdapter.java
│
└── config/
    └── OrderModuleConfiguration.java
```

## 应用层按业务动作组织

Application SHOULD 使用：

```text
application/{action}/
```

例如：

```text
application/create/
application/cancel/
application/confirm/
application/refund/
```

一个业务动作的 Command / Query、UseCase、Result 尽量位于同一目录，使一次修改的上下文集中。

## Domain 的组织

Domain 较小时 SHOULD 平铺，避免每种类型只有一个文件却创建大量目录。

文件明显增多后 MAY 拆成：

```text
domain/model/
domain/rule/
domain/policy/
domain/event/
```

是否拆目录由认知复杂度决定，不由架构模板决定。

## Controller 粒度

Controller MAY 按资源适度聚合：

```java
OrderController.createOrder()
OrderController.cancelOrder()
OrderController.getOrder()
```

Controller 必须保持薄，不允许因为聚合而承载业务规则或复杂流程。

## 查询与命令

为了 AI 可导航性，本规范允许命令和查询统一形成 Use Case：

```text
CreateOrderUseCase
CancelOrderUseCase
GetOrderUseCase
ListOrdersUseCase
```

项目若选择单独 Query 风格，也必须全项目一致，不得同时出现多套表达同一职责的模式。

## 模块之间

模块 A MUST NOT 直接访问模块 B 的：

```text
Repository 实现
JPA Entity
Adapter
内部 Domain 类
内部 Use Case
数据库表
```

跨模块同步调用通过 `api` / Port；异步协作通过明确 Event。

## Maven 模块化

小型项目 MAY 先使用单 Maven 模块，通过 Java package 和 ArchUnit 保证边界。

出现以下情况 SHOULD 升级 Maven 多模块：

- 业务模块之间频繁误依赖；
- 出现循环依赖；
- 构建和测试需要隔离；
- 模块由不同团队维护；
- 存在独立部署可能；
- 需要更强的编译期边界。

## 禁止的全局结构

业务复杂项目 SHOULD NOT 使用：

```text
controller/
service/
repository/
entity/
utils/
```

作为整个项目的一级业务组织方式，因为一个业务行为会因此散落到整个代码库。
