# Business Change Pull Request

## Business Change

`BC-{YYYY}-{NNN}`

## Incident

`INC-{YYYY}-{NNN} / N/A`

## Operation

- `{operationId}`

## Use Case

- `UC-{MODULE}-{NNN}`

## Business Rules

- `BR-{MODULE}-{NNN}`

## Acceptance Criteria

- `BC-{YYYY}-{NNN}/AC-01`
- `BC-{YYYY}-{NNN}/AC-02`

## Behavior Before

{变更前行为。}

## Behavior After

{变更后行为。}

## Affected Concerns

- [ ] Domain rule / policy
- [ ] Application orchestration
- [ ] API / protocol adapter
- [ ] Persistence / external adapter
- [ ] HTTP API behavior
- [ ] Deployment / configuration
- [ ] Data migration
- [ ] Observability
- [ ] Documentation only

## Explicitly Unchanged

{明确说明本 PR 不应改变的关注点。}

## API Change

`None / Compatible / Breaking`

HTTP operation / executable test if affected:

```text
operationId: {operationId}
test: tests/http/{module}/{operation}.http
```

## Database / Data Change

`None / Migration / Backfill`

## Bug Reproduction

Bug 修复时填写；普通变更填 `N/A`。

```text
Regression Case: {test path / scenario}
Before Fix: FAIL / NOT REPRODUCIBLE / N/A
After Fix: PASS / FAIL / NOT VERIFIED / N/A
Permanent Regression: YES / NO / N/A
```

如果不能复现，说明原因：

{reason / evidence}

## Pre-Deployment Test Evidence

- [ ] Business Rule tests
- [ ] Use Case tests
- [ ] Adapter / contract tests if affected
- [ ] Architecture tests
- [ ] HTTP API tests if HTTP behavior affected
- [ ] Module regression
- [ ] Repository regression if required
- [ ] `Not Verified` 已明确列出

Verification Report:

`{reference}`

## Post-Deployment Verification Plan

如果本次变更需要部署：

```text
Target Environment: {staging / production / ...}
Running Version Check: {how}
Targeted Case: {test / scenario}
Deployment Smoke: {suite / cases}
Production-safe Cases: {cases}
Non-production-safe Cases: {cases / N/A}
```

- [ ] staging Targeted Verification 失败时阻止推广
- [ ] production 只运行 production-safe Case
- [ ] 无法安全在生产验证的行为会明确标记 NOT VERIFIED

不涉及部署：`N/A`

## Review Checklist

- [ ] 一个主要业务变化原因；
- [ ] 未混入无关重构或格式化；
- [ ] Use Case 仍只负责流程控制；
- [ ] 业务判断位于 Domain；
- [ ] 外部技术位于 Adapter；
- [ ] BR 当前规则和测试同步；
- [ ] AC 可以追溯到测试证据；
- [ ] HTTP 外部行为有可执行 Case（如适用）；
- [ ] Bug 修复留下可复现且永久保留的 Regression Case（如适用）；
- [ ] 部署后验证范围与 production-safe 边界明确（如适用）；
- [ ] BC 能解释为什么发生本次变化；
- [ ] Git 提交包含必要稳定标识。
