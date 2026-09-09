# AI 开发流程

## 目标

AI 不应从“直接改代码”开始，而应先确定业务坐标、分离点和验证依据，使修改范围可预测、可 Review、可验证，并在部署后能够证明真实运行实例正确。

## 开始修改前

先按[从需求输入到研发 Issue](requirement-to-issue.md)整理任务上下文，明确用例、规则与验收依据。已有任务记录直接补齐和引用，无需另建重复记录。

GitHub / GitLab Issue 的读取和更新遵循[Issue 命令行操作](issue-cli.md)，分别使用 `gh` / `glab`。

每次开始或恢复任务，按[Issue 进度与中文标签](issue-progress.md)核对阶段和实际证据，推进尚未完成的工作，并在关键变化时更新 Issue。

AI SHOULD 依次确定：

```text
1. Entry Point / Operation
2. Business Module
3. Use Case / UC
4. Business Rule / BR
5. Acceptance Criteria / 当前规则
6. Port / Adapter（若涉及外部能力）
7. HTTP API Test（若有 HTTP 入口）
8. 当前测试与最小验证集合
9. Deployment Target（如果任务包含部署）
10. 相关 BC / Git 历史（仅在需要理解变化原因时）
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
Deployment Verification Plan（如适用）
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
→ 更新 HTTP API Case（如外部行为受影响）
→ 运行最小相关测试
→ 运行模块测试
→ 运行 Contract / Integration（按影响）
→ 运行 Architecture Tests
→ 运行 HTTP API Tests（按影响）
→ 运行仓库回归（按风险）
→ 更新 BR / BC（仅当语义需要）
→ 输出 Pre-Deployment Verification
→ 部署（如果任务包含部署）
→ Post-Deployment Verification
→ 输出最终 Verification Report
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
- 把未运行的测试写成已通过；
- 用临时 curl 代替仓库中已经存在的可执行 HTTP Case；
- 把本地/CI PASS 表述成“部署后已验证”。

## 查找策略

优先使用：

```text
operationId
业务动作前缀
UC ID
BR ID
BC/AC
HTTP Test path
模块 README / 导航图
```

例如：

```text
cancelOrder
→ CancelOrderUseCase
→ BR-ORDER-003
→ tests/http/order/cancel-order.http
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

HTTP route/auth/request/response behavior
→ HTTP API Test

Deployment/environment behavior
→ Post-Deployment Verification

Critical cross-system user flow
→ 少量 Integration / E2E
```

从最小相关测试逐层扩大，不用大型 E2E 替代业务规则测试。

## Bug 修复规则

执行[Bug Reproduction 规范](../testing/bug-reproduction-testing.md)：定位预期与最小 Case → 修复前复现 → 修改实现 → 同一 Case 复验 → 保留永久回归资产。

无法复现时记录原因、原始证据和未验证范围；默认路径、断言要求及证据字段以该规范为准。

## 部署后验证规则

任务包含部署时，执行[部署验证流程](../testing/post-deployment-verification.md#标准流程)：确认运行版本 → targeted verification → smoke → 记录目标环境证据。

晋级遵守[发布门禁](../testing/post-deployment-verification.md#发布门禁)，生产场景按[安全标签定义](../testing/post-deployment-verification.md#生产环境)选择。未运行项进入报告，不从本地或 CI 结果推断生产行为。

## 提交拆分

AI SHOULD 按变化原因拆提交。

典型顺序：

```text
refactor: 纯机械结构调整（如必须）
feat/fix: 业务行为 + 必要测试
adapter: 技术适配变化（若可独立）
test: HTTP/Regression/Verification 资产（当可独立）
docs: 当前规则/BC 更新（视团队策略可与行为提交同提交）
```

如果测试是定义本次行为不可分割的证据，可以与对应 fix/feat 同提交；无关测试整理必须分开。

## 完成报告

完成后 SHOULD 使用 Verification Report 结构简洁报告：

```text
Changed UC / BR
Acceptance Criteria results
Behavior change
Tests actually executed
HTTP API evidence（适用时）
Architecture/contract checks
Bug before/after evidence（适用时）
Permanent regression path（适用时）
Pre-Deployment result
Post-Deployment result（适用时）
Running version / environment（已部署时）
Not Verified
Pre-existing Failures
Public API / Data impact
```

## 原则

AI 的优势是快速生成，规范的作用是限制它的搜索空间、修改空间和自我判断空间。

目标不是让 AI 写更多代码，而是让它更少需要猜测，并能用独立证据说明：代码正确、外部接口正确、部署出去的实例也确实正确。
