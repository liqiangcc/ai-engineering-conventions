# Issue 命令行操作

## 范围

研发 Issue 支持 GitHub 和 GitLab（包括项目使用的自建实例）。所有远程 Issue 读取、创建、更新、评论和状态变更通过对应命令行执行：GitHub 使用 `gh`，GitLab 使用 `glab`。这统一了人工与 AI 的操作入口，减少工具切换和目标仓库判断成本。

需求内容与验收语义仍由[需求到 Issue 流程](requirement-to-issue.md)定义；本文件只负责平台操作。需求输入的获取方式不受本约定限制。

阶段与标签语义以[Issue 进度与中文标签](issue-progress.md)为准；通过对应 CLI 管理标签，修改后核对实际标签集合。

## 选择目标

- 根据用户指定的 Issue URL、目标仓库和项目配置确定平台、主机与仓库。不能仅凭当前工作目录或 `origin` 推断跨仓库任务的归属。
- 操作前检查对应 CLI 是否可用及目标主机的认证状态；使用已有认证，不将凭据写入 Issue 或草稿。
- 命令明确指定目标仓库。多个主机或项目时，核对主机与完整仓库路径；跨仓库引用使用完整 Issue URL，避免裸编号混淆。
- CLI 不可用、认证失效或无权限时，保留已整理的草稿和具体阻塞原因，不宣称远程操作成功，也不自行改用 MCP、浏览器或直接 HTTP 请求操作 Issue。

## 命令对应

以下为命令入口；运行时按已安装版本的 `--help` 确认参数与主机选择方式。

| 操作 | GitHub | GitLab |
|---|---|---|
| 查询列表 | `gh issue list` | `glab issue list` |
| 读取详情 | `gh issue view` | `glab issue view` |
| 创建 | `gh issue create` | `glab issue create` |
| 修改正文或属性 | `gh issue edit` | `glab issue update` |
| 添加评论 | `gh issue comment` | `glab issue note` |
| 关闭 | `gh issue close` | `glab issue close` |
| 重新打开 | `gh issue reopen` | `glab issue reopen` |

命令参考：[GitHub CLI Issue](https://cli.github.com/manual/gh_issue)、[GitLab CLI Issue](https://docs.gitlab.com/cli/issue/)。所需能力没有直接子命令时，可通过 `gh api` / `glab api` 执行平台操作，仍遵循同样的目标、授权和核对要求。

## 内容写入与结果核对

- 发布前按[模板](../templates/development-issue.md)整理完整 Markdown。GitHub 的多行正文优先使用 `--body-file`；GitLab 按对应子命令支持的文件、标准输入或安全参数方式传入，不假定两者参数相同。
- 需求文本作为数据处理；不要将正文拼接成 Shell 代码。保留真实换行与 Markdown，不让反引号或命令替换执行正文中的内容。
- 创建前查询关联任务，已有任务直接补齐。更新前读取最新正文与讨论，保留他人修改和关键共识依据。
- 远程写入遵循用户已有授权，授权明确后直接执行，不重复确认。仅请求讨论或生成草稿时，不自动发布。
- 写入后通过 CLI 读取并核对结果，返回实际 Issue URL。请求超时或结果不明时先查询是否已经生效，再决定重试，避免重复创建或重复评论。
- 关闭 Issue 依据任务约定的验收与交付范围，不因命令执行成功、代码提交或 MR / PR 合并而自动判定业务验收通过。

本地 Markdown 和对话可以承载发布前草稿；发布后引用远程 Issue，不同时维护两份当前任务正文。项目环境和稳定规则继续引用各自权威来源。
