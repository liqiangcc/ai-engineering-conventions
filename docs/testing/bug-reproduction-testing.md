# Bug Reproduction 与永久回归测试

## 目的

Bug 修复不能只留下“代码改了”和“现在看起来好了”。

应尽量留下一个可重复执行的最小证据：

```text
修复前：测试 FAIL，能够稳定暴露 Bug
修复后：同一个测试 PASS
以后：继续保留为 Regression Test
```

这样一次故障会转化为永久防线。

## 核心原则

Bug Reproduction Test 的断言 SHOULD 表达**正确业务行为**，而不是表达当前错误行为。

例如真实 Bug 是“已发货订单仍可取消”。

正确的复现测试应该断言：

```text
已发货订单
→ 调用取消接口
→ 返回 409 / ORDER_ALREADY_SHIPPED
```

因此：

```text
修复前当前系统返回 200
→ 测试 FAIL

修复后返回 409
→ 同一个测试 PASS
```

不要写成“断言当前错误的 200”，然后修复时再修改测试预期。那不能证明同一个场景完成了修复。

## 定位最小测试层

Bug SHOULD 首先在离根因最近、仍能稳定复现用户可观察错误的层建立测试。

```text
纯业务判断错误
→ Business Rule Test

流程编排错误
→ Use Case Test

映射 / 协议错误
→ Adapter / Contract Test

HTTP 外部行为错误
→ HTTP API Test

跨系统交互错误
→ Integration / Cross-System E2E
```

如果 Bug 通过 HTTP 暴露，而且 HTTP 边界本身是故障链的一部分，SHOULD 保留 HTTP Reproduction Case，即使同时补了 BR / UC Test。

## HTTP Bug 的默认位置

优先把永久业务场景加入 operation 对应文件：

```text
operationId: cancelOrder
→ tests/http/order/cancel-order.http
```

场景中保留关联：

```text
INC-2026-008
UC-ORDER-004
BR-ORDER-003
```

如果复现需要特殊 Fixture、多步骤准备或只属于一个历史故障，可单独建立：

```text
tests/http/{module}/regression/{inc-id}-{scenario}.http
```

例如：

```text
tests/http/order/regression/inc-2026-008-shipped-order-cannot-cancel.http
```

默认优先聚合到 operation 文件，只有独立性确实带来更低认知成本时才创建 regression 文件。

## Bug 修复标准流程

```text
1. 定位 INC / Operation / UC / BR
2. 明确正确预期
3. 新增或找到最小复现场景
4. 修复前执行
5. 确认 Before Fix: FAIL
6. 修改实现
7. 执行同一个场景
8. 确认 After Fix: PASS
9. 执行受影响层和模块回归
10. 将复现场景永久保留
```

## 修复前证据

Verification / Incident SHOULD 记录：

```text
Test Case
Execution Environment
Application Version / Commit
Expected
Actual
Result: FAIL
```

例如：

```text
Case: tests/http/order/cancel-order.http :: shipped order
Environment: local
Version: abc1234
Expected: 409 ORDER_ALREADY_SHIPPED
Actual: 200 SUCCESS
Result: FAIL
```

测试文件保存“正确预期”，历史失败结果保存在 INC / Verification Report 中。

## 修复后证据

至少记录：

```text
同一 Test Case
新的 Application Version / Commit
Result: PASS
```

如果 Bug 涉及部署环境，还必须继续执行 Post-Deployment Verification，不能把本地 PASS 当作部署完成证明。

## 永久回归资产

修复后测试 MUST NOT 因为 Incident 关闭就删除。

可以做的整理：

- 从临时 Fixture 迁移到稳定 Fixture；
- 将独立 Incident 文件合并回 operation 测试文件；
- 简化复现步骤；
- 把特殊数据构造抽成可复用 setup。

但必须保留导致历史 Bug 的关键业务场景。

## 回归测试的价值

永久保留的 Bug Case 提供：

```text
故障知识
+ 可执行文档
+ CI 防回归
+ AI 后续修改的行为约束
+ Reviewer 可读的历史场景
+ Incident 复盘证据
```

以后 AI 修改相同 UC / BR 时，可以主动定位并运行相关历史回归 Case。

## 不可自动复现的 Bug

如果无法自动得到 `Before Fix: FAIL`，必须说明原因，例如：

```text
依赖不可控第三方瞬时行为
历史数据已无法重建
竞态条件尚未稳定捕获
生产环境专有条件
缺少必要可观测性
```

此时 SHOULD：

1. 保存日志、Trace、请求/响应或数据快照等原始证据；
2. 尽量建立更低层、可控的回归测试；
3. 将无法验证的部分写入 `Not Verified`；
4. 评估是否需要补充可观测性或故障注入能力。

不得伪造一个无法真实复现原 Bug 的测试并声称“已复现”。

## 生产环境边界

Bug Reproduction Test 不等于可以在生产环境重放。

任何会创建、修改、取消、支付、删除真实业务数据的测试，默认视为非 `production-safe`。

生产验证规则见 `post-deployment-verification.md`。

## 完成标准

可自动复现的 Bug 修复 SHOULD 最终具备：

```text
INC / Bug ID
+ 最小复现测试
+ Before Fix: FAIL 证据
+ After Fix: PASS 证据
+ 永久 Regression Case
+ 必要的模块/架构回归
+ 部署后验证（当故障涉及运行环境或 HTTP 服务时）
```
