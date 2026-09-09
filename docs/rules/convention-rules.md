# Convention Rule Catalog

正文是语义、适用范围和强制级别的权威来源；本表仅提供稳定编号与摘要。规则变更先更新正文，再同步本表，避免 Checker 与人工 Review 执行不同要求。

## Operation

| Rule | Level | Meaning | Source |
|---|---|---|---|
| OP001 | MUST | operationId 唯一 | [规范正文](../java/use-case-convention.md) |
| OP002 | SHOULD | operationId 使用 verbNoun | [规范正文](../java/use-case-convention.md) |
| OP003 | SHOULD | HTTP 资源可映射到业务模块 | [规范正文](../java/use-case-convention.md) |

## Use Case

| Rule | Level | Meaning | Source |
|---|---|---|---|
| UC001 | MUST | UC ID 唯一 | [规范正文](../traceability/identity-system.md) |
| UC002 | SHOULD | 重要 operation 有主要 Use Case（已弃用，不用于新接入） | [规范正文](../java/use-case-convention.md) |
| UC003 | SHOULD | operation 与 Use Case 共享业务动作语义 | [规范正文](../java/use-case-convention.md) |
| UC004 | MUST | 外部业务 operation 有一个主要 Use Case | [规范正文](../java/use-case-convention.md#一个-operation-一个主要-use-case) |

## Business Rule

| Rule | Level | Meaning | Source |
|---|---|---|---|
| BR001 | MUST | BR ID 唯一 | [规范正文](../traceability/identity-system.md) |
| BR002 | MUST | 活跃 BR 有实现 | [规范正文](../traceability/identity-system.md) |
| BR003 | MUST | 活跃 BR 有测试 | [规范正文](../traceability/identity-system.md) |
| BR004 | MUST | BR 引用路径存在 | [规范正文](../automation/convention-checker.md) |

## HTTP

| Rule | Level | Meaning | Source |
|---|---|---|---|
| HTTP001 | SHOULD | operation 有标准 HTTP Test 路径 | [规范正文](../testing/http-api-testing.md) |
| HTTP002 | MUST | HTTP Test 中 UC/BR 引用有效 | [规范正文](../automation/convention-checker.md) |
| HTTP003 | MUST | Regression Test 引用的 INC 有效（采用 INC 时） | [规范正文](../automation/convention-checker.md) |
| HTTP004 | MUST | production-safe 不得标记 destructive | [规范正文](../testing/post-deployment-verification.md#生产环境) |

## Naming

| Rule | Level | Meaning | Source |
|---|---|---|---|
| NAME001 | SHOULD NOT | 禁止 `*ServiceImpl` | [规范正文](../java/class-naming.md) |
| NAME002 | SHOULD NOT | 禁止 `CommonService` | [规范正文](../java/class-naming.md) |
| NAME003 | SHOULD NOT | 禁止无语义 `*Utils` / `*Helper` | [规范正文](../java/class-naming.md) |

## 演进

Rule Code 是稳定导航锚点。改变旧编号语义属于 breaking change；SHOULD 升级 MUST 时应单独提交并说明迁移影响。
