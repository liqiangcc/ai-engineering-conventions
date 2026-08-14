# Use Case 与 Business Rule 注解规范

## 目的

注解只承担稳定身份与导航元数据，不承载业务逻辑。

推荐提供两个轻量注解：

```text
@UseCase
@BusinessRule
```

它们用于：

- 全局搜索；
- CI 扫描；
- 自动生成导航索引；
- Code Review 定位；
- Git / PR 关联稳定标识。

## UseCase 注解

推荐定义：

```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
public @interface UseCase {
    String id();
    String operationId() default "";
}
```

使用：

```java
@UseCase(
    id = "UC-ORDER-004",
    operationId = "cancelOrder"
)
public final class CancelOrderUseCase {
}
```

约束：

- `id` MUST 唯一；
- `id` 在类移动、重命名时 SHOULD 保持稳定；
- `operationId` 表达主要外部 Operation；
- 一个 Use Case 有多个入口时，其他入口关系 SHOULD 由自动索引或入口元数据补充，而不是复制多个 Use Case ID。

## BusinessRule 注解

推荐定义：

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
@Repeatable(BusinessRules.class)
public @interface BusinessRule {
    String value();
}
```

```java
@Target({ElementType.TYPE, ElementType.METHOD})
@Retention(RetentionPolicy.RUNTIME)
public @interface BusinessRules {
    BusinessRule[] value();
}
```

使用：

```java
@BusinessRule("BR-ORDER-003")
public final class OrderCancellationPolicy {
}
```

优先规则：

- 一个类对应一个主要规则时 SHOULD 标在类上；
- 规则天然属于 Entity 某个行为时 MAY 标在方法上；
- 一个巨大 Service 上挂大量规则注解通常意味着职责需要继续拆分。

## 注解不承载规则表达式

禁止把注解发展为自制规则引擎：

```java
@BusinessRule(
    expression = "status != SHIPPED",
    priority = 10,
    retry = false
)
```

正确职责分工：

```text
注解       → 规则是谁
Java 代码  → 规则如何执行
测试       → 规则行为是否被证明
BR 文档    → 当前业务语义
Git / BC   → 为什么发生变化
```

## 不使用 Business Change 注解

禁止：

```java
@BusinessChange("BC-2026-014")
public class OrderCancellationPolicy {}
```

原因：一个当前类会经历多个历史变更，而 BC 表达一次历史事件。

BC 应存在于：

```text
docs/changes/
PR
Commit message
```

当前代码只保留稳定身份：

```text
UC
BR
```

## 与 Bean Validation 的边界

`@NotBlank`、`@Size`、`@Pattern` 等主要表达输入格式和数据约束。

`@BusinessRule` 表达业务语义身份。

例如：

```text
reason 不能为空
→ 输入校验

已发货订单禁止取消
→ Business Rule
```

两者不得混淆。

## 自动索引

CI SHOULD 能扫描注解并生成类似：

```yaml
useCases:
  - id: UC-ORDER-004
    operationId: cancelOrder
    class: CancelOrderUseCase

businessRules:
  - id: BR-ORDER-003
    class: OrderCancellationPolicy
    usedBy:
      - UC-ORDER-004
```

机器可从代码推导的信息 SHOULD 自动生成，不要求人工维护第二份重复索引。
