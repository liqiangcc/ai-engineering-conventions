# Verification Result Schema

自动化层 SHOULD 使用统一结果语义。本文是验证状态与汇总结论的权威来源，用来隔离检查失败、证据缺失和环境故障，避免不同调用方把未验证误报为通过。

## Status

| Status | 含义 |
|---|---|
| PASS | 已执行，并有证据证明检查满足预期 |
| FAIL | 已执行，检查不满足预期 |
| NOT_RUN | 尚未执行，包括执行被提前终止 |
| NOT_VERIFIED | 现有证据不足以证明预期，不能声称通过 |
| NOT_REQUIRED | 执行前的影响分析确认该项不适用，必须记录原因 |
| ENVIRONMENT_ERROR | 工具或环境故障导致无法完成检查，保留故障证据 |
| PRE_EXISTING_FAILURE | 有基线证据证明失败在本次变更前已存在；仍是失败，不自动豁免 |

机器格式使用上述下划线枚举。人工报告可显示空格形式，如 `NOT RUN`；`N/A` 仅映射到 NOT_REQUIRED，不表示没运行。`NOT REPRODUCIBLE` 是复现原因说明，对应验证状态 NOT_VERIFIED；`IMPLEMENTED` 或静态审阅意见不能替代运行检查的 PASS。

## Result Item

概念结构：

```json
{
  "id": "architecture",
  "status": "PASS",
  "required": true,
  "evidence": ["target/surefire-reports/..."],
  "message": "Architecture tests passed"
}
```

- `required` 表达本次验证范围中的门禁义务，不等于规则的 MUST/SHOULD 级别。
- 必需集合 MUST 在执行前根据任务、影响范围和项目门禁确定，不能因失败改成非必需项。
- 必需项未产生结果时 MUST 保留为 NOT_RUN，不能从结果列表删除。
- FAIL、ENVIRONMENT_ERROR、PRE_EXISTING_FAILURE 必须说明原因并引用可获得证据；已有失败必须有修改前基线，不能凭猜测分类。
- NOT_REQUIRED 必须有不适用依据，不能用来回避所需验证。
- 非必需失败、环境错误和未执行项 MUST 在报告中显式列出，即使它们不阻断门禁。

## Summary

```json
{
  "version": 2,
  "results": [
    {
      "id": "architecture",
      "status": "PASS",
      "required": true,
      "evidence": ["target/surefire-reports/architecture.xml"],
      "message": "Architecture tests passed"
    }
  ],
  "conclusion": "VERIFIED"
}
```

字段为概念接口，不新增可执行 JSON Schema。结果的具体生产方式由目标项目实现。

## Conclusion

按以下顺序匹配第一条成立的规则：

| 条件 | Conclusion |
|---|---|
| 必需项存在 FAIL 或 PRE_EXISTING_FAILURE | FAILED |
| 必需项存在 NOT_RUN / NOT_VERIFIED / ENVIRONMENT_ERROR，且有必需项 PASS | PARTIALLY_VERIFIED |
| 必需项存在上述证据缺口，且没有必需项 PASS | NOT_VERIFIED |
| 存在必需项，且全部为 PASS / NOT_REQUIRED | VERIFIED |
| 空结果集或没有必需项 | NOT_VERIFIED |

VERIFIED 仅表示已声明的必需范围得到满足，不表示全部检查通过，也不证明任务之外的部署或生产行为。必需项全部为 NOT_REQUIRED 时，报告 MUST 明确“无适用的必需检查”，不得写成“测试通过”。

非必需项不改变上述结论和门禁，但不得隐藏其失败或证据缺口。环境错误保留为环境错误，不自动归因于代码。

Pre-Deployment 与 Post-Deployment 分别按该表汇总。若输出 Overall，使用任务范围内两阶段的原始结果合并后按同一规则汇总，不通过平均阶段结论推导。阶段未开始的必需项仍为 NOT_RUN；任务不包含部署时，人工报告可将部署阶段标为 NOT_REQUIRED。

## 汇总验收场景

下表中条目默认 required=true；非必需项另行注明。

| 输入 | Conclusion | verify exit |
|---|---|---|
| PASS | VERIFIED | 0 |
| PASS + NOT_REQUIRED（有不适用依据） | VERIFIED | 0 |
| FAIL + PASS | FAILED | 1 |
| PRE_EXISTING_FAILURE + PASS | FAILED | 1 |
| PASS + NOT_RUN | PARTIALLY_VERIFIED | 4 |
| PASS + NOT_VERIFIED | PARTIALLY_VERIFIED | 4 |
| NOT_RUN | NOT_VERIFIED | 4 |
| NOT_VERIFIED | NOT_VERIFIED | 4 |
| PASS + ENVIRONMENT_ERROR | PARTIALLY_VERIFIED | 2 |
| ENVIRONMENT_ERROR | NOT_VERIFIED | 2 |
| NOT_REQUIRED + NOT_RUN | NOT_VERIFIED | 4 |
| PASS + 非必需 FAIL / ENVIRONMENT_ERROR / NOT_RUN | VERIFIED，显式披露非必需问题 | 0 |
| 全部 NOT_REQUIRED（有不适用依据） | VERIFIED，注明无适用必需检查 | 0 |
| 空结果或仅非必需 PASS | NOT_VERIFIED | 4 |
| FAIL + ENVIRONMENT_ERROR + NOT_RUN | FAILED，保留所有原因 | 1 |

退出码规则由[统一验证命令](../automation/verification-command.md#exit-code)定义；参数校验失败和入口工具自身故障不作为成功的验证汇总。
