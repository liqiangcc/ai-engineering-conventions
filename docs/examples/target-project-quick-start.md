# Target Project Automation Quick Start

1. 添加稳定验证入口：`scripts/verify`。
2. 先接现有构建和测试：`./scripts/verify all`。
3. 加 ArchUnit：`./scripts/verify architecture`。
4. 建立 `tests/http/{module}/{operation}.http`。
5. 历史 Bug 复现用例保留为 regression。
6. CI 调用相同命令，不复制逻辑。
7. 实现 Convention Checker MVP：先做 OP001 / UC001 / BR001 / HTTP001 等高确定性检查。
8. 部署 staging 后执行 targeted regression + smoke。
9. 最后再考虑自动导航和统一 Verification Summary。

不要从“写一个通用平台”开始。
