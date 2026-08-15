# Automation Adoption Checklist

```text
[ ] 存在稳定验证入口（如 scripts/verify）
[ ] AI、本地、CI 使用相同入口
[ ] Domain/Application/Module 核心边界自动检查
[ ] tests/http/{module}/{operation}.http 约定落地
[ ] 历史 Bug Case 永久保留为 regression
[ ] operationId / UC / BR 唯一性可检查
[ ] Required CI checks 已实际运行
[ ] staging targeted regression + smoke
[ ] production 只运行 production-safe
[ ] 未验证项明确为 NOT_VERIFIED / NOT_RUN
[ ] 自动导航生成物不人工编辑
```

只有实际执行并得到证据的项目才能勾选。
