# Java 自动验证落地参考

## 推荐组合

```text
JUnit 5               → Business Rule / Use Case Tests
ArchUnit              → Architecture Tests
Spring/Testcontainers → 必要 Adapter / Integration Tests
httpYac 或等价 runner → tests/http/**/*.http
Maven / Gradle        → 项目内部实现
scripts/verify        → AI/本地/CI 稳定入口
```

## 测试分类

JUnit 5 可使用 Tag：

```java
@Tag("business-rule")
class OrderCancellationPolicyTest {}

@Tag("use-case")
class CancelOrderUseCaseTest {}

@Tag("contract")
class JpaOrderRepositoryAdapterTest {}

@Tag("architecture")
class ArchitectureTest {}
```

也可以依赖 package naming；项目选择一种并保持一致。

## ArchUnit

至少覆盖：

```text
domain → framework 禁止
application → adapter 禁止
跨模块内部引用禁止
controller → persistence adapter 禁止
```

## HTTP

默认：

```text
tests/http/{module}/{operation}.http
```

例如：

```text
tests/http/order/cancel-order.http
```

通过 `BASE_URL` 等环境变量运行，Secret 不入库。

## Spring Context

```text
Rule Test      → 不启动 Spring
Use Case Test  → 默认不启动完整 Spring
Adapter Test   → 按需要 slice/container
HTTP Test      → 真实应用实例
```

## 原则

Maven/Gradle/ArchUnit/httpYac 都是可替换技术 Adapter。稳定的是：业务规则验证、流程验证、契约验证、架构验证、HTTP 验证和部署后验证的语义。
