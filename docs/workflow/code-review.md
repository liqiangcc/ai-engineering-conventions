# Code Review 流程

## 目标

Review 不应先花大量时间重新发现代码结构，而应沿稳定业务坐标检查“改了什么、为什么改、是否放在正确分离点”。

## Review 起点

业务变更优先从以下信息开始：

```text
BC
Operation
UC
BR
Behavior Before / After
```

然后再看 Diff。

## 固定 Review 路径

```text
Business Change
    ↓
Operation
    ↓
Use Case
    ↓
Business Rule
    ↓
Tests
    ↓
Port / Adapter（若受影响）
```

## 第一层：变化原因

先判断 PR 是否只有一个主要变化原因。

警惕：

```text
业务修改 + 大规模重构
业务修改 + 全局格式化
业务修改 + 无关依赖升级
多个无关业务需求混在一起
```

这些情况会显著降低 Review 质量和后续 Git 可追溯性。

## 第二层：分离点

Reviewer 应检查：

### Domain

- 业务判断是否位于 Domain；
- 规则是否使用业务语言；
- 是否意外依赖 Spring / JPA / HTTP / Redis；
- 决策分支是否完整。

### Application

- Use Case 是否只负责编排；
- 是否出现隐藏业务规则；
- 事务、幂等、调用顺序是否合理；
- 是否越过 Port 直接调用具体技术实现。

### Adapter

- 是否只做协议、映射和技术实现；
- 是否偷偷决定业务行为；
- 外部失败是否正确转换成应用可理解的错误。

### Module Boundary

- 是否访问另一模块内部类；
- 是否引入循环依赖；
- 是否应该通过 API / Port / Event 交互。

## 第三层：业务规则

对于每个受影响 BR，Review SHOULD 检查：

```text
当前规则描述是否清楚
代码实现是否一致
决策表是否覆盖关键组合
测试是否对应决策表
失败原因码是否明确
```

不要只检查“代码有没有 bug”，还要检查“规则是否被完整表达”。

## 第四层：测试

测试名称 SHOULD 使用业务语言，并能说明具体场景。

不推荐：

```text
shouldWork
returnsTrue
testCancel
```

推荐：

```text
shouldRejectCancellationWhenOrderIsShipped
shouldAllowCancellationBeforeShipment
```

如果 Bug 修复只增加实现而没有先暴露失败场景的测试，Reviewer 应要求补齐。

## 第五层：历史可读性

Review SHOULD 检查：

- 是否关联 BC；
- Commit 是否包含必要 UC / BR / Operation；
- 是否混入无关移动或格式化；
- 未来 `git log` 是否还能理解这次业务变化。

## Review 结论分类

问题尽量明确分类，而不是模糊评论“这里不优雅”：

```text
Business Rule placement
Use Case orchestration
Port boundary
Adapter leakage
Module boundary
Naming/navigation
Test coverage
Traceability
Unrelated change
```

这样 Review 意见可统计，也更容易被 AI 自动处理。

## 原则

好的结构让 Reviewer 从“理解作者的代码组织方式”转向“验证业务行为和边界是否正确”。
