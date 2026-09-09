# 规则级别对齐迁移

## 变化

- UC002 保留“重要 operation SHOULD 有主要 Use Case”的历史语义，标记弃用；新增 UC004，要求所有外部业务 operation MUST 有一个主要 Use Case，纯技术入口不要求业务 UC。
- 身份规范中活跃 BR 的实现和测试要求由 SHOULD 升为 MUST，与 BR002/BR003 对齐。
- CI 参考中的 staging 晋级阻断由 SHOULD 升为 MUST；运行版本不匹配、targeted verification 失败、required smoke 失败均阻断。

## 采用步骤

1. 检查业务 operation 的主要 UC 映射，明确区分业务与纯技术入口；新接入执行 UC004，不同时以 UC002 重复报错。
2. 补齐活跃 BR 的实现和测试引用；历史 violation 可使用项目已有 baseline，新代码不得增加 violation。
3. 将 staging 门禁更新为强制阻断；生产失败仍按项目发布/回滚策略处理。
4. 更新 Checker 的预期级别及规则测试，再启用 required check；不能仅更新目录表格后宣称已采用。

旧 Rule Code 不复用为新语义。当前规则见 [Rule Catalog](../rules/convention-rules.md)；本记录仅说明迁移，不替代当前正文。外部 Pilot 的采用与运行状态未在本次修订中验证。
