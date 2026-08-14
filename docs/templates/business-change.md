# BC-{YYYY}-{NNN} {变更名称}

> 这是一次业务变更模板。它记录“为什么改”和“改了什么”，不是当前规则的长期说明书。

## Metadata

```yaml
id: BC-{YYYY}-{NNN}
status: proposed
modules:
  - {module}
operations:
  - {operationId}
useCases:
  - UC-{MODULE}-{NNN}
businessRules:
  - BR-{MODULE}-{NNN}
```

## 背景

{为什么需要这次变更。}

## 变更前行为

{当前系统如何工作。}

## 变更后行为

{本次变更完成后系统应该如何工作。}

## Acceptance Criteria

Acceptance Criteria 是本次 BC 的局部稳定编号。引用时推荐写成 `BC-{YYYY}-{NNN}/AC-01`，避免不同 BC 的 `AC-01` 混淆。

| ID | Scenario / Given | When | Expected |
|---|---|---|---|
| AC-01 | {given} | {when} | {expected} |
| AC-02 | {given} | {when} | {expected} |
| AC-03 | {boundary/error case} | {when} | {expected} |

要求：

- AC 描述外部可观察的业务行为，不描述具体 Java 实现。
- 至少包含主要成功场景、关键拒绝场景和边界场景（适用时）。
- AI 测试应从 AC / BR 推导，不得仅根据当前实现生成预期。

## 关注点与影响范围

### 需要修改

- {module / use case / rule / adapter}

### 明确不修改

- {unaffected concern}

## API 影响

```text
None / Compatible / Breaking
```

{如有变化，列出 endpoint、operationId、请求/响应变化。}

如果 HTTP 外部行为受影响，列出对应可执行测试：

```text
tests/http/{module}/{operation}.http
```

## 数据影响

```text
None / Migration required / Backfill required
```

{说明数据库、缓存、消息兼容性。}

## 业务规则变化

| Rule | Before | After |
|---|---|---|
| BR-{MODULE}-{NNN} | {before} | {after} |

## 测试映射

| Acceptance Criteria | Business Rule / Contract | Test Evidence |
|---|---|---|
| AC-01 | BR-{MODULE}-{NNN} | {test class / scenario} |
| AC-02 | BR-{MODULE}-{NNN} | {test class / HTTP case} |
| AC-03 | {BR / UC / Contract} | {test class / scenario} |

## Pre-Deployment Verification

- [ ] 相关 Business Rule Tests 通过
- [ ] 相关 Use Case Tests 通过
- [ ] 相关 Contract / Adapter Tests 通过或明确不需要
- [ ] Architecture Tests 通过
- [ ] HTTP API Tests 通过或明确不需要
- [ ] 模块回归通过
- [ ] 未验证项已记录

## Post-Deployment Verification

如果本次变更需要部署到运行环境：

- [ ] 已确认运行版本 / commit / image digest
- [ ] Health / Readiness 通过
- [ ] 本次变更 Targeted Case 通过
- [ ] Deployment Smoke 通过
- [ ] 生产仅执行 production-safe Case
- [ ] 生产无法安全执行的场景已标记 `NOT VERIFIED`

完整证据使用 `verification-report.md` 模板。

## 发布与回滚

{说明目标环境、发布顺序、特性开关、推广门禁和回滚条件。}

如果 staging 的 Targeted Verification / Required Smoke FAIL，默认不得继续推广到下一环境。
