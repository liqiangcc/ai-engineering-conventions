# AI Engineering Conventions

面向 AI 主导开发的软件工程约定仓库。

目标不是增加架构仪式，而是降低代码库的结构熵，让开发者、Reviewer 和 AI 对同一类问题具有相同预期，并能从外部入口稳定推导到业务实现、验证证据和变更历史。

## 核心目标

- **可推导**：从 URL / operationId 可以大致推导业务模块与 Use Case。
- **可辨识**：从类名可以判断业务语义与架构职责。
- **可分离**：业务规则、流程控制、外部技术和装配具有明确边界。
- **可验证**：从 Acceptance Criteria / BR 可以推导测试，并明确已验证与未验证范围。
- **可追踪**：Use Case、Business Rule、Business Change、Incident 可以通过稳定标识关联。
- **可 Review**：代码位置、命名、测试证据和变更范围具有一致规律。
- **可复盘**：Bug 可以沿入口 → 用例 → 规则 → 测试 → 变更历史追溯，并留下修复前后证据。
- **可自动执行**：稳定约定、架构边界、HTTP 回归和部署验证可由统一命令与 CI/CD 执行。

## 基本导航模型

```text
Business Change / Acceptance Criteria
    ↓
Entry Point / Operation
    ↓
Use Case
    ↓
Business Rule
    ↓
Ports / Adapters
    ↓
Layered Tests / HTTP API Tests
    ↓
Pre-Deployment Verification
    ↓
Deployment
    ↓
Post-Deployment Verification
    ↓
Git History / Incident Review
```

## 规范入口

### 工程原则

- [关注点分离与分离点](docs/principles/separation-of-concerns.md)
- [逻辑与控制分离](docs/principles/logic-and-control.md)
- [复杂度预算](docs/principles/complexity-budget.md)

### Java / Spring

- [包结构规范](docs/java/package-structure.md)
- [类命名规范](docs/java/class-naming.md)
- [Use Case 与入口映射](docs/java/use-case-convention.md)
- [Use Case 与 Business Rule 注解](docs/java/business-rule-annotations.md)
- [Java 自动验证落地参考](docs/java/automation-reference.md)

### 测试与验证

- [Testing & Verification](docs/testing/README.md)
- [HTTP API 测试](docs/testing/http-api-testing.md)
- [Bug Reproduction / Regression](docs/testing/bug-reproduction-testing.md)
- [Post-Deployment Verification](docs/testing/post-deployment-verification.md)

### 自动化

- [Automation](docs/automation/README.md)
- [自动化验证策略](docs/automation/automation-strategy.md)
- [Convention Checker](docs/automation/convention-checker.md)
- [CI Pipeline 参考设计](docs/automation/ci-pipeline.md)
- [统一验证命令](docs/automation/verification-command.md)

### 可追溯性

- [稳定标识体系](docs/traceability/identity-system.md)
- [Git 与业务变更历史](docs/traceability/git-history.md)
- [代码导航与自动索引](docs/traceability/code-navigation.md)
- [自动生成导航](docs/traceability/generated-navigation.md)

### 工作流

- [AI 开发流程](docs/workflow/ai-development.md)
- [Code Review 流程](docs/workflow/code-review.md)
- [Incident / Bug 复盘流程](docs/workflow/incident-review.md)

### 模板

- [Business Rule](docs/templates/business-rule.md)
- [Business Change / Acceptance Criteria](docs/templates/business-change.md)
- [Verification Report](docs/templates/verification-report.md)
- [Incident](docs/templates/incident.md)
- [Business Change Pull Request](docs/templates/pull-request.md)

### 实施路线

- [Automation Roadmap](docs/roadmap/README.md)
- [自动化实施路线](docs/roadmap/implementation-roadmap.md)

## 约定的约定

1. 规范本身也遵守关注点分离。
2. 一份文档只解决一个主要问题。
3. 一个提交只承载一种主要变化原因。
4. 当前规则、验证证据、历史变更和事故记录分开维护。
5. 可以自动推导的信息不重复手工维护。
6. 测试预期来自 AC / BR / Contract，不从当前实现自证正确。
7. AI、本地开发和 CI 优先调用同一稳定验证入口。
8. 自动化是规范执行层，不是新的业务真相源。
9. AI 生成成本低不代表认知复杂度免费；优先选择重复但可预测的结构。

完整文档地图见 [docs/README.md](docs/README.md)。
