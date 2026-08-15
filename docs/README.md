# Documentation Map

文档按关注点组织。不要把所有规范合并到一个大文件。

## principles

稳定、跨语言的工程原则：关注点分离、逻辑与控制分离、复杂度预算。

## java

Java / Spring 的具体落地：包结构、类命名、Use Case 映射、BR/UC 注解，以及自动验证工具如何映射到 Java 技术栈。

## testing

回答“如何证明行为正确”：

```text
Business Rule / Use Case
Contract / Architecture
HTTP API
Bug Regression
Verification Workflow
Post-Deployment Verification
```

## automation

回答“如何让机器重复执行规范”：

```text
automation-strategy.md  自动化边界与优先级
convention-checker.md   导航/命名/ID/路径完整性
ci-pipeline.md          PR 与 Deployment Pipeline
verification-command.md AI/本地/CI 的统一验证入口
```

## traceability

回答“怎么找到和追历史”：

```text
identity-system.md
code-navigation.md
git-history.md
generated-navigation.md
```

自动导航只生成视图，不成为新的业务真相源。

## workflow

回答“开发、Review、复盘怎么执行”：

```text
ai-development.md
code-review.md
incident-review.md
```

## templates

项目记录模板：

```text
business-rule.md
business-change.md
verification-report.md
incident.md
pull-request.md
```

## roadmap

回答“自动化先做什么、后做什么”：

```text
统一验证入口
→ ArchUnit
→ HTTP regression
→ Convention Checker MVP
→ Deployment Verification
→ 自动导航
→ Verification Summary
```

## 选择文档的原则

```text
为什么要分            → principles
Java 怎么组织          → java
怎么证明正确           → testing
怎么自动执行           → automation
怎么找到/追历史        → traceability
开发/Review/复盘怎么做 → workflow
如何落地记录           → templates
先实现什么             → roadmap
```

## 避免重复

同一个事实只应有一个权威来源：

```text
当前工程原则         → principles / java
当前业务规则         → 项目自己的 BR 文档 + 代码
本次验收预期         → BC / Acceptance Criteria
可执行正确性证据     → Tests / Verification Report / CI
自动执行方式         → 项目稳定命令 + CI
一次业务变化原因     → BC / PR / Git
一次事故             → INC
可从代码得到的映射   → 自动生成索引
```

导航文档可以链接这些来源，但不要复制完整内容。
