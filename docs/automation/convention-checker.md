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

工具名称不强制。[Rule Catalog](../rules/convention-rules.md)提供稳定编号，检查语义、适用范围和级别以其链接的规范正文为准。

## 检查范围

- Operation：operationId 唯一、verbNoun、业务模块映射。
- Use Case：UC ID 唯一、外部业务 operation 有主要 Use Case（UC004）。
- Business Rule：BR ID 唯一、活跃 BR 有实现和测试、引用路径存在。
- HTTP：标准 `.http` 路径、UC/BR/INC 引用有效、production-safe 安全标记。
- Naming：只检查已经稳定写入规范的客观禁止模式。

具体 Rule Code 见 [Rule Catalog](../rules/convention-rules.md)。UC/BR 唯一性遵守[身份定义与引用](../traceability/identity-system.md#身份定义与引用)，不得把全文搜索命中数当作定义数。

引用完整性要求：BR 引用的实现/测试路径 MUST 存在；HTTP Test 的 UC/BR 引用 MUST 有效；采用 INC 时，Regression Test 的 INC 引用 MUST 有效。引用检查隔离导航断链风险，不判断业务行为是否正确。

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
1  存在 MUST 规范失败
2  checker 本身或环境错误
4  必需检查证据不足，结果为 NOT_VERIFIED / NOT_RUN
```

SHOULD 类规则可先 warning，稳定后再升级。结果与组合退出码遵守[统一验证命令](verification-command.md#exit-code)，不能把无法判断唯一性当成通过。

## 渐进采用

老项目 MAY 使用 baseline。Baseline 只容纳历史 violation；新代码不得增加 violation，且 baseline 应逐步减少。

## 边界

Java 依赖关系由 Architecture Test 负责，不在 Checker 重复实现。

Checker 只检查当前状态；历史原因仍由 BC / PR / Commit / INC 负责。
