# Testing & Verification

本目录只回答一个问题：

> 如何用独立、可重复的证据判断 AI 或人工实现是否正确，并证明部署出去的真实实例也正确？

## 阅读顺序

```text
测试策略
  ↓
Business Rule / Use Case 测试
  ↓
Adapter Contract / Architecture 测试
  ↓
HTTP API Test
  ↓
Bug Reproduction / Regression
  ↓
Verification Workflow
  ↓
Post-Deployment Verification
```

## 文档

- [`testing-strategy.md`](testing-strategy.md)：各测试层分别证明什么，以及正确性依据来自哪里。
- [`business-rule-testing.md`](business-rule-testing.md)：BR、决策表、边界场景和业务规则验证。
- [`use-case-testing.md`](use-case-testing.md)：Use Case 流程、Fake Port、关键副作用和失败分支。
- [`adapter-contract-testing.md`](adapter-contract-testing.md)：Port 契约、数据库/HTTP/MQ Adapter 的验证边界。
- [`architecture-testing.md`](architecture-testing.md)：通过 ArchUnit 等工具保护关注点分离和模块边界。
- [`http-api-testing.md`](http-api-testing.md)：从真实 HTTP 边界验证 operationId 对应的外部行为。
- [`bug-reproduction-testing.md`](bug-reproduction-testing.md)：Bug 如何用同一个正确断言形成 `FAIL → PASS → 永久回归`。
- [`verification-workflow.md`](verification-workflow.md)：AI 从最小测试到部署验证如何执行并输出证据。
- [`post-deployment-verification.md`](post-deployment-verification.md)：如何确认真实运行版本并在 staging/production 安全验证。

## 核心证据链

```text
BC / Acceptance Criteria
        ↓
BR / Contract
        ↓
Implementation
        ↓
Layered Tests
        ↓
HTTP API Tests
        ↓
Pre-Deployment Verification
        ↓
Deployment
        ↓
Post-Deployment Verification
```

实现和测试不能互相自证。测试的预期必须能追溯到业务规则、验收条件或公开契约。

## HTTP 导航约定

```text
operationId: cancelOrder
→ tests/http/order/cancel-order.http
```

同一文件优先聚合一个 operation 的主要场景。只有 Bug 复现需要特殊 Fixture 或独立生命周期时，才使用：

```text
tests/http/{module}/regression/{inc-id}-{scenario}.http
```

## Bug 修复最小闭环

```text
Bug / INC
→ 找到 UC / BR / operationId
→ 最小复现测试
→ Before Fix: FAIL
→ 修改实现
→ After Fix: PASS
→ 永久 Regression Asset
→ staging 重放同一 Case
→ Post-Deployment PASS
→ 必要的 production-safe smoke
```

复现测试断言正确行为，因此修复前失败、修复后通过。

## 部署验证边界

```text
Pre-Deployment VERIFIED
≠
Post-Deployment VERIFIED
```

部署后必须确认目标环境和运行版本。

生产环境只执行 `production-safe` 场景；非安全写操作允许明确记录 `NOT VERIFIED`，不能为了全绿破坏真实业务数据。

无法完成某一层验证时，必须明确记录为 `NOT VERIFIED` 或 `NOT RUN`，不能写成 PASS。
