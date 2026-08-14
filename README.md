# AI Engineering Conventions

面向 AI 主导开发的软件工程约定仓库。

目标不是增加架构仪式，而是降低代码库的结构熵，让开发者、Reviewer 和 AI 对同一类问题具有相同预期，并能从外部入口稳定推导到业务实现、测试和变更历史。

## 核心目标

- **可推导**：从 URL / operationId 可以大致推导业务模块与 Use Case。
- **可辨识**：从类名可以判断业务语义与架构职责。
- **可分离**：业务规则、流程控制、外部技术和装配具有明确边界。
- **可追踪**：Use Case、Business Rule、Business Change、Incident 可以通过稳定标识关联。
- **可 Review**：代码位置、命名和变更范围具有一致规律，人工 Review 不需要先重新发现架构。
- **可复盘**：Bug 可以沿入口 → 用例 → 规则 → 测试 → 变更历史追溯。
- **可自动检查**：重要约定最终应尽量由 CI / 静态检查保证，而不是只依赖文档记忆。

## 基本导航模型

```text
Entry Point
    ↓
Operation
    ↓
Use Case
    ↓
Business Rule
    ↓
Ports / Adapters
    ↓
Tests
    ↓
Business Change / Git History
    ↓
Incident Review
```

## 目录

```text
docs/
├── principles/       # 稳定的工程原则与分离点
├── java/             # Java / Spring 的代码组织与命名约定
├── traceability/     # UC / BR / BC / INC 与 Git 可追溯规则
├── workflow/         # AI 开发、Code Review、Bug 复盘流程
└── templates/        # 项目可直接复制的模板
```

## 约定的约定

1. 规范本身也遵守关注点分离。
2. 一份文档只解决一个主要问题。
3. 一个提交只承载一种主要变化原因。
4. 当前规则、历史变更和事故记录分开维护。
5. 可以自动推导的信息不重复手工维护。
6. 先建立稳定边界，再增加工具和自动化。

本仓库会逐步补充具体规范，并优先保持规则少、语义明确、可执行、可自动验证。
