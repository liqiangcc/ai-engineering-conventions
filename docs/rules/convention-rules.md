# Convention Rule Catalog

## Operation

| Rule | Level | Meaning |
|---|---|---|
| OP001 | MUST | operationId 唯一 |
| OP002 | SHOULD | operationId 使用 verbNoun |
| OP003 | SHOULD | HTTP 资源可映射到业务模块 |

## Use Case

| Rule | Level | Meaning |
|---|---|---|
| UC001 | MUST | UC ID 唯一 |
| UC002 | SHOULD | 重要 operation 有主要 Use Case |
| UC003 | SHOULD | operation 与 Use Case 共享业务动作语义 |

## Business Rule

| Rule | Level | Meaning |
|---|---|---|
| BR001 | MUST | BR ID 唯一 |
| BR002 | MUST | 活跃 BR 有实现 |
| BR003 | MUST | 活跃 BR 有测试 |
| BR004 | MUST | BR 引用路径存在 |

## HTTP

| Rule | Level | Meaning |
|---|---|---|
| HTTP001 | SHOULD | operation 有标准 HTTP Test 路径 |
| HTTP002 | MUST | HTTP Test 中 UC/BR 引用有效 |
| HTTP003 | MUST | Regression Test 引用的 INC 有效（采用 INC 时） |
| HTTP004 | MUST | production-safe 不得标记 destructive |

## Naming

| Rule | Level | Meaning |
|---|---|---|
| NAME001 | SHOULD NOT | 禁止 `*ServiceImpl` |
| NAME002 | SHOULD NOT | 禁止 `CommonService` |
| NAME003 | SHOULD NOT | 禁止无语义 `*Utils` / `*Helper` |

## 演进

Rule Code 是稳定导航锚点。改变旧编号语义属于 breaking change；SHOULD 升级 MUST 时应单独提交并说明迁移影响。
