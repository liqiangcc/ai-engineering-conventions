# AI 开发流程

## 目标

AI 不应从“直接改代码”开始，而应先确定业务坐标、分离点和验证依据，使修改范围可预测、可 Review、可验证。

## 开始修改前

AI SHOULD 依次确定：

```text
1. Entry Point / Operation
2. Business Module
3. Use Case / UC
4. Business Rule / BR
5. Acceptance Criteria / 当前规则
6. Port / Adapter（若涉及外部能力）
7. 当前测试与最小验证集合
8. 相关 BC / Git 历史（仅在需要理解变化原因时）
```

## 修改前输出

复杂任务在实现前 SHOULD 明确：

```text
Affected Module
Affected Operation
Affected Use Case
Affected Business Rules
Acceptance Criteria
Allowed Change Scope
Explicitly Unchanged Concerns
Verification Plan
```

目的不是写长计划，而是防止 AI 无边界扩散修改。

## 修改顺序

推荐：

```text
需求/缺陷
→ 明确当前规则 / Acceptance Criteria
→ 确认修改前测试基线
→ Bug 先增加最小失败测试并复现
→ 修改 Domain Rule / Policy
→ 修改 Use Case 编排（如需要）
→ 修改 Adapter（如契约/技术实现受影响）
→ 运行最小相关测试
→ 运行模块测试
→ 运行 Contract / Integration（按影响）
→ 运行 Architecture Tests
→ 运行仓库回归（按风险）
→ 更新 BR / BC（仅当语义需要）
→ 输出 Verification Report
```

完整验证规则见 [`../testing/verification-workflow.md`](../testing/verification-workflow.md)。

## 关注点限制

AI MUST NOT 因为实现方便：

- 把业务判断写进 Controller；
- 在 Use Case 直接写 SQL / Redis / HTTP；
- 跨模块访问内部 Repository 或 Entity；
- 为一个局部需求顺便重构无关模块；
- 把机械重命名和业务语义变化混在一个提交；
- 新增 `CommonService`、`Utils`、`Manager` 作为逃生口；
- 删除失败测试或降低断言来获得绿色结果；
- 把未运行的测试写成已通过。

## 查找策略

优先使用：

```text
operationId
业务动作前缀
UC ID
BR ID
BC/AC
模块 README / 导航图
```

只有上述路径无法定位时，再扩大搜索范围。

## 验证策略

修改哪一层，就先在最靠近该层的位置证明行为：

```text
Business Rule change
→ Business Rule Test

Use Case orchestration change
→ Use Case Test with Fake/Stub Ports

Adapter mapping/protocol change
→ Contract / Adapter Test

Dependency/package/module change
→ Architecture Test

Critical user flow
→ 少量 Integration / E2E
```

从最小相关测试逐层扩大，不用大型 E2E 替代业务规则测试。

## Bug 修复规则

Bug SHOULD 先形成可复现证据：

```text
Before Fix: FAIL
After Fix: PASS
```

如果无法自动复现，必须在 Verification Report 的 `Not Verified` 中说明原因和可获得的替代证据。

## 提交拆分

AI SHOULD 按变化原因拆提交。

典型顺序：

```text
refactor: 纯机械结构调整（如必须）
feat/fix: 业务行为 + 必要测试
adapter: 技术适配变化（若可独立）
docs: 当前规则/BC 更新（视团队策略可与行为提交同提交）
```

如果文档与代码必须原子更新以保证当前规则一致，可以同提交；无关文档整理必须分开。

## 完成报告

完成后 SHOULD 使用 Verification Report 结构简洁报告：

```text
Changed UC / BR
Acceptance Criteria results
Behavior change
Tests actually executed
Architecture/contract checks
Bug before/after evidence（适用时）
Not Verified
Pre-existing Failures
Public API / Data impact
```

## 原则

AI 的优势是快速生成，规范的作用是限制它的搜索空间、修改空间和自我判断空间。

目标不是让 AI 写更多代码，而是让它更少需要猜测，并能用独立证据说明对错。
