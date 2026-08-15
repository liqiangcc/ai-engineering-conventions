# log-query-mcp Verification Pilot

## 目的

使用真实活跃仓库验证以下通用约定是否可落地：

```text
AI / Local / CI
→ Stable Verification Command
→ Existing Verification Capabilities
→ CI Orchestration
→ HTTP Runtime Verification
→ Evidence
```

Pilot 仓库：`liqiangcc/log-query-mcp`

PR：`#29 Pilot stable verification entrypoint for AI/local/CI`

## 为什么选择该仓库

当前可访问的自有仓库中没有同时具备完整 Spring Boot 构建入口、HTTP API 和可运行测试基线的合适 Java Pilot。

`log-query-mcp` 是真实活跃项目，并已经具有：

- Rust fmt / clippy / test / release build；
- JSON Schema contract validation；
- GitHub Actions；
- 生产 Streamable HTTP 服务；
- 实际发布和运维文档。

因此先用于验证**语言无关的自动化分离点**，Java / ArchUnit 仍留给后续真实 Spring 项目。

## 实现

新增稳定入口：

```text
scripts/verify
```

Targets：

```text
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

Cargo
→ Rust 验证能力

scripts/validate_contracts.py
→ Contract 验证能力

httpYac + tests/http/**/*.http
→ 真实 HTTP 边界验证能力

GitHub Actions
→ 远程编排
```

现有 Rust workflow 改为：

```text
./scripts/verify rust
```

现有 Contracts workflow 改为：

```text
./scripts/verify contracts
```

新增真实 HTTP smoke asset：

```text
tests/http/mcp/initialize.http
```

对应运行入口：

```bash
BASE_URL=http://127.0.0.1:8000 ./scripts/verify http-smoke
```

`http-smoke` 没有加入 `all`。原因是：

```text
all
→ pre-deployment source/build/contract verification
→ 不要求运行实例

http-smoke
→ runtime / post-deployment verification
→ 要求真实 BASE_URL + httpYac
```

这保持了“代码验证”和“运行实例验证”两个关注点分离。

## Verification Result

### Implementation

```text
Stable command: IMPLEMENTED
Workflow wiring: IMPLEMENTED
HTTP executable asset: IMPLEMENTED
CI runtime verification: NOT VERIFIED
HTTP runtime verification: NOT VERIFIED
```

### GitHub Actions

PR 创建后真实触发：

```text
Rust
Contracts
Release
```

三个 Job 都在任何 step 执行前直接失败：

```text
runner_id: 0
steps: []
```

GitHub Check annotation：

```text
The job was not started because recent account payments have failed
or your spending limit needs to be increased.
```

因此分类为：

```text
TEST_ENVIRONMENT_FAILURE
```

而不是：

```text
BUILD_FAILURE
BUSINESS_RULE_FAILURE
CONTRACT_FAILURE
HTTP_API_FAILURE
```

### 独立执行环境

尝试在隔离执行环境拉取 Pilot 仓库以运行相同 `scripts/verify`，但该环境不能解析 `github.com`，因此仓库无法 clone。

该结果仍属于执行环境限制，不能写成本地 PASS 或代码 FAIL。

## HTTP Pilot

新增 `tests/http/mcp/initialize.http`，复用 README 已存在的 MCP `initialize` 外部操作语义，并断言：

```text
HTTP 200
Content-Type 存在
响应包含 jsonrpc
响应包含 protocolVersion
```

该 Case 标记为：

```text
smoke
deployment
production-safe
```

原因是 initialize 为只读握手，不修改日志或业务数据。

它可以在本地、staging 和部署后对同一个真实接口重放，而不重新维护一份 curl 逻辑。

当前因为没有可达运行实例 + 可执行 httpYac 的环境，状态仍准确记录为：

```text
NOT VERIFIED
```

## 规范验证到的结论

### 1. PASS / FAIL 不足以描述现实

这次 Pilot 证明必须保留：

```text
NOT_RUN
NOT_VERIFIED
ENVIRONMENT_ERROR / TEST_ENVIRONMENT_FAILURE
```

否则 AI 很容易把“CI 红了”误判成代码错误。

### 2. Workflow 与能力分离有价值

CI YAML 不再复制 Cargo 验证命令和 Contract validator 调用细节。

本地、AI、CI 可以共享同一入口：

```text
./scripts/verify <target>
```

### 3. Pre-Deployment 与 Runtime Verification 必须分离

`./scripts/verify all` 不隐含 HTTP 运行实例已经正确。

真正的外部运行时验证必须显式执行：

```text
./scripts/verify http-smoke
```

并提供具体环境 identity / BASE_URL。

### 4. Runtime Evidence 不能由代码 Review 代替

虽然脚本、HTTP asset 和 Workflow wiring 可以静态 Review，但在 runner/服务实际执行前，状态仍必须写：

```text
NOT VERIFIED
```

不能因为“看起来正确”就写 VERIFIED。

### 5. Pilot 应暴露基础设施问题，而不是绕过

此次没有为了获得绿色结果：

- 删除 required workflow；
- 跳过失败；
- 把失败改写成 PASS；
- 伪造本地执行结果；
- 把 HTTP asset 的存在写成 HTTP PASS。

而是保留 PR 并明确记录环境阻塞。

## 当前结论

```text
Pilot status: PARTIALLY_VERIFIED

Design separation: VERIFIED BY REVIEW
Stable entrypoint wiring: IMPLEMENTED
HTTP regression/smoke asset: IMPLEMENTED
CI runtime: NOT VERIFIED
HTTP runtime: NOT VERIFIED
Blocking reason: GitHub Actions billing/spending-limit + current isolated runner network restriction
```

## 下一步

1. 恢复 GitHub Actions runner 可用性；
2. 重新运行 PR #29 的 Rust / Contracts workflows；
3. 在一个可访问 `log-query-mcp` 实例的环境执行 `BASE_URL=... ./scripts/verify http-smoke`；
4. staging 部署后重放同一个 `initialize.http`；
5. 若出现真实 HTTP Bug，把复现 Case 永久保留到 `tests/http/`；
6. Java / ArchUnit 继续等待一个真实 Spring Boot Pilot，不使用不完整仓库或 Demo 替代。
