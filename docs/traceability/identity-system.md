# 稳定标识体系

## 目的

目录和类名会重构，稳定标识用于跨代码移动、文档变更和 Git 历史保持同一业务概念的连续性。

本规范定义四类核心标识：

```text
UC   Use Case
BR   Business Rule
BC   Business Change
INC  Incident
```

推荐关系：

```text
Operation
   ↓
  UC
   ↓
  BR
   ↓
代码 + 测试

BC ──描述一次历史业务变更──→ UC / BR / Operation
INC ─描述一次故障事件────→ UC / BR / BC
```

## UC — Use Case ID

格式：

```text
UC-{MODULE}-{NNN}
```

例如：

```text
UC-ORDER-004
UC-PAYMENT-002
```

UC 表示稳定的应用业务能力。

规则：

- MUST 唯一；
- 类移动、包重构、技术迁移时 SHOULD 保持不变；
- 业务能力本质发生变化或拆成两个独立能力时 MAY 新建 UC；
- 当前代码 SHOULD 能通过注解或其他机器可读方式定位 UC。

## BR — Business Rule ID

格式：

```text
BR-{MODULE}-{NNN}
```

例如：

```text
BR-ORDER-003
```

BR 表示一个可以独立描述、独立修改、独立测试的业务决定。

一条 BR 不等于一个 `if`。合理颗粒度通常是：

> 一个业务人员可以单独说清楚、一个测试集合可以单独证明的规则。

规则：

- MUST 唯一；
- 同一规则的阈值、条件或决策表变化时通常保持同一 BR；
- 如果业务含义已经变成另一个独立规则，创建新 BR；
- 活跃 BR SHOULD 有明确实现与测试；
- 当前代码 SHOULD 保留 BR 身份。

## BC — Business Change ID

格式：

```text
BC-{YYYY}-{NNN}
```

例如：

```text
BC-2026-014
```

BC 表示一次历史业务变更，回答：

```text
为什么改
改了什么
影响哪些 Operation / UC / BR
兼容性和迁移影响是什么
```

规则：

- 每次独立业务语义变更 SHOULD 创建新 BC；
- BC 是历史事件，MUST NOT 作为长期注解固定在当前业务类上；
- BC SHOULD 出现在变更文档、PR 和最终提交信息中；
- 一个 BC 默认对应一个可独立 Review 的业务变化原因。

## INC — Incident ID

格式：

```text
INC-{YYYY}-{NNN}
```

例如：

```text
INC-2026-008
```

INC 表示一次线上或重要环境故障，回答：

```text
发生了什么
影响什么
根因是什么
哪条防线失效
如何避免再次发生
```

INC SHOULD 关联：

```text
Affected Operation
Affected UC
Affected BR
Introduced/Fault-related BC（若能确定）
Fix commit / PR
```

## 当前身份与历史身份分离

当前代码中推荐保留：

```text
UC
BR
```

历史记录中保留：

```text
BC
INC
```

原因：

```text
一个 Use Case / Rule 会经历多个 BC
一个 Use Case / Rule 也可能经历多个 INC
```

把 BC/INC 写死在当前类上会混淆“当前是什么”和“历史发生过什么”。

## 搜索约定

任意稳定 ID SHOULD 可以直接全文搜索：

```bash
rg "UC-ORDER-004"
rg "BR-ORDER-003"
```

Git 历史 SHOULD 可以搜索：

```bash
git log --all --grep="BC-2026-014"
git log --all --grep="BR-ORDER-003"
```

稳定 ID 的价值是让业务概念拥有不会随文件路径轻易变化的坐标。
