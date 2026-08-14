# AI Verification Workflow

## 目标

AI 完成代码修改后，必须用可重复证据回答：

> 这次修改为什么可以认为是正确的？还有什么没有被验证？部署出去的真实实例是否也已经验证？

Verification 不是一句“tests passed”，而是一条从业务依据到运行实例的证据链。

## 验证输入

开始验证前，先确定：

```text
Affected Operation(s)
Affected Use Case(s) / UC
Affected Business Rule(s) / BR
Acceptance Criteria / 当前规则
Affected Adapter / Contract（如有）
HTTP API / operationId（如有）
Architecture Boundary（如有）
Deployment Target（如果任务包含部署）
```

如果无法确定业务预期，AI 不得根据现有实现自行发明预期并宣布验证通过。

## 标准循环

### Pre-Deployment

```text
1. 定位验收依据
2. 确定受影响 UC / BR / Contract / HTTP Operation
3. 建立修改前基线
4. Bug 优先先复现
5. 修改实现
6. 运行最小相关测试
7. 运行模块级测试
8. 运行 Contract / Integration（按影响范围）
9. 运行 Architecture Tests
10. 运行 HTTP API Tests（HTTP 行为受影响时）
11. 运行仓库级回归（按风险）
12. 输出 Pre-Deployment Verification
```

### Post-Deployment（任务包含部署时）

```text
13. 确认 Deployment Identity
14. Health / Readiness
15. 重放本次 Targeted HTTP / Bug Regression Case
16. 运行 Deployment Smoke Tests
17. 生产只运行 production-safe Case
18. 输出 Post-Deployment Verification
```

## 1. 定位验收依据

依据优先来自：

```text
当前 Business Rule
Business Change 中的 Acceptance Criteria
公开 API / Port Contract
已批准的领域决策
```

不要把当前实现当作唯一 Oracle。

## 2. 计算最小验证集合

根据修改文件和语义确定最小测试集合。

例如修改：

```text
OrderCancellationPolicy
```

至少运行：

```text
OrderCancellationPolicyTest
CancelOrderUseCaseTest（直接使用该规则时）
order 模块 Architecture Tests
```

如果取消订单通过 HTTP 对外暴露且外部行为受影响，再加入：

```text
tests/http/order/cancel-order.http
```

如果只修改 `JpaOrderRepositoryAdapter`，优先运行：

```text
OrderRepositoryContract
JpaOrderRepositoryAdapterTest
相关模块 Integration Test
Architecture Tests
```

不要无条件先跑整个仓库来掩盖“到底验证了什么”。

## 3. 修改前基线

能够执行时，修改前先运行最小相关测试并记录结果。

目的：

- 确认测试环境可用；
- 区分已有失败与本次引入失败；
- Bug 修复时确认新测试确实能够复现。

如果仓库原本就有失败项，必须在报告中标记为 `Pre-existing Failure`。

## 4. Bug 修复先复现

推荐顺序：

```text
Incident / Bug
→ 找到 BR / UC / operationId
→ 写最小失败测试
→ 修改前 FAIL
→ 修复实现
→ 同一个测试修改后 PASS
→ 永久保留为 Regression Case
→ 运行回归
```

失败测试应断言正确业务行为，因此修复前失败、修复后通过。

HTTP Bug 详细规则见 `bug-reproduction-testing.md`。

如果无法自动复现（例如只能在不可控外部环境触发），应记录原始证据和未验证范围。

## 5. 最小相关测试

优先顺序：

```text
BR Test
→ UC Test
→ Contract / Adapter Test
→ HTTP API Test（当外部 HTTP 行为相关）
```

一旦失败，先在最小层分类并修复，不要继续扩大测试范围制造噪音。

## 6. 模块测试

最小测试通过后运行受影响业务模块的完整测试。

目标是发现：

- 同一模块其他 Use Case 的回归；
- 共享 Rule / Policy 的影响；
- 测试 Fixture 或公共契约变化。

## 7. Contract / Integration

以下变化通常需要：

```text
数据库映射
外部 HTTP 协议
MQ Schema
Redis 原子行为
序列化格式
跨模块公开 API
```

只运行与变化边界相关的集成测试，不用“全量集成测试”替代影响分析。

## 8. Architecture Tests

涉及以下变化必须运行：

