# 生产验证标签迁移

## 变化与风险

原 HTTP 文档把所有修改数据的 Case 归为 destructive，与隔离安全写入可成为 production-safe 的要求冲突。现在 destructive 专指可能破坏真实业务数据或产生不可可靠隔离、清理副作用的场景；HTTP004 编号及互斥语义保持不变。

## 采用步骤

1. 按[生产标签定义](../testing/post-deployment-verification.md#生产环境)逐个 Review 已有写场景，包括第三方通知、支付等外部副作用。
2. 只有业务隔离、受控数据及可靠清理或无残留副作用的证据完整时，才可将隔离写场景改标 production-safe；不得批量删除 destructive 标签。
3. Checker 继续拒绝两个标签共存；生产 runner 仍只选择 production-safe，不把未标记 Case 当作安全。
4. 标签修改不等于运行验证通过，未执行仍保留未验证状态。
