# Business Change Pull Request

## Business Change

`BC-{YYYY}-{NNN}`

## Operation

- `{operationId}`

## Use Case

- `UC-{MODULE}-{NNN}`

## Business Rules

- `BR-{MODULE}-{NNN}`

## Behavior Before

{变更前行为。}

## Behavior After

{变更后行为。}

## Affected Concerns

- [ ] Domain rule / policy
- [ ] Application orchestration
- [ ] API / protocol adapter
- [ ] Persistence / external adapter
- [ ] Data migration
- [ ] Observability
- [ ] Documentation only

## Explicitly Unchanged

{明确说明本 PR 不应改变的关注点。}

## API Change

`None / Compatible / Breaking`

## Database / Data Change

`None / Migration / Backfill`

## Test Evidence

- [ ] Business Rule tests
- [ ] Use Case tests
- [ ] Adapter / contract tests if affected
- [ ] Integration / E2E tests if required

## Review Checklist

- [ ] 一个主要业务变化原因；
- [ ] 未混入无关重构或格式化；
- [ ] Use Case 仍只负责流程控制；
- [ ] 业务判断位于 Domain；
- [ ] 外部技术位于 Adapter；
- [ ] BR 当前规则和测试同步；
- [ ] BC 能解释为什么发生本次变化；
- [ ] Git 提交包含必要稳定标识。
