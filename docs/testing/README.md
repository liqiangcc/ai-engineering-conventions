# Testing & Verification

本目录只回答一个问题：

> 如何用独立、可重复的证据判断 AI 或人工实现是否正确？

## 阅读顺序

```text
测试策略
  ↓
Business Rule / Use Case 测试
  ↓
Adapter Contract / Architecture 测试
  ↓
Verification Workflow
```

## 文档

- [`testing-strategy.md`](testing-strategy.md)：各测试层分别证明什么，以及正确性依据来自哪里。
- [`business-rule-testing.md`](business-rule-testing.md)：BR、决策表、边界场景和 Bug 复现测试。
- [`use-case-testing.md`](use-case-testing.md)：Use Case 流程、Fake Port、关键副作用和失败分支。
- [`adapter-contract-testing.md`](adapter-contract-testing.md)：Port 契约、数据库/HTTP/MQ Adapter 的验证边界。
- [`architecture-testing.md`](architecture-testing.md)：通过 ArchUnit 等工具保护关注点分离和模块边界。
- [`verification-workflow.md`](verification-workflow.md)：AI 修改前后如何由小到大执行验证并输出证据。

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
Verification Report
```

实现和测试不能互相自证。测试的预期必须能追溯到业务规则、验收条件或公开契约。

## Bug 修复最小闭环

```text
Bug / INC
→ 找到 UC / BR
→ 最小失败测试
→ Before Fix: FAIL
→ 修改实现
→ After Fix: PASS
→ 模块/架构/必要回归
→ Verification Report
```

无法完成某一层验证时，必须明确记录为 `NOT VERIFIED` 或 `NOT RUN`，不能写成 PASS。
