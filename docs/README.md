# Documentation Map

文档按关注点组织。不要把所有规范合并到一个大文件。

## principles

稳定、跨语言的工程原则：

```text
separation-of-concerns.md  哪些变化原因应该建立边界
logic-and-control.md       业务决策与流程编排如何分离
complexity-budget.md       什么时候不应继续拆分
```

## java

Java / Spring 的具体落地约定：

```text
package-structure.md          代码放在哪里
class-naming.md               类名如何表达职责
use-case-convention.md        入口如何映射到应用行为
business-rule-annotations.md  UC / BR 如何进入代码导航
```

## testing

如何让 AI 和人工用独立证据判断实现是否正确，并验证真实部署实例：

```text
testing-strategy.md             分层验证策略与正确性来源
business-rule-testing.md        业务规则/决策表如何测试
use-case-testing.md             应用流程如何测试
adapter-contract-testing.md     Port / Adapter 契约如何验证
architecture-testing.md         分离点和依赖方向如何机器检查
http-api-testing.md             真实 HTTP 边界如何形成可执行测试资产
bug-reproduction-testing.md     Bug 如何复现并转化为永久回归
verification-workflow.md        AI 从最小测试到部署验证的完整循环
post-deployment-verification.md 如何证明目标环境真实实例已正确部署
```

HTTP Operation 默认可推导：

```text
operationId: cancelOrder
→ tests/http/order/cancel-order.http
```

Bug 修复默认形成：

```text
Before Fix: FAIL
→ After Fix: PASS
→ Permanent Regression
→ Post-Deployment Verification
```

## traceability

当前实现与历史变化如何建立稳定关联：

```text
identity-system.md   UC / BR / BC / INC
code-navigation.md   如何从入口导航到实现、测试和历史
git-history.md       如何保持业务可读的 Git 历史
```

Acceptance Criteria 使用 BC 内局部 ID，例如 `BC-2026-014/AC-02`，用于把业务预期与测试证据连接起来。

## workflow

规范如何在真实开发过程中执行：

```text
ai-development.md  AI 修改代码、验证并完成部署后确认的固定路径
code-review.md     人工/AI Review 业务行为、边界、复现和部署证据的固定路径
incident-review.md Bug/事故复盘、永久回归与部署恢复验证的固定路径
```

## templates

项目可以复制并按需裁剪：

```text
business-rule.md
business-change.md
verification-report.md
incident.md
pull-request.md
```

## 选择文档的原则

如果问题是“为什么要分”，读 `principles`。

如果问题是“Java 代码具体怎么放、怎么叫”，读 `java`。

如果问题是“怎么证明实现正确、如何复现 Bug、部署后怎么验证”，读 `testing`。

如果问题是“怎么找到、怎么追历史”，读 `traceability`。

如果问题是“开发、Review、复盘怎么执行”，读 `workflow`。

如果要创建具体项目记录，使用 `templates`。

## 避免重复

同一个事实只应有一个权威来源：

```text
当前工程原则         → principles / java
当前业务规则         → 项目自己的 BR 文档 + 代码
本次验收预期         → BC / Acceptance Criteria
可执行正确性证据     → Tests / HTTP Cases / Verification Report / CI
部署后运行证据       → Post-Deployment Verification
一次业务变化原因     → BC / PR / Git
一次事故             → INC
历史 Bug 防回归行为  → Permanent Regression Case
可从代码得到的映射   → 自动生成索引
```

导航文档可以链接这些来源，但不要复制完整内容。
