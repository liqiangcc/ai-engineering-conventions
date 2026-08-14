# HTTP API 测试规范

## 目的

HTTP API Test 用来证明真实运行中的应用，从外部 HTTP 边界看，行为是否符合公开契约和关键业务预期。

它覆盖的是用户或调用方真正经过的路径：

```text
HTTP Request
→ Gateway / Filter / Security
→ Spring MVC Routing
→ Validation / Serialization
→ Controller
→ Use Case
→ Domain
→ Adapter / Persistence
→ Exception Mapping
→ HTTP Response
```

因此它可以发现 BR / UC 单元测试无法覆盖的问题，例如：

- URL 或 HTTP Method 配置错误；
- PathVariable / Query / Header 映射错误；
- JSON 序列化 / 反序列化错误；
- Bean Validation 未生效；
- Security / JWT / 权限配置错误；
- ExceptionHandler 返回了错误状态码；
- Spring Profile / 环境配置差异；
- 网关、反向代理或部署路由错误。

HTTP API Test 不替代 Business Rule Test、Use Case Test 或 Adapter Contract Test。

## 默认工具

项目 MAY 使用 httpYac、JetBrains HTTP Client、REST Client 或等价可执行 `.http/.rest` 工具。

规范不绑定某个具体工具，但必须满足：

```text
测试文件可进入 Git
人工可以直接阅读和执行
AI / CLI / CI 可以重复执行
支持环境变量
支持状态码和响应内容断言
敏感凭据不写入仓库
```

## 目录与命名

默认：

```text
tests/http/{module}/{operation-id-kebab-case}.http
```

例如：

```text
operationId: cancelOrder

→ tests/http/order/cancel-order.http
```

同一个 operation 的主要 HTTP 场景 SHOULD 聚合在同一个文件中，避免每个普通场景创建独立文件。

特殊 Bug 回归场景见 `bug-reproduction-testing.md`。

## 从入口推导测试

推荐形成稳定关系：

```text
POST /api/v1/orders/{orderId}/cancel
        ↓
operationId: cancelOrder
        ↓
order module
        ↓
tests/http/order/cancel-order.http
```

HTTP Test 文件 SHOULD 能通过以下信息定位：

```text
operationId
UC ID
BR ID（涉及业务规则时）
BC / AC（涉及具体业务变更时）
```

例如：

```http
# @name cancelOrder
# operationId: cancelOrder
# UC: UC-ORDER-004
# BR: BR-ORDER-003
# AC: BC-2026-014/AC-02

POST {{baseUrl}}/api/v1/orders/{{orderId}}/cancel
Authorization: Bearer {{token}}
Content-Type: application/json

{
  "reason": "CUSTOMER_REQUEST"
}

?? status == 409
?? body code == ORDER_ALREADY_SHIPPED
```

具体断言语法按项目选择的 HTTP Runner 调整。

## 场景选择

HTTP 层只保留高价值外部行为，不枚举所有领域组合。

推荐覆盖：

```text
主要成功场景
关键业务拒绝场景
认证 / 授权失败
参数格式错误
关键边界值
重要异常到 HTTP 状态的映射
历史高风险回归场景
```

例如 `BR-ORDER-003` 有 20 个决策组合：

```text
OrderCancellationPolicyTest
→ 完整覆盖 20 个业务组合

CancelOrderUseCaseTest
→ 覆盖主要流程和副作用

cancel-order.http
→ 3~6 个最关键的外部 API 行为
```

不要用大量 HTTP Case 替代快速、精确的领域测试。

## 环境分离

HTTP 文件本身 SHOULD 尽量跨环境复用：

```text
local
integration
staging
production-safe
```

环境差异通过变量解决：

```text
baseUrl
token
testTenantId
testOrderId
```

MUST NOT 把真实密码、Token、私钥等敏感值提交到 Git。

## 测试数据

HTTP Test 必须明确依赖什么测试数据。

优先顺序：

1. 测试自己创建并清理的数据；
2. 专用测试租户 / 测试账号下的稳定 Fixture；
3. 预置且可重建的测试数据；
4. 最后才考虑依赖共享环境中的偶然数据。

测试不得依赖“当前数据库里刚好有一条 ID=123 的订单”。

## 标签语义

项目 SHOULD 为 HTTP Case 建立以下语义标签；具体如何在工具中表达可由项目决定：

```text
acceptance       验收场景
regression       永久回归场景
deployment       部署后需要执行
production-safe  允许在生产安全执行
destructive      会修改或破坏数据，只允许受控环境
```

标签是选择执行范围的输入，不是业务规则本身。

## 与 E2E 的边界

HTTP API Test 可以只验证一个服务的真实 HTTP 边界。

跨多个真实系统的长链路，例如：

```text
下单
→ 库存服务
→ 支付服务
→ 消息系统
→ 配送系统
```

才更适合作为跨系统 E2E。

不要因为使用了真实 HTTP 就把所有 HTTP Test 都归为重型 E2E。

## AI 执行要求

AI 修改 HTTP 相关功能时 SHOULD：

1. 从 operationId 定位对应 `.http/.rest` 文件；
2. 确认本次 AC / BR 是否需要新增或调整场景；
3. 先运行最小相关 HTTP Case；
4. 报告真实执行环境和结果；
5. 无法执行时标记 `NOT VERIFIED`，不能只根据文件内容判断通过。

## 完成标准

一个重要 HTTP Operation SHOULD 至少具备：

```text
可推导的 HTTP Test 文件
+ 主要成功场景
+ 关键错误/拒绝场景
+ 可配置环境
+ 可由 CLI/CI 重复执行
+ 不包含仓库内明文秘密
```
