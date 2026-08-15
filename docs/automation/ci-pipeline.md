# CI Pipeline 参考设计

## PR Pipeline

```text
conventions
     ↓
compile / static-check
     ↓
rule-usecase-tests
     ↓
contract-architecture-tests
     ↓
http-regression
     ↓
verification-summary
```

可以并行的 Job SHOULD 并行，但 Summary 必须区分每层结果。

## GitHub Actions 推荐职责

```text
.github/workflows/
├── conventions.yml
├── java-verification.yml
├── http-api.yml
└── post-deployment.yml
```

Workflow SHOULD 只调用项目稳定命令，不在 YAML 中实现 Checker 或业务判断。

## HTTP Regression

两种模式：CI 内启动应用，或部署 ephemeral environment 后运行 `tests/http/`。

项目 SHOULD 封装 runner 参数：

```text
./scripts/verify http-regression
```

而不是在多个 workflow 复制 httpYac 参数。

## Deployment Pipeline

```text
artifact
→ deploy-staging
→ verify-version
→ targeted-regression
→ smoke
→ promote / stop
```

生产：

```text
deploy-production
→ verify-version
→ production-safe smoke
→ record verification
```

## Required Failure

PR MUST 阻断 compile、MUST convention、BR/UC、contract、architecture 和 required HTTP regression failure。

部署晋级 SHOULD 阻断 running version mismatch、targeted regression failure 和 required smoke failure。

生产不安全写操作未执行应记录 NOT_VERIFIED，不得伪装 PASS。

## Evidence

建议保留 JUnit reports、Convention JSON、HTTP report、Verification Summary、Deployment version metadata。

## 边界

```text
Workflow
→ stable project command
→ checker/test/runner
→ standard result
```

避免 300 行 Bash/YAML 承载所有逻辑。
