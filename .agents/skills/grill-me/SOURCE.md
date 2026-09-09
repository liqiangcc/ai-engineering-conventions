# 上游来源

- 作者：Matt Pocock
- 仓库：https://github.com/mattpocock/skills
- 基准提交：`3cca18b368ae95cdbdebbff572ccafa662551015`
- 原始入口：[grill-me/SKILL.md](https://github.com/mattpocock/skills/blob/3cca18b368ae95cdbdebbff572ccafa662551015/skills/productivity/grill-me/SKILL.md)
- 原始访谈实现：[grilling/SKILL.md](https://github.com/mattpocock/skills/blob/3cca18b368ae95cdbdebbff572ccafa662551015/skills/productivity/grilling/SKILL.md)
- 上游许可：MIT，完整声明保存在 [LICENSE](LICENSE)。

本版本将上游入口和访谈逻辑合并，保留决策树、按依赖分轮提问、给出建议、先查事实、等待业务决定的方法，以及 `grill-me` 的显式调用方式。

本地适配包括：将访谈结果写入本仓库 Issue 模板；依 UC / BR / AC 收敛和拆分；按本次范围判断结束条件；复用已有确认；委派遵循当前环境权限，不强制子代理；GitHub / GitLab Issue 通过 `gh` / `glab` 操作，远程写入遵循用户授权。

这是本地衍生版本，不代表上游提供相同 Issue 约定。升级时对比上述固定版本，检查访谈与授权行为变化后再合入，不自动覆盖本地适配。

本 skill 随规范仓库使用，相对链接依赖仓库内 `docs`。单独复制 skill 目录不构成完整分发；将来打包时需解析规范来源，不能静默丢失这些依赖。
