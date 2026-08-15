# log-query-mcp Self-hosted Runner Probe

## Concern

验证 GitHub-hosted Actions 因 Billing / spending-limit 在 runner 启动前失败时，self-hosted runner 调度路径是否仍可使用。

该记录与 Convention / Rust / Contract / HTTP 行为验证分离。

## Pilot Repository

```text
liqiangcc/log-query-mcp
PR #29
Issue #28
```

## Probe Design

Workflow：

```text
.github/workflows/self-hosted-billing-probe.yml
```

只执行：

```text
SELF_HOSTED_BILLING_PROBE
repo=<repo>
sha=<candidate>
runner=<runner>
```

不 checkout 业务代码、不使用生产 Secret、不访问生产服务。

Runner 匹配条件：

```text
self-hosted
verification-pilot
```

并提供项目内 bootstrap：

```text
scripts/bootstrap-self-hosted-runner.sh
```

runner 使用 `--ephemeral`，只处理一个匹配 Job。

## Evidence

GitHub-hosted Jobs：

```text
Conventions / Rust / Contracts / Release
→ completed failure
→ no workflow steps executed
```

Self-hosted probe：

```text
Self-hosted Billing Probe
→ status: queued
→ conclusion: null
```

因此当前证据支持：

```text
GitHub-hosted path
→ blocked before runner execution

Self-hosted path
→ not immediately rejected by the same control path
→ waiting for a matching online runner
```

但 `queued` 不是 PASS。

## Current Classification

```text
Self-hosted fallback: NOT VERIFIED
Current blocker: matching `verification-pilot` runner unavailable / status unknown
```

不能在实际 step 执行前判断：

```text
RUNNER_NOT_REGISTERED
RUNNER_OFFLINE
LABEL_MISMATCH
ACCOUNT_LOCK_BLOCKS_SELF_HOSTED
```

GitHub connector 当前无权限读取 repository runner list，因此不猜测具体子类型。

## Next Evidence Gate

在隔离 Linux 主机注册 ephemeral runner 后，必须实际看到：

```text
SELF_HOSTED_BILLING_PROBE
```

然后才允许按顺序执行：

```text
conventions
→ contracts
→ rust
```

不因为 probe 可调度就直接把全部正式 CI 切到 self-hosted。
