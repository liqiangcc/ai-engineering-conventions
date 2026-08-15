# log-query-mcp Verification Pilot

## 目的

使用真实活跃仓库验证以下通用约定是否可落地：

```text
AI / Local / CI
→ Stable Verification Command
→ Existing Verification Capabilities
→ CI Orchestration
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

README 同时使用该稳定入口作为开发者/AI 的默认验证路径。

## Verification Result

### Implementation

```text
Stable command: IMPLEMENTED
Workflow wiring: IMPLEMENTED
Runtime verification: NOT VERIFIED
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

### 3. Runtime Evidence 不能由代码 Review 代替

虽然脚本和 Workflow wiring 可以静态 Review，但在 runner 实际执行前，状态仍必须写：

```text
NOT VERIFIED
```

不能因为“看起来正确”就写 VERIFIED。

### 4. Pilot 应暴露基础设施问题，而不是绕过

此次没有为了获得绿色结果：

- 删除 required workflow；
- 跳过失败；
- 把失败改写成 PASS；
- 伪造本地执行结果。

而是保留 PR 并明确记录环境阻塞。

## 当前结论

```text
Pilot status: PARTIALLY_VERIFIED

Design separation: VERIFIED BY REVIEW
Stable entrypoint wiring: IMPLEMENTED
CI runtime: NOT VERIFIED
Blocking reason: GitHub Actions billing/spending-limit
```

## 下一步

1. 恢复 GitHub Actions runner 可用性；
2. 重新运行 PR #29 的 Rust / Contracts workflows；
3. 成功后记录真实执行证据；
4. 再增加该项目的 HTTP/MCP 可执行 regression；
5. Java / ArchUnit 继续等待一个真实 Spring Boot Pilot，不使用不完整仓库或 Demo 替代。
