# Verification Result Schema

自动化层 SHOULD 使用统一结果语义，避免 `skipped`、`unknown` 等被 AI 错误解释为 PASS。

## Status

```text
PASS
FAIL
NOT_RUN
NOT_VERIFIED
NOT_REQUIRED
ENVIRONMENT_ERROR
PRE_EXISTING_FAILURE
```

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

## Summary

```json
{
  "version": 1,
  "results": [],
  "conclusion": "VERIFIED"
}
```

## Conclusion

```text
VERIFIED
PARTIALLY_VERIFIED
NOT_VERIFIED
FAILED
```

规则：

- required 项存在 FAIL → `FAILED`
- required 项存在 NOT_RUN / NOT_VERIFIED → 不得 `VERIFIED`
- 所有 required 项 PASS/NOT_REQUIRED 且无阻断失败 → `VERIFIED`
- 环境错误保留为环境错误，不自动归因于代码

具体 JSON Schema 可在工具实现阶段增加；当前先固定语义。
