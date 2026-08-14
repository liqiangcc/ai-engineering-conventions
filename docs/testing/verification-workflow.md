# AI Verification Workflow

## 目标

AI 完成代码修改后，必须用可重复证据回答：

> 这次修改为什么可以认为是正确的？还有什么没有被验证？

Verification 不是一句“tests passed”，而是一条从业务依据到测试结果的证据链。

## 验证输入

开始验证前，先确定：

```text
Affected Operation(s)
Affected Use Case(s) / UC
Affected Business Rule(s) / BR
Acceptance Criteria / 当前规则
Affected Adapter / Contract（如有）
Architecture Boundary（如有）
```

如果无法确定业务预期，AI 不得根据现有实现自行发明预期并宣布验证通过。

## 标准循环

```text
1. 定位验收依据
2. 确定受影响 UC / BR / Contract
3. 建立修改前基线
4. Bug 优先先复现
5. 修改实现
6. 运行最小相关测试
7. 运行模块级测试
8. 运行 Contract / Integration（按影响范围）
9. 运行 Architecture Tests
10. 运行仓库级回归（按风险）
11. 输出 Verification Report
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
→ 找到 BR / UC
→ 写最小失败测试
→ 修改前 FAIL
→ 修复实现
→ 修改后 PASS
→ 运行回归
```

失败测试应复现业务现象，而不是绑定某一行代码。

如果无法自动复现（例如只能在不可控外部环境触发），应记录人工证据和未验证范围。

## 5. 最小相关测试

优先顺序：

```text
BR Test
→ UC Test
→ Contract / Adapter Test
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

## 9. 仓库级回归

以下场景建议运行全仓测试：

- 修改 shared/kernel；
- 修改公共模块 API；
- 修改基础框架配置；
- 修改构建插件或测试基础设施；
- 影响多个业务模块；
- 发布前要求完整回归。

如果全仓测试成本过高，应由 CI 分层执行，并在报告中给出对应 run/check 证据。

## 失败分类

验证失败先分类：

```text
BUSINESS_RULE_FAILURE
USE_CASE_FLOW_FAILURE
CONTRACT_FAILURE
ADAPTER_FAILURE
ARCHITECTURE_FAILURE
REGRESSION_FAILURE
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

Verification
- Rule tests: PASS
- Use case tests: PASS
- Module tests: PASS
- Contract/integration: PASS / NOT REQUIRED / NOT VERIFIED
- Architecture tests: PASS
- Repository regression: PASS / NOT RUN

Bug Reproduction
- Before fix: FAIL（如果是 Bug 修复）
- After fix: PASS

Not Verified
- 明确列出没有执行或无法证明的项目

Pre-existing Failures
- 与本次无关但观察到的已有失败
```

## 完成定义

AI 只有在以下条件成立时才能说“已验证”：

1. 验收依据明确；
2. 受影响层的测试已执行；
3. 测试结果有真实运行证据；
4. 失败项已分类；
5. 未验证项被明确披露。

如果只完成代码静态检查，应使用“实现完成，尚未完成运行验证”等准确表述。