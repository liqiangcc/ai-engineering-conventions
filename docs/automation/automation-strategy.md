# 自动化验证规范

## 目标

把稳定、客观、重复发生的约定交给机器检查，让 AI 和 Reviewer 把注意力放在业务语义和真正需要判断的分离点上。

```text
规范先于工具
稳定约束优先自动化
失败信息必须能定位关注点
自动化不能成为第二套业务真相源
```

## 层次

```text
Convention Checks
→ Architecture Checks
→ Unit / Contract Tests
→ HTTP API Tests
→ Build Verification
→ Deployment Verification
```

## Convention Checks

检查 operationId、UC/BR ID、HTTP Test 路径、引用完整性和稳定命名约定。

## Architecture Checks

Java 项目优先使用 ArchUnit 或等价工具保护 domain/application/adapter/module 边界。

## HTTP Automation

仓库中的 `.http/.rest` 是可执行资产。CI 至少区分 regression、smoke、deployment、production-safe。Secret 通过 CI Environment/Secret 注入。

## Build Verification

构建证明项目可编译、检查和测试可执行，但构建成功不等于业务正确。

## Deployment Verification

```text
Build Artifact
→ Deploy
→ Verify Running Version
→ Targeted Regression
→ Smoke
→ production-safe checks
→ Deployment Verification Result
```

## 失败分类

```text
CONVENTION_FAILURE
ARCHITECTURE_FAILURE
BUSINESS_RULE_FAILURE
USE_CASE_FLOW_FAILURE
CONTRACT_FAILURE
HTTP_API_FAILURE
BUILD_FAILURE
DEPLOYMENT_VERIFICATION_FAILURE
TEST_ENVIRONMENT_FAILURE
```

## 自动化优先级

```text
P0 构建 + 现有测试
P1 Architecture Tests
P1 HTTP regression + Bug regression
P2 Convention Checker MVP
P2 Post-Deployment Verification
P3 自动导航和 Verification Summary
```

## Non-goal

自动化不负责决定 BR 是否业务上正确、模块是否应该重划、AC 是否完整、生产破坏性写操作是否允许执行。
