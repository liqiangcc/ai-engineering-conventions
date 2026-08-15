# 项目验证命令约定

## 目的

AI、本地开发者和 CI SHOULD 调用同一组稳定命令，而不是各自猜 Maven、Gradle、httpYac 或脚本参数。

## 推荐接口

```text
./scripts/verify <target>
```

## 标准 Target

```text
conventions
unit
business-rule
use-case
contract
architecture
http-regression
http-smoke
production-safe
all
```

项目 MAY 不支持所有 target，但不支持时应明确报告，不能静默跳过。

## 输出

```text
[PASS] business-rule
[PASS] use-case
[PASS] architecture
[NOT RUN] http-regression - application URL not provided
```

机器模式 SHOULD 支持 JSON，并遵守 `docs/schemas/verification-result.md`。

## Exit Code

```text
0  requested required targets 通过
1  至少一个 requested target 失败
2  工具/环境错误
3  target 不支持或参数错误
```

## Java 映射

内部可映射到 Maven Profile、Gradle Task、JUnit Tag、ArchUnit、httpYac、Testcontainers；外部调用者不需要知道工具细节。

## HTTP 环境

HTTP target 通过环境变量获取 BASE_URL、认证信息等；Secret MUST NOT 写入仓库。

## 边界

`verify` 只负责路由验证能力，不承载业务规则。

AI 如果发现稳定入口，MUST 优先使用它，不自行拼装替代命令；完成后报告实际运行 target 和 NOT_RUN 项。
