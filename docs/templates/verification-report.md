# Verification Report

## Scope

```yaml
businessChange: BC-{YYYY}-{NNN}
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
Before Fix: FAIL / NOT REPRODUCIBLE / NOT APPLICABLE
After Fix:  PASS / FAIL / NOT VERIFIED
```

Evidence:

- {reproduction test or steps}

## Verification Results

| Layer | Result | Evidence |
|---|---|---|
| Business Rule Tests | PASS / FAIL / N/A | {tests} |
| Use Case Tests | PASS / FAIL / N/A | {tests} |
| Contract / Adapter Tests | PASS / FAIL / N/A / NOT VERIFIED | {tests} |
| Architecture Tests | PASS / FAIL / N/A | {tests} |
| Module Regression | PASS / FAIL / NOT RUN | {command / CI} |
| Repository Regression | PASS / FAIL / NOT RUN | {command / CI} |

## Failure Classification

如有失败，按关注点分类：

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

只能根据证据使用以下类型的结论：

```text
VERIFIED
PARTIALLY_VERIFIED
NOT_VERIFIED
FAILED
```

### Result

`{VERIFIED | PARTIALLY_VERIFIED | NOT_VERIFIED | FAILED}`

### Reason

{用一到三句话说明结论依据，不把未运行的检查写成已通过。}
