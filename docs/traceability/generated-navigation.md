# 自动生成导航规范

## 目标

能从代码和测试自动推导的导航信息 SHOULD 由工具生成，不要求人工维护第二份映射表。

推荐生成：

```text
docs/generated/entrypoint-map.yaml
```

示例：

```yaml
entrypoints:
  - type: http
    method: POST
    path: /api/v1/orders/{orderId}/cancel
    operationId: cancelOrder
    module: order
    useCase:
      id: UC-ORDER-004
      class: CancelOrderUseCase
    rules:
      - id: BR-ORDER-003
        class: OrderCancellationPolicy
    httpTests:
      - tests/http/order/cancel-order.http
```

## 数据来源

优先从权威源推导：

```text
HTTP mapping / OpenAPI operationId
@UseCase / UC metadata
@BusinessRule / BR metadata
代码依赖
测试文件路径和 metadata
module map
```

不要要求开发者再手工填写一份完全重复的 YAML。

## Generator 与 Checker 分离

Generator 生成视图；Convention Checker 检查完整性和唯一性。

发现重复 identity 时必须 FAIL，不能任意选择一个。

## Git 策略

生成文件可以提交 Git，也可以 CI 临时生成；无论哪种方式都不得人工编辑。

如果提交 Git，CI SHOULD 检查生成物是否最新。

## AI 使用

AI 收到 URL Bug 时优先：

```text
entrypoint-map
→ operationId
→ UC
→ BR
→ HTTP Test
→ Git / BC / INC
```

地图缺失或过期时回退到源代码；generated view 不是业务真相源。
