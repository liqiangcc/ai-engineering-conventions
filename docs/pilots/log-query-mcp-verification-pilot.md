# log-query-mcp Verification Pilot

## 目的

使用真实活跃仓库验证以下通用约定是否可落地：

```text
AI / Local / CI
→ Stable Verification Command
→ Convention Checker
→ Existing Verification Capabilities
→ CI Orchestration
→ HTTP Runtime Verification
→ Evidence
```

Pilot 仓库：`liqiangcc/log-query-mcp`

PR：`#29 Pilot stable verification entrypoint for AI/local/CI`

## 为什么选择该仓库

当前可访问的自有仓库中没有同时具备完整 Spring Boot 构建入口、HTTP API 和可运行测试基线的合适 Java Pilot。

`log-query-mcp` 是真实活跃项目，并已经具有 Rust 验证、JSON Schema Contract、GitHub Actions、Streamable HTTP 服务和实际发布运维文档，因此先用于验证语言无关的自动化分离点。

## 已实现能力

### Stable Verification Command

```text
scripts/verify
```

Targets：

```text
conventions
conventions-test
fmt
clippy
test
build
rust
contracts
http-smoke
all
```

职责：

```text
scripts/verify
→ 稳定编排入口

Cargo
→ Rust 验证能力

scripts/validate_contracts.py
→ Contract 验证能力

scripts/check_conventions.py
→ 当前仓库 Convention Checker

httpYac + tests/http/**/*.http
→ 真实 HTTP 边界验证能力

GitHub Actions
→ 远程编排
```

### Convention Checker MVP

项目本地规则：

```text
LQM_HTTP001  required MCP initialize HTTP case exists
LQM_HTTP002  HTTP case @name exists and is unique
LQM_HTTP003  production-safe and destructive cannot coexist
LQM_HTTP004  HTTP request uses environment BASE_URL
LQM_HTTP005  HTTP case asserts explicit status
```

第一版使用 `LQM_*` 项目本地 Rule Code，而不是过早假设通用 UC/BR 元数据已经存在。

### Checker Self Tests

Checker 已重构为可测试的纯规则函数：

```text
collect_violations(root)
```

并增加临时目录 Fixture 覆盖：

```text
valid asset                 → no violation
missing initialize          → LQM_HTTP001
duplicate @name             → LQM_HTTP002
production-safe destructive → LQM_HTTP003
hard-coded base URL         → LQM_HTTP004
missing status assertion    → LQM_HTTP005
```

统一入口现在执行：

```text
./scripts/verify conventions
→ conventions-test
→ convention-checker
```

因此以后可以区分：

```text
Checker implementation defect
vs
Repository convention violation
```

### HTTP Smoke

真实资产：

```text
tests/http/mcp/initialize.http
```

运行：

```bash
BASE_URL=http://127.0.0.1:8000 ./scripts/verify http-smoke
```

该 Case 为：

```text
smoke
deployment
production-safe
```

`http-smoke` 不包含在 `all` 中，因为运行实例验证和源码/构建验证是不同关注点。

## CI Wiring

独立 Workflow：

```text
Conventions → ./scripts/verify conventions
Rust        → ./scripts/verify rust
Contracts   → ./scripts/verify contracts
Release     → existing release orchestration
```

CI 不重新实现 Checker、Cargo 或 Contract 能力。

## 当前执行证据

### GitHub Actions

PR 实际触发了：

```text
Conventions
Rust
Contracts
Release
```

所有 GitHub-hosted Job 均在任何 step 开始前失败：

```text
runner_id: 0
steps: []
```

此前 GitHub Check annotation 明确报告 Billing / spending-limit 阻止 Job 启动。

重新触发 Contracts 后仍然 `steps=[]`；新增 Conventions Workflow 同样 `steps=[]`。

因此准确分类仍为：

```text
TEST_ENVIRONMENT_FAILURE
```

不能分类成：

```text
CONVENTION_FAILURE
BUILD_FAILURE
CONTRACT_FAILURE
HTTP_API_FAILURE
```

### 独立执行环境

曾尝试在隔离执行环境 clone Pilot 仓库运行相同稳定入口，但环境不能解析 `github.com`，因此同样没有形成代码运行证据。

## Verification Status

```text
Pilot status: PARTIALLY_VERIFIED

Design separation:                 VERIFIED BY REVIEW
Stable verification entrypoint:    IMPLEMENTED
Convention Checker MVP:            IMPLEMENTED
Convention Checker self-tests:     IMPLEMENTED
Convention CI wiring:              IMPLEMENTED
Rust / Contract CI wiring:         IMPLEMENTED
HTTP regression/smoke asset:       IMPLEMENTED

Convention runtime:                NOT VERIFIED
Checker self-test runtime:         NOT VERIFIED
Rust runtime:                      NOT VERIFIED
Contract runtime:                  NOT VERIFIED
HTTP runtime:                      NOT VERIFIED

Blocking reason:
GitHub Actions billing/spending-limit + current isolated runner network restriction
```

## Pilot 结论

### 1. Checker 也必须被测试

如果 Convention Checker 成为 required check，它自身必须有 deterministic fixtures，不能只相信脚本实现。

### 2. Convention Failure 与 Environment Failure 必须分离

即使 `Conventions` 在 GitHub UI 显示红色，只要 `steps=[]`，就没有证据说明任何 `LQM_HTTP*` 规则失败。

### 3. Workflow 只负责编排

Checker 规则、Checker Test、Rust 验证、Contract 验证、HTTP Case 都位于各自职责位置，Workflow 只调用稳定入口。

### 4. Pre-Deployment 与 Runtime Verification 必须分离

```text
./scripts/verify all
```

只覆盖无需真实运行实例的验证；真实 HTTP 行为必须显式执行 `http-smoke`。

### 5. Evidence Over Claims

实现、测试文件、Workflow 都存在，不等于它们已经实际 PASS。只要没有真实运行证据，状态保持 `NOT VERIFIED`。

## 下一步

1. 恢复 GitHub Actions runner；
2. 首先执行 `./scripts/verify conventions`，取得 Checker 自测 + 真实仓库检查证据；
3. 再取得 Rust / Contracts 真实结果；
4. 在可访问的 `log-query-mcp` 实例执行 `http-smoke`；
5. staging 部署后重放同一个 `initialize.http`；
6. 有真实 Spring Boot 项目后再执行 Java / ArchUnit Pilot。
