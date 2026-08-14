# Verification Report

## Scope

```yaml
businessChange: BC-{YYYY}-{NNN}
incident: INC-{YYYY}-{NNN} # optional
operations:
  - {operationId}
useCases:
  - UC-{MODULE}-{NNN}
businessRules:
  - BR-{MODULE}-{NNN}
```

## Acceptance Criteria

| Criteria | Result | Evidence |
|---|---|---|
| BC-{YYYY}-{NNN}/AC-01 | PASS / FAIL / NOT VERIFIED | {test / command / CI check} |
| BC-{YYYY}-{NNN}/AC-02 | PASS / FAIL / NOT VERIFIED | {test / command / CI check} |

## Bug Reproduction

仅 Bug / Incident 修复填写。

```text
Regression Case: {test path / scenario}
Before Fix: FAIL / NOT REPRODUCIBLE / NOT APPLICABLE
After Fix:  PASS / FAIL / NOT VERIFIED
Permanent Regression: YES / NO / N/A
```

Evidence:

- Before: {environment / version / expected / actual}
- After: {environment / version / result}

复现测试应断言正确行为，因此同一测试在修复前 FAIL、修复后 PASS。

## Pre-Deployment Verification

| Layer | Result | Evidence |
|---|---|---|
| Business Rule Tests | PASS / FAIL / N/A | {tests} |
| Use Case Tests | PASS / FAIL / N/A | {tests} |
| Contract / Adapter Tests | PASS / FAIL / N/A / NOT VERIFIED | {tests} |
| Architecture Tests | PASS / FAIL / N/A | {tests} |
| HTTP API Tests | PASS / FAIL / N/A / NOT VERIFIED | {http case / environment} |
| Module Regression | PASS / FAIL / NOT RUN | {command / CI} |
| Repository Regression | PASS / FAIL / NOT RUN | {command / CI} |

## Post-Deployment Verification

如果本次任务不包含部署，填写 `NOT REQUIRED`。

```yaml
environment: {staging / production / ...}
endpoint: {base URL / service endpoint}
expectedVersion: {commit / image digest / build version}
runningVersion: {observed version}
verificationTime: {timestamp}
```

| Check | Result | Evidence |
|---|---|---|
| Deployment Identity | PASS / FAIL / NOT VERIFIED | {version endpoint / deploy platform} |
| Health / Readiness | PASS / FAIL / NOT RUN | {check} |
| Targeted Change Case | PASS / FAIL / NOT VERIFIED | {HTTP / regression case} |
| Deployment Smoke | PASS / FAIL / NOT RUN | {suite / cases} |
| Production-safe Smoke | PASS / FAIL / NOT RUN / N/A | {cases} |
| Production Bug Case | PASS / FAIL / NOT VERIFIED / N/A | {case / reason} |

对于非 `production-safe` 的写操作，允许生产 Bug Case 为 `NOT VERIFIED`，但必须说明为什么不能安全执行以及已完成的 staging 证据。

## Failure Classification

如有失败，按关注点分类：

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

- {failure}: {classification} — {evidence / analysis}

## Not Verified

必须明确列出没有运行、无法运行或无法证明的内容。

- {item}: {reason}

如果没有：

```text
None
```

## Pre-existing Failures

- {existing failure not introduced by this change}

如果没有：

```text
None observed
```

## Conclusion

只能根据真实执行证据下结论。

```text
Pre-Deployment: VERIFIED / PARTIALLY_VERIFIED / NOT_VERIFIED / FAILED
Post-Deployment: VERIFIED / PARTIALLY_VERIFIED / NOT_VERIFIED / FAILED / NOT_RUN / NOT_REQUIRED
Overall: VERIFIED / PARTIALLY_VERIFIED / NOT_VERIFIED / FAILED
```

### Reason

{用一到三句话说明结论依据。不要把 NOT RUN / NOT VERIFIED 写成 PASS。}

如果任务包含部署，只有 Pre-Deployment 通过但尚未执行目标环境验证时，Overall 不应表述为“部署已验证”。
