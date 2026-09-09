# Automation Governance

自动化规则变更也要按变化原因分离。

## Rule Change

改变 Checker 检查语义：单独提交，说明 SHOULD/MUST 级别和迁移影响。

## Tool Implementation Change

只优化解析、性能、错误输出且不改变规则语义：不得顺便修改 Rule Catalog。

## CI Orchestration Change

改变 Job 编排、缓存、runner：不得顺便改变业务验收语义。

## Breaking Change

以下属于 breaking convention change：

```text
复用旧 Rule Code 表达新语义
改变稳定 verify target 含义
改变 PASS/FAIL/NOT_VERIFIED 语义
改变标准路径导致导航约定失效
```

需要显式迁移说明。

## 权威来源与迁移

正文负责规则的语义、范围和级别；Rule Catalog 只提供编号、摘要和正文链接。Workflow 保留执行步骤和决策入口，模板保留证据字段，均不复制完整门禁或状态定义。这隔离了规则变化与流程/记录格式变化，降低人工同步成本。

涉及 breaking convention change 时，采用步骤放在[迁移记录](../migrations/README.md)，随对应规则变化提交；当前规则正文不保留历史讨论。升级断言或门禁级别也应明确迁移影响。
