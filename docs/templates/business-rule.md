# BR-{MODULE}-{NNN} {规则名称}

> 这是当前业务规则模板。只描述当前有效语义，不在正文累积完整历史；历史原因由 BC / PR / Git 保存。

## Metadata

```yaml
id: BR-{MODULE}-{NNN}
name: {规则名称}
module: {module}
status: active
useCases:
  - UC-{MODULE}-{NNN}
implementation:
  - {path-or-generated-reference}
tests:
  - {path-or-generated-reference}
```

## 业务目的

{这条规则为什么存在，保护什么业务约束。}

## 当前规则

{使用业务语言准确描述当前规则。}

## 决策表

| 条件 A | 条件 B | 结果 | 原因码 |
|---|---|---|---|
| {value} | {value} | {允许/拒绝/分类} | {reason} |

## 边界与非职责

本规则负责：

- {responsibility}

本规则不负责：

- {non-responsibility}

## 关键示例

### 允许场景

{example}

### 拒绝/边界场景

{example}

## 验证要求

- 每个关键决策分支必须有测试；
- Bug 发现的新场景应优先补充到决策表；
- 实现路径和测试路径如果可以自动扫描，应由 CI 生成或验证。
