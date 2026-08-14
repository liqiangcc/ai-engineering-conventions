# Post-Deployment Verification

## 目的

本地、单元测试和 CI 通过，只能证明“准备部署的代码在验证环境中满足预期”。

Post-Deployment Verification 用来证明：

> **实际部署出去、正在对外提供服务的那个实例**，确实是预期版本，并且关键行为在目标环境中仍然正确。

它专门隔离以下风险：

```text
部署了错误版本 / 旧镜像
Spring Profile 或环境变量不同
数据库 Migration 未执行
网关或反向代理路由错误
认证配置不同
缓存 / 配置中心未刷新
外部依赖地址不同
目标环境数据或权限差异
服务虽然启动但关键接口不可用
```

## 验证对象

部署后验证的对象不是源码，而是一个明确的 Deployment Target。

每次验证 SHOULD 记录：

```text
Environment
Base URL / Service Endpoint
Application Version / Commit SHA / Image Digest
Deployment / Release ID（如果平台提供）
Verification Time
Test Revision / Commit
```

如果无法确认运行实例对应哪个版本，验证结果最多只能说明“这个地址当前行为如此”，不能证明指定版本已正确部署。

## 标准流程

```text
Deploy
  ↓
确认 Deployment Identity
  ↓
Health / Readiness
  ↓
执行本次变更的 Targeted Verification
  ↓
执行关键 Deployment Smoke Tests
  ↓
检查必要外部依赖
  ↓
输出 Post-Deployment Verification Result
```

## 1. Deployment Identity

优先通过可观测端点、构建信息、镜像 Digest 或部署平台确认：

```text
Expected Version == Running Version
```

建议应用提供不泄漏敏感信息的版本信息，例如：

```text
commit SHA
build version
build time
service name
```

不要仅根据“部署流水线显示成功”推断真实实例已经切换完成。

## 2. Health / Readiness

Health Check 只证明进程和基础依赖达到最小可服务状态。

它不能替代业务验证。

```text
/health = UP
```

不等于：

```text
cancelOrder 行为已经正确
```

所以健康检查通过后必须继续执行 Targeted / Smoke Verification。

## 3. Targeted Verification

本次业务修改或 Bug 修复 SHOULD 优先重放同一份可执行测试资产。

例如：

```text
本地修复：
tests/http/order/cancel-order.http
→ PASS

部署 staging 后：
同一个 tests/http/order/cancel-order.http
→ PASS
```

Bug 修复尤其要求：

```text
Before Fix: FAIL
Local/CI After Fix: PASS
Staging After Deployment: PASS
```

不要部署后重新手工拼一个语义不同的 curl 来替代原复现场景。

## 4. Deployment Smoke Tests

除本次变更 Targeted Case 外，目标环境 SHOULD 有一组小而稳定的部署 Smoke Tests。

覆盖：

```text
服务可访问
认证链路
最关键只读接口
最关键安全写接口（仅受控数据）
关键外部依赖连通性
核心序列化 / 网关路径
```

Smoke Test 数量应小，执行应快，目标是判断“这个部署是否基本可用”，不是替代完整回归。

## 测试环境 / Staging

测试或预发布环境可以运行较完整的 `deployment` HTTP Test，包括有副作用的业务场景，但必须：

- 使用测试账号 / 测试租户；
- 测试数据可重复创建和清理；
- 不依赖真实客户数据；
- 明确外部第三方是 Sandbox 还是真实环境；
- 失败时 SHOULD 阻止继续推广到下一环境。

对于 HTTP Bug Fix，staging SHOULD 重放关联的 Bug Regression Case。

## 生产环境

生产环境默认只执行标记为 `production-safe` 的场景。

`production-safe` 至少满足其一：

```text
纯只读且不会泄漏敏感数据
幂等且不会产生真实业务副作用
使用完全隔离的测试租户 / 测试账号 / 测试数据
具有可靠自动清理和业务隔离机制
```

以下操作默认 NOT production-safe：

```text
真实支付
真实退款
真实订单取消
删除用户数据
发送真实通知
修改客户权限
触发不可逆工作流
```

如果生产无法安全重放 Bug Case，应记录：

```text
Staging Post-Deployment: PASS
Production Bug Case: NOT VERIFIED (not production-safe)
Production Smoke: PASS
```

不能为了追求“全绿”在生产破坏真实数据。

## 同一测试，多环境执行

推荐让测试文件保持环境无关：

```text
{{baseUrl}}
{{token}}
{{testTenantId}}
{{testOrderId}}
```

然后按环境注入变量：

```text
local
integration
staging
production
```

这样真正复用的是**同一业务场景和同一断言**，而不是四套逐渐漂移的脚本。

## 数据准备与清理

有副作用的部署验证 SHOULD 具备确定的数据生命周期：

```text
Setup
→ Execute
→ Assert
→ Cleanup
```

Cleanup 失败也必须报告。

对于不可安全清理的数据，默认不要在 production 执行。

## 失败分类

部署后失败优先分类：

```text
WRONG_ARTIFACT
DEPLOYMENT_NOT_READY
CONFIGURATION_ERROR
ROUTING_ERROR
AUTHENTICATION_OR_AUTHORIZATION_ERROR
MIGRATION_OR_DATA_ERROR
DEPENDENCY_ERROR
APPLICATION_BEHAVIOR_REGRESSION
TEST_DATA_ERROR
VERIFICATION_ENVIRONMENT_ERROR
```

例如：

```text
本地/CI PASS，staging 返回旧行为，运行 commit 不是预期 commit
→ WRONG_ARTIFACT

运行版本正确，但 staging 特有 Profile 配置错误
→ CONFIGURATION_ERROR

运行版本正确、配置正确、同一 Bug Case 仍 FAIL
→ APPLICATION_BEHAVIOR_REGRESSION 或环境特有行为，继续定位
```

## 发布门禁

项目 SHOULD 定义哪些 Post-Deployment Check 是 Required。

典型规则：

```text
Staging targeted verification FAIL
→ MUST NOT promote

Staging required smoke FAIL
→ MUST NOT promote

Production production-safe smoke FAIL
→ 立即标记 deployment unhealthy，并按项目发布/回滚策略处理
```

是否自动回滚属于发布策略，不由测试规范强制决定。

## Verification Report

部署后证据至少包含：

```text
Environment
Endpoint
Expected Version
Running Version
Targeted Cases
Smoke Cases
PASS / FAIL / NOT VERIFIED
Failure Classification
Not Verified
```

Bug Fix 建议形成完整链：

```text
Local Before Fix: FAIL
Local After Fix: PASS
CI: PASS
Staging Post-Deployment: PASS
Production Safe Smoke: PASS
Production Bug Case: PASS / NOT VERIFIED
```

## 与普通 Verification 的边界

```text
Pre-Deployment Verification
→ 证明代码和构建产物在开发/CI 验证范围内正确

Post-Deployment Verification
→ 证明目标环境实际运行实例正确
```

两者不能互相替代。

对于需要部署才能完成的任务，AI 不应在只有 Pre-Deployment PASS 时声称“部署验证完成”。

## 完成标准

关键服务部署 SHOULD 至少具备：

```text
Deployment Identity 可确认
+ Health / Readiness
+ Targeted Verification
+ 小型 Deployment Smoke Suite
+ 环境和版本证据
+ production-safe 边界
+ 未验证项明确披露
```
