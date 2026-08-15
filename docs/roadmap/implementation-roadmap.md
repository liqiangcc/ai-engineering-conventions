# 自动化实施路线

## Phase 1：统一验证入口

实现 `scripts/verify`，至少支持：

```text
unit
architecture
http-regression
all
```

## Phase 2：Java Architecture Tests

用 ArchUnit 自动保护：

```text
domain/framework
application/adapter
module internal/public API
controller/persistence
```

## Phase 3：HTTP Regression

建立：

```text
tests/http/{module}/{operation}.http
```

优先覆盖历史 Bug、核心写操作、关键查询和部署 smoke。

## Phase 4：Convention Checker MVP

第一版只做高确定性检查：

```text
UC / BR ID uniqueness
operationId uniqueness
HTTP test path existence
BR implementation/test reference existence
```

## Phase 5：Deployment Verification

staging：运行版本确认 + targeted regression + smoke。

production：只执行 production-safe。

## Phase 6：自动导航

生成：

```text
Entry Point → Operation → UC → BR → HTTP Test
```

## Phase 7：Verification Summary

CI 自动汇总 AC、BR/UC、Architecture、HTTP、Deployment 和 Not Verified。

## Stop Condition

完成上述规范设计后，下一步 MUST 进入真实项目 Pilot；没有 Pilot 反馈前不继续增加 DSL、平台或新的抽象层。
