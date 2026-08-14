# Use Case 与入口映射规范

## 目标

让外部入口能够稳定推导到应用行为，降低 AI 和人工发现代码的成本。

核心链路：

```text
Entry Point
→ Operation
→ Use Case
→ Business Rule
→ Test
```

## HTTP 映射

HTTP Endpoint MUST 声明稳定 `operationId`。

示例：

```text
POST /api/v1/orders/{orderId}/cancel
operationId: cancelOrder
```

约定：

```text
resource: orders
→ module: order

operationId: cancelOrder
→ operation prefix: CancelOrder
→ primary use case: CancelOrderUseCase
```

因此可推导：

```text
order/application/cancel/CancelOrderUseCase.java
order/application/cancel/CancelOrderCommand.java
order/application/cancel/CancelOrderResult.java
```

## 一个 Operation 一个主要 Use Case

一个外部业务 Operation MUST 映射到一个主要 Use Case。

推荐：

```java
@PostMapping("/{orderId}/cancel")
public CancelOrderResponse cancelOrder(...) {
    return CancelOrderResponse.from(
            cancelOrderUseCase.execute(command)
    );
}
```

不允许 Controller 自己组合多个 Repository、Gateway 和业务判断形成隐藏 Use Case。

## 一个 Use Case 可以有多个入口

Use Case 表达业务能力，不等于 URL。

```text
HTTP Endpoint ────┐
MQ Consumer ──────┤
MCP Tool ─────────┼──→ CancelOrderUseCase
CLI Command ──────┤
Internal API ─────┘
```

多个入口表达同一业务意图时 SHOULD 复用同一 Use Case，而不是复制业务逻辑。

## operationId 命名

默认使用：

```text
verb + business noun
```

例如：

```text
createOrder
cancelOrder
confirmOrder
getOrder
listOrders
searchOrders
reserveInventory
releaseInventory
refundPayment
```

`operationId` MUST 在应用范围内唯一且稳定。

## Use Case 命名

默认使用：

```text
Verb + BusinessObject + UseCase
```

例如：

```text
CreateOrderUseCase
CancelOrderUseCase
GetOrderUseCase
RefundPaymentUseCase
```

本规范选择 `UseCase` 作为应用行为统一后缀。项目 SHOULD NOT 同时使用 `Handler`、`ApplicationService`、`Manager` 表达同一种应用职责。

## 输入输出命名

状态变更操作：

```text
CancelOrderCommand
CancelOrderUseCase
CancelOrderResult
```

查询：

```text
GetOrderQuery
GetOrderUseCase
GetOrderResult
```

若项目决定所有输入统一 `Command`，也可以，但必须项目内一致并在项目规范中声明。

## Controller 粒度

Controller 可按业务资源聚合：

```text
OrderController.createOrder
OrderController.cancelOrder
OrderController.getOrder
```

但 Application MUST 保持按业务 Operation 划分。

## URL 不等于包路径

URL 是外部契约，包是内部结构。禁止机械映射：

```text
/api/v1/orders/{id}/cancel
→ api.v1.orders.id.cancel
```

真正稳定的推导关系是：

```text
URL 资源段 → Business Module
operationId → Operation Prefix
Operation Prefix → Use Case Family
```

## 导航预期

看到：

```text
POST /api/v1/orders/{id}/cancel
operationId=cancelOrder
```

开发者和 AI SHOULD 首先猜测：

```text
module: order
controller: OrderController.cancelOrder
use case: CancelOrderUseCase
input: CancelOrderCommand
result: CancelOrderResult
test: CancelOrderUseCaseTest
rules: OrderCancellation*
```

规范是否成功，可以用“这些猜测长期是否高命中”衡量。
