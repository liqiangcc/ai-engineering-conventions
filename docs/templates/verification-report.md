# Verification Report

结果填写遵守[统一验证状态与汇总语义](../schemas/verification-result.md)。每层 Result 可使用完整状态集合；N/A 仅表示经分析不适用，不能表示未运行。Required 在执行前确定，未出结果的必需项也必须保留。

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
| BC-{YYYY}-{NNN}/AC-01 | {status} | {test / command / CI check} |
| BC-{YYYY}-{NNN}/AC-02 | {status} | {test / command / CI check} |

## Bug Reproduction

仅 Bug / Incident 修复填写。

```text
Regression Case: {test path / scenario}
Before Fix: FAIL / NOT REPRODUCIBLE / NOT APPLICABLE
After Fix:  {status}
Permanent Regression: YES / NO / N/A
```

Evidence:

- Before: {environment / version / expected / actual}
- After: {environment / version / result}

复现测试应断言正确行为，因此同一测试在修复前 FAIL、修复后 PASS。

## Pre-Deployment Verification

| Layer | Required | Result | Evidence / Reason |
|---|---|---|---|
| Business Rule Tests | {true/false} | {status} | {tests / reason} |
| Use Case Tests | {true/false} | {status} | {tests / reason} |
| Contract / Adapter Tests | {true/false} | {status} | {tests / reason} |
| Architecture Tests | {true/false} | {status} | {tests / reason} |
| HTTP API Tests | {true/false} | {status} | {http case / environment / reason} |
| Module Regression | {true/false} | {status} | {command / CI / reason} |
| Repository Regression | {true/false} | {status} | {command / CI / reason} |

## Post-Deployment Verification

如果本次任务不包含部署，填写 `NOT REQUIRED`。

```yaml
environment: {staging / production / ...}
endpoint: {base URL / service endpoint}
expectedVersion: {commit / image digest / build version}
runningVersion: {observed version}
verificationTime: {timestamp}
```

| Check | Required | Result | Evidence / Reason |
|---|---|---|---|
| Deployment Identity | {true/false} | {status} | {version endpoint / deploy platform} |
| Health / Readiness | {true/false} | {status} | {check} |
| Targeted Change Case | {true/false} | {status} | {HTTP / regression case} |
| Deployment Smoke | {true/false} | {status} | {suite / cases} |
| Production-safe Smoke | {true/false} | {status} | {cases / reason} |
| Production Bug Case | {true/false} | {status} | {case / reason} |

对于非 `production-safe` 的写操作，允许生产 Bug Case 为 `NOT VERIFIED`，但必须说明为什么不能安全执行以及已完成的 staging 证据。

## Failure Classification

分类依据[验证工作流的失败分类](../testing/verification-workflow.md#失败分类)，部署问题进一步参考[部署失败分类](../testing/post-deployment-verification.md#失败分类)。分类用于定位关注点，不替代结果状态。

- {failure}: {classification} — {evidence / analysis}

## Non-required Issues

- {非必需失败 / 环境错误 / 未执行项}: {status / evidence / reason}

没有时填写 None。必需项全部通过也不能隐藏本节问题。

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

依据[汇总决策表](../schemas/verification-result.md#conclusion)填写，不从是否 CI 全绿或当前实现推断。

```text
Pre-Deployment: {conclusion}
Post-Deployment: {conclusion / NOT_REQUIRED when outside task scope}
Overall: {conclusion over required task scope}
```

VERIFIED 仅覆盖已声明的必需范围；全部必需项不适用时明确写“无适用的必需检查”。任务包含部署但尚未执行时，保留该阶段必需项为 NOT_RUN 并按表汇总。

### Reason

{用一到三句话说明结论依据。不要把 NOT RUN / NOT VERIFIED 写成 PASS。}

如果任务包含部署，只有 Pre-Deployment 通过但尚未执行目标环境验证时，Overall 不应表述为“部署已验证”。
