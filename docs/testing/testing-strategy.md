# 测试策略

## 目标

测试不是为了证明“代码能运行”，而是为了给业务正确性、流程正确性、技术契约和架构边界提供可重复的证据。

AI 编码必须区分：

- **实现依据**：BC 的验收条件、BR 的业务规则、公开 API / Port 契约。
- **实现代码**：系统当前如何执行。
- **验证证据**：测试、静态检查、构建和可复现实验。

测试不得仅从当前实现反推预期行为，避免 AI 同时写错实现和测试却得到全绿结果。

## 验证金字塔

```text
业务变更 / Acceptance Criteria
          ↓
Business Rule Tests
          ↓
Use Case Tests
          ↓
Contract / Adapter Tests
          ↓
Architecture Tests
          ↓
关键 Integration / E2E Tests
          ↓
Repository Regression
```

每一层只回答一种主要问题。

### Business Rule Tests

回答：业务决策本身是否正确。

要求：

- 优先纯 Java 测试，不启动 Spring。
- 不访问数据库、网络、Redis、MQ。
- 重要规则使用决策表或等价的场景矩阵。
- 测试名称包含业务语义；重要规则应可通过 BR ID 定位。

### Use Case Tests

回答：流程控制是否正确使用业务规则和外部能力。

重点验证：

- 读取和写入顺序；
- 正常路径和失败分支；
- 是否调用正确 Rule / Policy；
- 是否产生正确状态变化、事件和外部调用；
- 幂等、事务边界和补偿行为（存在时）。

优先使用 Fake / Stub Port，不依赖真实基础设施。

### Contract / Adapter Tests

回答：技术实现是否满足核心契约。

例如：

- `JpaOrderRepositoryAdapter` 是否满足 `OrderRepository` 契约；
- 外部 HTTP 错误是否映射为约定的应用错误；
- MQ 序列化是否保持事件语义；
- 多个 Adapter 是否遵守同一 Port 的公共契约。

### Architecture Tests

回答：代码虽然功能正确，但是否破坏关注点分离。

至少验证：

- domain 不依赖 Spring、JPA、HTTP 等技术框架；
- application 不依赖具体 Adapter；
- Controller 不越过 Use Case 直接访问持久化实现；
- 跨业务模块只能依赖公开 API；
- 禁止约定之外的深层跨模块引用。

Java 项目优先使用 ArchUnit 或等价静态检查。

### Integration / E2E Tests

回答：关键边界组合后是否仍然工作。

只覆盖关键业务链和高风险集成，不用 E2E 替代 BR / UC 测试。

E2E 失败时，应尽量能回落到更小层级定位原因。

## 测试职责分离

同一行为可能需要多层证据，但每层不要重复验证全部细节。

例如取消订单：

```text
BR-ORDER-003
→ OrderCancellationPolicyTest
→ 验证“什么订单允许取消”

UC-ORDER-004
→ CancelOrderUseCaseTest
→ 验证“加载 → 判断 → 保存 → 发布事件”

JpaOrderRepositoryAdapterTest
→ 验证领域 Order 与持久化模型的映射及保存契约

CancelOrderE2ETest
→ 验证 HTTP 入口到持久化的关键主链可运行
```

## 正确性来源优先级

发生冲突时，不能因为现有测试为绿就默认实现正确。需要回到业务依据确认。

推荐优先级：

```text
明确的当前 Business Rule / Acceptance Criteria
    > 已批准的公开契约
    > 测试
    > 当前实现
```

历史 BC 用于解释“为什么变成现在这样”，不是替代当前规则。

## AI 测试原则

1. 修改前先确定受影响的 UC、BR 和验收条件。
2. Bug 修复优先先增加能复现问题的失败测试。
3. 从最小相关测试开始，逐层扩大验证范围。
4. 测试失败必须先分类：Rule、Use Case、Adapter、Architecture、Environment。
5. 不允许通过删除测试、放宽断言或 Mock 掉待验证行为来让 CI 变绿。
6. 无法执行的验证必须显式列入 `Not Verified`。
7. “阅读代码认为正确”不能写成“已验证通过”。
8. 测试代码与生产代码同样遵守命名、关注点分离和可导航约定。

## 最小完成标准

一次业务语义变更至少应有：

```text
对应 BR / UC 的测试证据
+ 受影响模块测试通过
+ 架构检查通过
+ 明确的未验证项（如有）
```

是否需要 Adapter、Integration、E2E 或全仓回归，由变更影响范围决定，而不是固定把所有测试都跑一遍。