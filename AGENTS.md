# AGENTS.md

## 仓库目的

本仓库维护 AI 主导开发的软件工程约定。修改本仓库时，优先保护规范的一致性、可推导性、可验证性和关注点边界。

## 阅读顺序

进行修改前按需要阅读：

1. `README.md`
2. `docs/principles/separation-of-concerns.md`
3. 与当前任务对应的专题文档
4. `docs/testing/testing-strategy.md`（涉及实现正确性、测试、CI 时）
5. `docs/traceability/git-history.md`（涉及提交或历史约定时）

不要无目的读取所有文档。

## 修改规则

- 一个文档只解决一个主要问题；
- 一个提交只承载一种主要变化原因；
- 原则、语言专项规范、测试验证、可追溯规则、工作流、模板必须保持分离；
- 修改当前规范时，不要把历史讨论过程写入当前规则正文；
- 历史变化使用 Git 提交记录；未来如引入 BC，再按 BC 规范记录；
- 可以自动推导的信息不要增加第二份手工真相源；
- 新规则必须说明它隔离了什么变化原因或降低了什么认知成本；
- 不为了形式增加无价值抽象。

## 规范语言

使用：

```text
MUST      强制要求
MUST NOT  明确禁止
SHOULD    默认推荐，允许有理由的例外
SHOULD NOT 默认不推荐
MAY       可选
```

避免同时使用多个词描述同一架构角色。

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
Git 可追溯性
```

若影响多个独立关注点，应拆成多个文档或提交。

## 新增测试/验证规范时

必须区分：

```text
Business Rule Test      证明业务决策
Use Case Test           证明流程编排
Contract / Adapter Test 证明技术实现兑现契约
Architecture Test       证明分离点未被破坏
Integration / E2E       证明关键边界组合
Verification Report     汇总真实执行证据和未验证项
```

测试预期 MUST 优先来自 Acceptance Criteria、Business Rule 或公开 Contract，不能仅从当前实现反推。

Bug 修复 SHOULD 先得到最小可复现失败证据，再修复并证明 `Before Fix: FAIL → After Fix: PASS`。

## 提交前检查

```text
- 是否只有一个主要变化原因？
- 是否修改了错误关注点？
- 是否引入与现有术语重复的新术语？
- 是否让 URL / Operation / UC / BR 更容易还是更难推导？
- 测试预期是否有独立业务依据？
- 是否明确区分 PASS、NOT VERIFIED、NOT RUN？
- 是否产生需要人工同步的重复事实？
- 是否应该补充模板或工作流，而不是污染原则文档？
```

## 仓库长期方向

优先顺序：

```text
稳定原则
→ 可执行约定
→ 测试与验证规范
→ 模板
→ 自动验证
→ 自动生成导航
```

工具必须服务规范，不应让规范依赖某个特定工具才能被理解。
