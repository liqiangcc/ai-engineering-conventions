# INC-{YYYY}-{NNN} {事故名称}

> 这是 Incident 复盘模板。重点不是记录“谁写错了”，而是恢复完整因果链并改进系统防线。

## Metadata

```yaml
id: INC-{YYYY}-{NNN}
severity: {level}
status: closed
operations:
  - {operationId}
useCases:
  - UC-{MODULE}-{NNN}
businessRules:
  - BR-{MODULE}-{NNN}
relatedBusinessChanges:
  - BC-{YYYY}-{NNN}
```

## 现象

{用户或系统观察到什么。}

## 影响

{影响范围、持续时间、数据/业务影响。}

## 触发入口

```text
HTTP / MQ / MCP / CLI / Job
{具体入口}
```

## 因果链

```text
Entry
→ Operation
→ Use Case
→ Business Rule
→ Adapter / Infrastructure
→ Failure
```

{说明实际链路。}

## 根因分类

选择主要类型：

```text
Requirement Gap
Business Rule Defect
Use Case Orchestration Defect
Adapter / Mapping Defect
Infrastructure Defect
Data Defect
Observability Defect
```

根因：

{说明为什么发生，而不仅是指出错误行。}

## 为什么测试没有发现

{缺了哪个场景、哪一层测试或哪个契约。}

## 为什么 Review 没有发现

{信息是否不可见、规则是否未显式化、Diff 是否被重构噪声污染等。}

## 修复

- {fix}

## 防复发措施

优先选择系统性措施：

- [ ] 补充 BR 决策表；
- [ ] 增加规则单元测试；
- [ ] 增加 Use Case 测试；
- [ ] 增加 Adapter 契约测试；
- [ ] 增加架构/CI 检查；
- [ ] 改进日志、指标或诊断信息；
- [ ] 更新需求/Review 流程。

## 关联修复

```text
PR: {reference}
Commit: {reference}
```

## 复盘结论

{最重要的一到三条可复用结论。}
