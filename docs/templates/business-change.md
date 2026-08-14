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

## 验收场景

- [ ] {scenario 1}
- [ ] {scenario 2}
- [ ] {boundary scenario}

## 测试证据

- {rule test}
- {use case test}
- {integration/e2e test if needed}

## 发布与回滚

{如果需要，说明发布顺序、特性开关、回滚条件。}
