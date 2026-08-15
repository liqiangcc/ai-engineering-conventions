# log-query-mcp Verification Pilot

## 目的

使用真实活跃仓库验证以下通用约定是否可落地：

```text
AI / Local / CI
→ Stable Verification Command
→ Convention Checks
→ Existing Verification Capabilities
→ CI Orchestration
→ HTTP Runtime Verification
→ Evidence
```

Pilot 仓库：`liqiangcc/log-query-mcp`

PR：`#29 Pilot stable verification entrypoint for AI/local/CI`

## 为什么选择该仓库

当前可访问的自有仓库中没有同时具备完整 Spring Boot 构建入口、HTTP API 和可运行测试基线的合适 Java Pilot。

`log-query-mcp` 是真实活跃项目，并已经具有 Rust fmt/clippy/test/build、JSON Schema contract validation、GitHub Actions、Streamable HTTP 服务以及实际发布运维文档。

因此先用于验证语言无关的自动化分离点，Java / ArchUnit 仍留给后续真实 Spring 项目。

## 已实现能力

稳定入口：

```text
scripts/verify
```

Targets：

```text
conventions
fmt
clippy
test
build
rust
contracts
http-smoke
all
```

职责保持分离：

```text
scripts/verify
→ 只负责编排

scripts/check_conventions.py
→ 项目结构约定检查

Cargo
→ Rust 验证能力

scripts/validate_contracts.py
→ Contract 验证能力

httpYac + tests/http/**/*.http
→ 真实 HTTP 边界验证能力

GitHub Actions
→ 远程编排
```

`all` 只包含无需运行实例的 source/build/contract/convention 验证；`http-smoke` 单独要求真实 `BASE_URL`。

## Convention Checker MVP

Pilot 已增加项目本地 Checker：

```text
scripts/check_conventions.py
```

稳定入口：

```bash
./scripts/verify conventions
```

第一版只检查高确定性规则：

```text
LQM_HTTP001  必须存在 MCP initialize HTTP 验证资产
LQM_HTTP002  每个 .http Case 必须有唯一 @name
LQM_HTTP003  production-safe 不得同时 destructive
LQM_HTTP004  请求必须使用环境 BASE_URL
LQM_HTTP005  每个 HTTP Case 必须有明确 status 断言
```

这些规则使用 `LQM_` 项目前缀，而不是直接占用通用 UC/BR/HTTP Rule Code。原因是当前项目尚未采用完整 Operation/UC/BR 元数据体系；Pilot 不应为了通用化而伪造不存在的业务身份。

新增独立 Workflow：

```text
.github/workflows/conventions.yml
→ ./scripts/verify conventions
```

因此：

```text
Convention Checker
≠ Rust Test
≠ Contract Test
≠ HTTP Runtime Test
```

失败可以按关注点单独分类。

## HTTP Pilot

新增：

```text
tests/http/mcp/initialize.http
```

对应：

```bash
BASE_URL=http://127.0.0.1:8000 ./scripts/verify http-smoke
```

Case 断言 HTTP 200、Content-Type、`jsonrpc` 和 `protocolVersion`，并标记：

```text
smoke
deployment
production-safe
```

它可以在本地、staging 和部署后重放同一个接口资产。

## Verification Result

### Implementation

```text
Stable command: IMPLEMENTED
Convention checker: IMPLEMENTED
Convention workflow wiring: IMPLEMENTED
Rust/Contract workflow wiring: IMPLEMENTED
HTTP executable asset: IMPLEMENTED
CI runtime verification: NOT VERIFIED
HTTP runtime verification: NOT VERIFIED
```

### GitHub Actions

最初 Rust / Contracts / Release 三个 Job 均在 step 执行前失败：

```text
runner_id: 0
steps: []
```

GitHub Check annotation 表明账户 billing / spending-limit 阻止 Job 启动。

随后显式重跑 Contracts Job，结果仍然：

```text
steps: []
```

增加 Convention Workflow 后，新 Head 实际触发：

```text
Conventions
Rust
Contracts
Release
```

其中 `Conventions / check-conventions` 同样：

```text
steps: []
```

因此它没有机会执行 `scripts/check_conventions.py`。当前结论仍是：

```text
TEST_ENVIRONMENT_FAILURE
```

而不是：

```text
CONVENTION_FAILURE
BUILD_FAILURE
CONTRACT_FAILURE
HTTP_API_FAILURE
```

这证明“CI 红色状态”必须与“具体验证能力失败”分开解释。

### 独立执行环境

尝试在隔离执行环境 clone Pilot 仓库，但该环境不能解析 `github.com`，因此无法获得仓库工作树。该结果同样属于环境限制，不能写成本地 PASS 或代码 FAIL。

## Pilot 得到的结论

### 1. Stable Verification Command 有价值

AI、本地开发和 CI 可以使用同一入口：

```text
./scripts/verify <target>
```

具体 Cargo、Python validator、httpYac 等工具参数被隔离在项目内部。

### 2. Convention 与 Behavior 必须分开

Checker 只检查结构、命名和安全元数据；HTTP 协议是否真的正确仍由 `.http` Case 和运行实例决定。

### 3. 项目本地规则应先于过早通用化

当前先使用 `LQM_HTTP*` 规则。只有真实项目验证后，才能判断哪些规则值得提升到 `ai-engineering-conventions` 的通用 Rule Catalog。

### 4. Pre-Deployment 与 Runtime Verification 必须分离

`./scripts/verify all` 不代表已部署实例正确。

真实运行时验证必须显式执行：

```text
./scripts/verify http-smoke
```

### 5. PASS / FAIL 不足以描述现实

Pilot 实际证明必须保留：

```text
NOT_RUN
NOT_VERIFIED
TEST_ENVIRONMENT_FAILURE
```

不能看到 workflow failure 就让 AI 修改业务代码。

## 当前结论

```text
Pilot status: PARTIALLY_VERIFIED

Design separation: VERIFIED BY REVIEW
Stable entrypoint wiring: IMPLEMENTED
Convention checker MVP: IMPLEMENTED
Convention CI wiring: IMPLEMENTED
HTTP regression/smoke asset: IMPLEMENTED
CI runtime: NOT VERIFIED
HTTP runtime: NOT VERIFIED
Blocking reason: GitHub Actions billing/spending-limit + isolated runner network restriction
```

## 下一步

1. 恢复 GitHub Actions runner 可用性；
2. 重新运行 Conventions / Rust / Contracts；
3. 让 `./scripts/verify conventions` 获得真实 PASS/FAIL 证据；
4. 在可访问 `log-query-mcp` 实例的环境执行 `BASE_URL=... ./scripts/verify http-smoke`；
5. staging 部署后重放同一个 `initialize.http`；
6. 观察 `LQM_HTTP*` 规则在真实演进中是否稳定，再决定是否提取为通用 Checker 规则；
7. Java / ArchUnit 继续等待真实 Spring Boot Pilot。
