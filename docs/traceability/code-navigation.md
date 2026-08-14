# 代码导航与自动索引规范

## 目标

代码库 SHOULD 让开发者和 AI 优先“按约定推导”，而不是每次从零探索。

推荐导航链：

```text
URL / MQ / MCP / CLI / Job
        ↓
Operation
        ↓
Use Case ID + Use Case Class
        ↓
Business Rule ID + Rule Class
        ↓
Port / Adapter
        ↓
Tests
        ↓
Business Change / Git History
        ↓
Incident
```

## 三级导航

### 一级：项目导航

项目根目录 SHOULD 有 `AGENTS.md` 或等价入口，只保留稳定信息：

```text
模块地图在哪里
代码组织规则在哪里
业务规则在哪里
测试命令是什么
AI 修改前应该先做什么
```

不要在根导航文件复制大量易过期实现细节。

### 二级：模块导航

复杂业务模块 SHOULD 有模块 README，至少说明：

```text
职责
非职责
公共入口
主要 Use Case
主要 Business Rule
外部 Port
测试入口
```

### 三级：稳定标识与语义搜索

进入模块后优先搜索：

```text
operationId
UC ID
BR ID
业务动作前缀
```

例如：

```text
cancelOrder
UC-ORDER-004
BR-ORDER-003
CancelOrder
```

## 自动生成入口地图

机器可推导的信息 SHOULD 自动生成，例如：

```text
docs/generated/entrypoint-map.yaml
```

示例：

```yaml
entrypoints:
  - type: http
    method: POST
    path: /api/v1/orders/{orderId}/cancel
    operationId: cancelOrder
    module: order
    useCase:
      id: UC-ORDER-004
      class: CancelOrderUseCase
    rules:
      - id: BR-ORDER-003
        class: OrderCancellationPolicy
    tests:
      - CancelOrderUseCaseTest
```

该文件 SHOULD 由代码、OpenAPI、注解和测试扫描生成，不应手工维护重复事实。

## 规则索引

规则目录可以包含当前业务语义，但以下信息如果可从代码推导，SHOULD 自动生成或验证：

```text
实现类路径
Use Case 引用关系
测试类路径
operationId 映射
```

## 导航失败视为设计信号

当一个常见业务问题无法通过以下任一方式快速定位时，应考虑改进结构：

```text
按 URL/Operation 推导
按业务动作名称搜索
按 UC/BR 搜索
沿 Use Case 依赖跳转
```

典型坏信号：

```text
OrderService.process()
CommonManager.handle()
BusinessUtils.check()
```

这些名称迫使读者重新发现真实语义。

## AI 导航顺序

AI 接到 Bug 或变更请求时 SHOULD：

1. 识别入口与业务模块；
2. 找 operationId；
3. 找 UC；
4. 找相关 BR；
5. 阅读规则测试；
6. 再阅读 Port / Adapter；
7. 最后根据需要查看 BC、PR 与 Git 历史。

不要默认先扫描整个仓库。

## 导航命中率

本规范希望达到：

> 看到一个规范化入口后，对模块、Use Case、测试和主要规则的路径猜测具有高命中率。

如果长期需要大量例外规则，说明约定过度复杂或项目结构不一致，应优先简化约定。
