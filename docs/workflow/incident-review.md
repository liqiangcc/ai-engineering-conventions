# Incident / Bug 复盘流程

## 目标

复盘不止回答“哪一行错了”，而要恢复完整因果链：

```text
哪个入口触发
→ 哪个 Use Case 处理
→ 哪条业务规则相关
→ 哪个 Adapter / 外部条件参与
→ 为什么测试没发现
→ 哪次变更可能引入
→ 为什么 Review 没发现
→ 如何建立防复发机制
```

## 定位顺序

### 1. 入口

确认：

```text
HTTP URL + operationId
MQ topic + event type
MCP tool name
CLI command
Scheduled Job
```

### 2. Use Case

通过 Operation 定位 UC 与主要 Use Case Class。

### 3. Business Rule

确认：

- 哪些 BR 决定了错误行为；
- 当前规则文档是否已定义该场景；
- 代码是否正确实现规则；
- 测试是否覆盖决策表对应组合。

### 4. Application Orchestration

如果规则本身正确，检查：

- Use Case 是否调用了正确规则；
- 调用顺序是否正确；
- 是否存在绕过规则的入口；
- 事务、幂等、重试或补偿是否错误。

### 5. Adapter / Infrastructure

如果核心行为正确，再检查：

```text
HTTP 映射
数据库映射
序列化
MQ 消息
缓存
外部 API
网络/资源故障
```

## 根因分类

复盘 SHOULD 将主要根因归入明确类别：

```text
Requirement Gap
Business Rule Defect
Use Case Orchestration Defect
Adapter / Mapping Defect
Infrastructure Defect
Data Defect
Observability Defect
```

示例：

```text
规则定义了“发货后禁止取消”，实现却判断“签收后禁止取消”
→ Business Rule Defect

规则实现正确，但另一个 Controller 直接更新状态绕过 Use Case
→ Use Case / Entry Boundary Defect

Domain 返回正确结果，但 JPA 状态映射错误
→ Adapter / Mapping Defect
```

## 检查历史

通过稳定 ID 和 Git：

```bash
git log --all --grep="BR-ORDER-003"
git log --all --grep="BC-2026-014"
git log --follow -- {rule-file}
```

如果能确定问题由某个 BC 引入，记录关联；不能确定时不要猜测。

## 为什么测试没发现

优先把遗漏定位到最靠近问题的测试层：

```text
规则决策组合遗漏
Use Case 分支遗漏
Adapter 契约遗漏
跨系统集成遗漏
```

对业务规则 Bug，优先问：

> 这是新业务场景，还是决策表已经定义但测试漏了一格？

前者通常是 Requirement Gap；后者通常是实现/测试缺陷。

## 为什么 Review 没发现

常见原因：

- 规则没有独立身份；
- Diff 混入大量重构噪声；
- 类名无法表达职责；
- 测试只验证 happy path；
- PR 没描述 Behavior Before / After；
- 代码放错层导致 Reviewer 没从正确角度检查。

## 防复发优先级

优先建立系统性防线，而不只写“加强 Review”：

```text
1. 明确/修正规则决策表
2. 增加最小层级测试
3. 增加架构或静态检查
4. 增加契约测试
5. 改善可观测性
6. 改进 PR / BC 信息
7. 必要时调整模块或分离点
```

## 长期统计

INC SHOULD 可以按根因类型、模块、UC、BR 聚合统计。

例如长期发现：

```text
Business Rule Defect 很高
→ 规则复杂度、决策表和需求分析需要加强

Adapter Defect 很高
→ 契约测试不足

Orchestration Defect 很高
→ Use Case 流程测试或状态机需要加强
```

复盘的最终目标是让下一次同类错误更难发生，而不是只修复当前错误。
