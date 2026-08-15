# CI / Automation Review Checklist

```text
[ ] Workflow 是否只负责编排？
[ ] 是否复用了本地稳定验证命令？
[ ] 是否复制了业务规则到 Bash/YAML？
[ ] 失败是否能定位 Convention / Architecture / Test / HTTP / Deployment 层？
[ ] Secret 是否只通过安全环境注入？
[ ] production-safe 是否真的无破坏性？
[ ] 未执行验证是否显示 NOT_RUN / NOT_VERIFIED？
[ ] 是否增加了第二份配置真相源？
[ ] 自动生成文件是否禁止人工编辑？
```
