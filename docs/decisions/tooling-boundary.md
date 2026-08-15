# Tooling Boundary Decision

## Decision

先固定自动化语义和项目稳定接口，再从真实 Java/Spring 项目 Pilot 中提取通用 Checker；当前不先开发大而全的平台。

## Why

不同项目存在：

```text
Spring MVC / WebFlux
Maven / Gradle
单模块 / 多模块
OpenAPI 来源差异
UC / BR 元数据接入程度差异
HTTP runner / 部署平台差异
```

没有真实项目验证时直接写通用解析器容易过度设计。

## 当前固定

```text
Rule Code
Verify Target
Verification Result Status
CI 职责
HTTP/Deployment 验证语义
```

## 提取标准

通用工具 SHOULD 至少满足：

```text
两个以上项目需要
语义稳定
不依赖业务模型
配置成本可控
工具本身有测试
```

## Consequence

当前仓库定义规范和参考设计；具体业务仓库负责实际脚本、ArchUnit、`.http`、CI 和部署验证。Pilot 后再决定共享工具代码放本仓库还是独立 tooling 仓库。
