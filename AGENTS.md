# AGENTS.md

## 仓库目的

本仓库维护 AI 主导开发的软件工程约定。修改本仓库时，优先保护规范的一致性、可推导性、可验证性、可自动执行性和关注点边界。

## 阅读顺序

进行修改前按需要阅读：

1. `README.md`
2. `docs/principles/separation-of-concerns.md`
3. 与当前任务对应的专题文档
4. `docs/testing/README.md`（涉及正确性、Bug、接口、部署验证时）
5. `docs/automation/README.md`（涉及 CI、checker、自动化工具时）
6. `docs/traceability/git-history.md`（涉及提交或历史约定时）

不要无目的读取所有文档。

## 修改规则

- 一个文档只解决一个主要问题；
- 一个提交只承载一种主要变化原因；
- 原则、语言专项规范、测试验证、自动化、可追溯规则、工作流、模板必须保持分离；
- 修改当前规范时，不要把历史讨论过程写入当前规则正文；
- 可以自动推导的信息不要增加第二份手工真相源；
- 新规则必须说明它隔离了什么变化原因或降低了什么认知成本；
- 不为了形式增加无价值抽象。

## 自动化规则

自动化 MUST 服务已有稳定规范，不得先写工具再让规范迁就工具。

优先自动化：

```text
客观可判断
高频
高风险
失败后可定位关注点
```

AI、本地和 CI SHOULD 优先使用同一稳定验证入口，例如：

```text
./scripts/verify <target>
```

如果项目已有稳定入口，不自行拼装另一套验证命令。

Workflow SHOULD 只做编排，不把 Convention Checker、业务判断、HTTP 断言和部署策略全部写进 YAML/Bash。

## 新增 Java 规范时

必须考虑是否影响：

```text
包结构
类命名
Use Case 映射
Business Rule
Port / Adapter 边界
代码导航
测试与 Verification
Architecture Checks
Git 可追溯性
```

若影响多个独立关注点，应拆成多个文档或提交。

## 测试与部署验证

必须区分：

```text
Business Rule Test      证明业务决策
Use Case Test           证明流程编排
Contract / Adapter Test 证明技术实现兑现契约
Architecture Test       证明分离点未被破坏
HTTP API Test           证明真实 HTTP 边界
Bug Regression          证明历史 Bug 不再复发
Post-Deployment         证明真实运行实例
```

测试预期 MUST 优先来自 Acceptance Criteria、Business Rule 或公开 Contract，不能仅从当前实现反推。

Bug 修复 SHOULD 证明：

```text
Before Fix: FAIL
After Fix: PASS
Post-Deployment: PASS / NOT VERIFIED
```

## 提交前检查

```text
- 是否只有一个主要变化原因？
- 是否修改了错误关注点？
- 是否引入与现有术语重复的新术语？
- 是否让 URL / Operation / UC / BR 更容易还是更难推导？
- 测试预期是否有独立业务依据？
- 是否明确区分 PASS、NOT VERIFIED、NOT RUN？
- 自动化是否只是执行规范，而不是复制业务规则？
- Workflow 是否过度承载脚本逻辑？
- 是否产生需要人工同步的重复事实？
```

## 仓库长期方向

```text
稳定原则
→ 可执行约定
→ 测试与验证规范
→ 稳定项目命令
→ 自动验证
→ 自动生成导航
```

工具必须服务规范，不应让规范依赖某个特定工具才能被理解。
