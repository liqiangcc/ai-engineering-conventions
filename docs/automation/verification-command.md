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

| Exit | 含义 |
|---|---|
| 0 | 已声明的必需范围满足（VERIFIED） |
| 1 | 必需项存在 FAIL 或 PRE_EXISTING_FAILURE |
| 2 | 必需项发生工具/环境错误，或入口工具本身故障 |
| 3 | 参数错误或请求的 target 不支持 |
| 4 | 必需验证不完整，包括 NOT_RUN / NOT_VERIFIED、空结果或没有必需项 |

先校验全部参数和 target，错误返回 3，不开始部分执行。参数有效时，组合执行按必需失败（1）→ 必需工具/环境错误（2）→ 不完整（4）→ 满足（0）的优先级返回；报告保留全部原因。入口工具自身故障导致无法可靠汇总时返回 2，不伪造结果。

非必需检查不影响门禁和退出码，但其失败、环境错误及未执行项必须披露。显式请求的 target 默认作为必需项；组合 target 的必需集合在执行前按项目门禁确定，不能事后删掉失败项。

汇总结论遵守[Verification Result](../schemas/verification-result.md#conclusion)。`all` 的项目覆盖范围必须公开；未包含 HTTP/部署验证时必须明确说明，不能从名称推断全部环境已验证。

## Java 映射

内部可映射到 Maven Profile、Gradle Task、JUnit Tag、ArchUnit、httpYac、Testcontainers；外部调用者不需要知道工具细节。

## HTTP 环境

HTTP target 通过环境变量获取 BASE_URL、认证信息等；Secret MUST NOT 写入仓库。

## 边界

`verify` 只负责路由验证能力，不承载业务规则。

AI 如果发现稳定入口，MUST 优先使用它，不自行拼装替代命令；完成后报告实际运行 target 和 NOT_RUN 项。