```text
新增类
移动包
新增依赖
跨模块调用
新增 Adapter / Port
重构领域/application 边界
```

功能正确但架构约束失败，仍视为未完成。

## 9. HTTP API Tests

HTTP Endpoint、认证、参数、响应、异常映射或真实外部行为发生变化时 SHOULD 运行对应可执行 HTTP Case。

推荐通过 `operationId` 推导：

```text
cancelOrder
→ tests/http/order/cancel-order.http
```

HTTP API Test 只覆盖高价值外部行为，不重复领域决策表。

详见 `http-api-testing.md`。

## 10. 仓库级回归

以下场景建议运行全仓测试：

- 修改 shared/kernel；
- 修改公共模块 API；
- 修改基础框架配置；
- 修改构建插件或测试基础设施；
- 影响多个业务模块；
- 发布前要求完整回归。

如果全仓测试成本过高，应由 CI 分层执行，并在报告中给出对应 run/check 证据。

## 11. Post-Deployment Verification

如果任务包含部署，Pre-Deployment PASS 不是最终结束条件。

部署后 SHOULD：

```text
确认运行版本
→ Health / Readiness
→ 执行本次 Targeted Case
→ Bug Fix 重放同一个 Regression Case
→ Deployment Smoke
→ 生产仅执行 production-safe Case
```

详细规则见 `post-deployment-verification.md`。

AI 必须区分：

```text
Pre-Deployment VERIFIED
Post-Deployment VERIFIED
```

如果只有前者，不能写“部署后已验证”。

## 失败分类

验证失败先分类：

```text
BUSINESS_RULE_FAILURE
USE_CASE_FLOW_FAILURE
CONTRACT_FAILURE
ADAPTER_FAILURE
HTTP_BOUNDARY_FAILURE
ARCHITECTURE_FAILURE
REGRESSION_FAILURE
WRONG_ARTIFACT
DEPLOYMENT_CONFIGURATION_FAILURE
ROUTING_FAILURE
DEPENDENCY_FAILURE
TEST_ENVIRONMENT_FAILURE
PRE_EXISTING_FAILURE
```

分类的目的，是让 AI 先找正确的关注点，不要在错误层修补症状。

## 禁止的“修绿”方式

AI 不得为了获得 PASS：

- 删除失败测试；
- 放宽与业务要求直接相关的断言；
- 把真实待验证依赖全部 Mock 掉；
- 给生产代码增加只服务测试的逃生分支；
- 跳过 Architecture Test；
- 部署后重新手工拼一个语义不同的请求来替代原 Bug Case；
- 把失败解释成“可能是环境问题”但不提供证据；
- 把未运行写成“通过”。

## Verification Report

每次重要修改完成时至少输出：

```text
Affected
- Operations
- UC
- BR

Acceptance Criteria
- AC-01 PASS
- AC-02 PASS

Pre-Deployment Verification
- Rule tests: PASS
- Use case tests: PASS
- Module tests: PASS
- Contract/integration: PASS / NOT REQUIRED / NOT VERIFIED
- Architecture tests: PASS
- HTTP API tests: PASS / NOT REQUIRED / NOT VERIFIED
- Repository regression: PASS / NOT RUN

Bug Reproduction
- Before fix: FAIL（如果是 Bug 修复）
- After fix: PASS
- Permanent regression case: {path}

Post-Deployment Verification（如已部署）
- Environment
- Expected / Running Version
- Targeted case: PASS / FAIL / NOT VERIFIED
- Deployment smoke: PASS / FAIL / NOT RUN
- Production-safe smoke: PASS / FAIL / NOT RUN

Not Verified
- 明确列出没有执行或无法证明的项目

Pre-existing Failures
- 与本次无关但观察到的已有失败
```

## 完成定义

AI 只有在以下条件成立时才能对相应阶段说“已验证”：

1. 验收依据明确；
2. 受影响层的测试已执行；
3. 测试结果有真实运行证据；
4. 失败项已分类；
5. 未验证项被明确披露；
6. 如果声明 Post-Deployment VERIFIED，必须有目标环境和运行版本证据。

如果只完成代码静态检查，应使用“实现完成，尚未完成运行验证”等准确表述。

如果 Pre-Deployment 全部通过但尚未部署，应使用“Pre-Deployment VERIFIED；Post-Deployment NOT RUN”。
