# Git 与业务变更历史规范

## 目标

Git 历史不仅记录“代码怎么变”，还应尽可能回答“业务为什么变”。

要达到这个目标，必须控制提交粒度，并把业务身份写入可搜索的历史元数据。

## 一个提交一个主要变化原因

提交 SHOULD 只承载一个主要关注点。

推荐拆分：

```text
架构/机械重构
业务行为修改
测试补充
技术依赖升级
文档结构调整
```

其中互相依赖、无法独立成立的代码和测试 MAY 同一提交；但不应把无关重构、格式化和业务规则修改混在一起。

## 行为修改与机械重构分离

禁止在同一提交中大规模同时：

```text
移动包
重命名大量类
全局格式化
升级框架
修改业务条件
```

推荐：

```text
Commit A: refactor(order): move cancellation policy without behavior change
Commit B: feat(order): adjust cancellation eligibility
```

这样 `git log`、`git blame` 和 Review Diff 才能保持业务可读性。

## Business Change 提交信息

涉及业务语义的提交 SHOULD 带稳定标识：

```text
feat(order): adjust order cancellation eligibility

Business-Change: BC-2026-014
Use-Case: UC-ORDER-004
Rules: BR-ORDER-003
Operation-Id: cancelOrder
```

字段按影响范围填写；纯机械重构不应伪造 BC。

## PR 作为业务变更边界

默认：

```text
一个 PR
→ 一个主要 Business Change
```

PR 描述 SHOULD 包含：

```text
Business Change
Operation
Use Case
Business Rules
Behavior Before
Behavior After
Affected Modules
API Change
Database Change
Test Evidence
```

一个 PR 如果同时包含多个互不相关的业务变更，应拆分。

## 当前规则文件的历史

重要业务规则 SHOULD 有稳定规则文档，例如：

```text
docs/business-rules/order/BR-ORDER-003-order-cancellation.md
```

通过：

```bash
git log --follow -- docs/business-rules/order/BR-ORDER-003-order-cancellation.md
```

查看该规则语义如何演化。

规则文档描述当前有效语义；每次变化原因由 BC / PR / Commit 解释。

## git blame 的定位

`git blame` 适合回答：

```text
这一行最后是谁、在哪个提交改的？
```

它不适合作为完整业务历史。

业务原因 SHOULD 继续追到：

```text
Commit
→ BC
→ PR
```

## 文件移动

需要移动或重命名重要业务文件时 SHOULD：

1. 尽量先做纯移动/重命名；
2. 不在同一步大量改变内容；
3. 后续再提交行为修改。

这样 `git log --follow` 更容易识别连续历史。

## 不相关格式化

业务修改提交 MUST NOT 顺手格式化整个模块或仓库。

格式化本身如果必要，应形成独立提交。

## Bug Fix 提交

故障修复 SHOULD 关联 Incident：

```text
fix(order): reject shipped order cancellation

Incident: INC-2026-008
Use-Case: UC-ORDER-004
Rules: BR-ORDER-003
Business-Change: BC-2026-014
```

若无法确定引入该问题的 BC，不应猜测。

## 历史质量判断

一个健康的 Git 历史应该让后来者能够较快回答：

```text
这条规则什么时候改变？
为什么改变？
哪个 PR 做的？
测试当时如何变化？
事故是否由某次变更引入？
```

如果必须阅读大量无关 Diff 才能回答，说明提交关注点没有充分分离。
