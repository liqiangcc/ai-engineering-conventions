# 本仓库文档验证

本仓库的验证入口检查已有文档导航，降低文件移动、标题修改造成断链的风险。它不实现业务项目的 Convention Checker，也不证明规范语义或代码示例正确。

## 执行

环境需要 Node.js 18 或以上版本及 Git。在仓库根目录调用：

```text
./scripts/verify docs
./scripts/verify unit
./scripts/verify all
```

`docs` 检查 Git 跟踪及未忽略的新 Markdown 文件中的行内相对链接，包含图片路径和 Markdown ATX 标题锚点；忽略代码块、行内代码及 HTML 注释中的示例。支持中文标题、重复标题后缀和 URL 编码。引用式链接、原始 HTML、自定义 HTML 锚点和外部 URL 不在检查范围内。

`unit` 执行文档检查器的回归测试。`all` 只包含 `docs` 与 `unit`，不包含 Java 编译、业务测试、HTTP、CI 远程运行或部署验证。结果只证明这些已声明的范围。

参数与退出码遵守[统一验证命令](verification-command.md#exit-code)。没有可检查的 Markdown 文件时返回 4；断链返回 1；工具或读取错误返回 2。当前入口仅提供人工可读输出。

Pilot 的运行证据仍在目标项目通过其稳定命令取得；本仓库检查通过不改变 Pilot 的未验证状态。
