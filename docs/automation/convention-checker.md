# Convention Checker 规范

## 目的

Convention Checker 验证“按照约定应该能推导出来的东西，实际上是否存在且唯一”。它不是业务规则引擎。

## 推荐入口

项目可实现：

```text
aec check
```

或：

```text
./scripts/verify conventions
```

工具名称不强制，检查语义由 Rule Catalog 定义。

## 检查范围

- Operation：operationId 唯一、verbNoun、业务模块映射。
- Use Case：UC ID 唯一、重要 operation 有主要 Use Case。
- Business Rule：BR ID 唯一、活跃 BR 有实现和测试、引用路径存在。
- HTTP：标准 `.http` 路径、UC/BR/INC 引用有效、production-safe 安全标记。
- Naming：只检查已经稳定写入规范的客观禁止模式。

具体 Rule Code 见 `docs/rules/convention-rules.md`。

## 输出

人类：

```text
[HTTP001] cancelOrder
expected: tests/http/order/cancel-order.http
actual: missing
hint: add executable HTTP regression/acceptance test
```

机器输出 SHOULD 支持 JSON，并包含 rule、status、subject、expected、message。

## Exit Code

```text
0  所有 MUST 检查通过
1  存在规范失败
2  checker 本身或环境错误
```

SHOULD 类规则可先 warning，稳定后再升级。

## 渐进采用

老项目 MAY 使用 baseline。Baseline 只容纳历史 violation；新代码不得增加 violation，且 baseline 应逐步减少。

## 边界

Java 依赖关系由 Architecture Test 负责，不在 Checker 重复实现。

Checker 只检查当前状态；历史原因仍由 BC / PR / Commit / INC 负责。
