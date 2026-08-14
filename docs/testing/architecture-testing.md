# Architecture 测试规范

## 目的

Architecture Test 用来证明代码结构仍然遵守既定分离点。

功能测试通过并不代表架构没有退化。AI 为了快速完成功能，最容易发生的结构性问题包括：

```text
domain 依赖 Spring/JPA
application 直接依赖具体 Adapter
Controller 直接操作 Repository Adapter
模块之间跨过公开 API 深层调用
shared/common 逐渐成为业务垃圾桶
```

这些问题应尽量由机器检查，而不是依赖 Reviewer 记忆。

## Java 推荐工具

Java / Spring 项目优先使用 ArchUnit；也可以结合 Maven/Gradle 模块边界、Spring Modulith 验证或自定义静态检查。

工具不是规范本身，规范先定义允许的依赖方向。

## 基本依赖方向

```text
adapter/in
    ↓
application
    ↓
domain

adapter/out
    ↑
application/port

config/bootstrap
    → 负责装配
```

## 最小规则集

### Domain 不依赖技术框架

```java
@ArchTest
static final ArchRule domain_must_not_depend_on_frameworks =
        noClasses()
                .that().resideInAPackage("..domain..")
                .should().dependOnClassesThat()
                .resideInAnyPackage(
                        "org.springframework..",
                        "jakarta.persistence.."
                );
```

根据实际技术栈扩展禁止包，但不要把 JDK 基础类型误判为外部框架。

### Application 不依赖 Adapter

```java
@ArchTest
static final ArchRule application_must_not_depend_on_adapters =
        noClasses()
                .that().resideInAPackage("..application..")
                .should().dependOnClassesThat()
                .resideInAPackage("..adapter..");
```

### Domain 不依赖 Application

```java
@ArchTest
static final ArchRule domain_must_not_depend_on_application =
        noClasses()
                .that().resideInAPackage("..domain..")
                .should().dependOnClassesThat()
                .resideInAPackage("..application..");
```

### 入站 Adapter 不直接依赖出站实现

例如禁止：

```text
OrderController
→ JpaOrderRepositoryAdapter
```

允许：

```text
OrderController
→ CancelOrderUseCase
→ OrderRepository
← JpaOrderRepositoryAdapter
```

### 模块内部实现不可被其他模块深层引用

例如订单模块公开：

```text
order.api
```

则其他模块不得依赖：

```text
order.domain
order.application
order.adapter
```

具体白名单由模块地图或模块公开 API 定义。

## 命名与位置检查

可逐步增加：

- `..application..` 中的主要操作类以 `UseCase` 结尾；
- `..adapter.in.web..` 中的入口以 `Controller` 结尾；
- 出站 Port 实现以 `Adapter` 结尾；
- `domain` 中禁止 `Jpa`、`Redis`、`Kafka`、`Http` 等技术前缀；
- 禁止 `ServiceImpl`、`CommonService`、`Utils` 等约定中的模糊角色名。

命名检查应服务于可导航性，不要为了正则完美制造不必要例外。

## 模块边界

模块边界测试优先检查：

```text
谁可以被外部模块调用
谁只能模块内部使用
是否出现循环依赖
是否绕过公开 API
```

若使用 Spring Modulith，可把其模块验证作为额外证据，但仓库的业务模块定义仍应以项目约定为准。

## 测试和生产代码同样受约束

测试辅助代码不得成为绕过架构的后门。

例如，Application Test 可以使用测试 Fake Port，但不应该为了方便直接访问生产环境的 JPA Adapter 内部实现。

## 例外管理

确实需要突破规则时：

1. 不得直接删除或全局放宽 Architecture Test。
2. 明确写出例外原因和范围。
3. 优先形成最窄白名单。
4. 如果是长期架构变化，先更新架构决策/规范，再更新测试。
5. 临时例外应有清理条件。

## AI 修改要求

AI 修改跨包、跨模块依赖时，必须运行 Architecture Tests。

如果架构测试失败，不允许以“功能测试已通过”为理由忽略。

AI 应报告：

```text
违反了哪条依赖规则
新增依赖方向是什么
是代码放错层、模块边界错误，还是规范需要正式调整
```

## 完成标准

至少把高价值且稳定的边界机器化：

```text
domain/framework 边界
application/adapter 边界
模块公开 API 边界
关键禁止依赖
```

不要一次把所有设计偏好都编码成 Architecture Test。只有稳定、可客观判断的约束才适合自动化。