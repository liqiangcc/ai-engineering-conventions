# INC-{YYYY}-{NNN} {事故名称}

> 这是 Incident 复盘模板。重点不是记录“谁写错了”，而是恢复完整因果链、留下复现证据，并把一次故障转化为永久回归资产。

## Metadata

```yaml
id: INC-{YYYY}-{NNN}
severity: {level}
status: closed
operations:
  - {operationId}
useCases:
  - UC-{MODULE}-{NNN}
businessRules:
  - BR-{MODULE}-{NNN}
relatedBusinessChanges:
  - BC-{YYYY}-{NNN}
```

## 现象

{用户或系统观察到什么。}

## 影响

{影响范围、持续时间、数据/业务影响。}

## 触发入口

```text
HTTP / MQ / MCP / CLI / Job
{具体入口}
```

## 因果链

```text
Entry
→ Operation
→ Use Case
→ Business Rule
→ Adapter / Infrastructure / Deployment
→ Failure
```

{说明实际链路。}

## Bug Reproduction

```text
Regression Case: {test path / scenario}
Environment: {local / integration / staging / ...}
Version Before Fix: {commit / build}
Expected: {correct behavior}
Actual: {bug behavior}
Before Fix Result: FAIL / NOT REPRODUCIBLE
```

证据：

- {HTTP request/response, test output, log, trace, screenshot, data snapshot}

如果无法自动复现：

{说明原因、已保留的原始证据以及仍未验证的假设。}

## 根因分类

选择主要类型：

```text
Requirement Gap
Business Rule Defect
Use Case Orchestration Defect
Contract Defect
Adapter / Mapping Defect
HTTP Boundary Defect
Architecture Boundary Defect
Deployment / Configuration Defect
Infrastructure Defect
Data Defect
Observability Defect
```

根因：

{说明为什么发生，而不仅是指出错误行。}

## 为什么测试没有发现

{缺了哪个 AC、决策表格子、Use Case 分支、Contract、HTTP Regression、Architecture Check 或 Post-Deployment Verification。}

## 为什么 Review 没有发现

{信息是否不可见、规则是否未显式化、Diff 是否被重构噪声污染、Verification 是否缺少证据等。}

## 修复

- {fix}

## 修复后验证

```text
Regression Case: {same test path / scenario}
Version After Fix: {commit / build}
After Fix Result: PASS / FAIL / NOT VERIFIED
```

相关验证：

- Business Rule Tests: {result}
- Use Case Tests: {result}
- Contract / Adapter Tests: {result}
- Architecture Tests: {result}
- HTTP API Tests: {result}
- Module / Repository Regression: {result}

## Permanent Regression Asset

```text
Path: {test path}
Status: KEPT / NOT CREATED
Reason: {if not created}
```

修复完成后，能够稳定复现的 Bug Case SHOULD 永久保留；可以整理 Fixture 或合并回 operation 测试文件，但不能删除关键故障场景。

## Post-Deployment Verification

```yaml
environment: {staging / production / ...}
expectedVersion: {commit / image digest}
runningVersion: {observed version}
```

- Deployment Identity: {PASS / FAIL / NOT VERIFIED}
- Targeted Regression Case: {PASS / FAIL / NOT VERIFIED}
- Deployment Smoke: {PASS / FAIL / NOT RUN}
- Production-safe Smoke: {PASS / FAIL / NOT RUN / N/A}
- Production Bug Case: {PASS / FAIL / NOT VERIFIED / N/A}

如果生产无法安全重放有副作用的 Bug Case，明确记录 `NOT VERIFIED`，并给出 staging 与 production-safe smoke 证据。

## 防复发措施

优先选择系统性措施：

- [ ] 补充 Acceptance Criteria / BR 决策表；
- [ ] 增加规则单元测试；
- [ ] 增加 Use Case 测试；
- [ ] 增加 Adapter 契约测试；
- [ ] 增加 HTTP API / Regression Test；
- [ ] 将 Bug 复现场景永久保留；
- [ ] 增加 Architecture / CI 检查；
- [ ] 增加 Post-Deployment Verification；
- [ ] 改进日志、指标、Trace 或版本可观测性；
- [ ] 更新需求 / Review 流程。

## Not Verified

- {item}: {reason}

如果没有：

```text
None
```

## 关联修复

```text
PR: {reference}
Commit: {reference}
Verification Report: {reference}
```

## 复盘结论

{最重要的一到三条可复用结论。}
