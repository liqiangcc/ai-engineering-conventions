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
| AC-02 | BR-{MODULE}-{NNN} | {test class / scenario} |
| AC-03 | {BR / UC / Contract} | {test class / scenario} |

## Verification

- [ ] 相关 Business Rule Tests 通过
- [ ] 相关 Use Case Tests 通过
- [ ] 相关 Contract / Adapter Tests 通过或明确不需要
- [ ] Architecture Tests 通过
- [ ] 模块回归通过
- [ ] 未验证项已记录

完整证据可使用 `verification-report.md` 模板。

## 发布与回滚

{如果需要，说明发布顺序、特性开关、回滚条件。}
