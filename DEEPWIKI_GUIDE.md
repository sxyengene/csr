# DeepWiki 使用指南

## 🎯 目标

使用 DeepWiki 自动分析 CSR-Admin 项目，生成美观的 API 文档网站，并提供给团队伙伴查看。

## ✅ 配置确认

### 1. MCP 配置 (已完成)

`.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "deepwiki-sse": {
      "url": "https://mcp.deepwiki.com/sse"
    }
  }
}
```

### 2. 项目配置 (已完成)

`deepwiki.config.json`: 包含项目的文档生成配置

### 3. 文档文件 (已完成)

`API_DOCS.md`: 完整的 21 个 API 接口文档

## 🚀 使用步骤

### 第一步：生成 API 使用报告

```bash
npm run docs:generate
```

这个命令会：

- 扫描项目代码中的 API 调用
- 生成 API 使用情况报告
- 更新文档时间戳

### 第二步：在 Cursor 中使用 DeepWiki

在 Cursor 聊天框中使用以下命令：

#### 分析项目文档

```
@deepwiki 分析项目文档结构
```

#### 生成 Web 文档

```
@deepwiki generate --config deepwiki.config.json
```

#### 创建分享链接

```
@deepwiki publish --domain csr-admin-docs --private
```

## 📖 DeepWiki 命令参考

### 基础命令

- `@deepwiki help` - 显示帮助信息
- `@deepwiki status` - 查看当前项目状态
- `@deepwiki analyze` - 分析项目文档

### 生成命令

- `@deepwiki generate` - 生成基础文档
- `@deepwiki generate --web` - 生成 Web 版本
- `@deepwiki generate --api` - 专门生成 API 文档

### 发布命令

- `@deepwiki publish` - 发布到公共空间
- `@deepwiki publish --private` - 发布到私有空间
- `@deepwiki publish --team` - 发布到团队空间

## 🎨 预期效果

使用 DeepWiki 后，您将获得：

1. **美观的 Web 文档**:

   - 自动生成的导航菜单
   - 响应式设计，支持手机浏览
   - 代码高亮和交互式示例

2. **分享链接**:

   - 类似 `https://docs.deepwiki.com/csr-admin-docs`
   - 可以直接分享给团队成员
   - 支持权限控制

3. **自动更新**:
   - 代码变更时自动检测
   - 文档版本管理
   - 变更历史记录

## 🔄 自动化流程

### 开发时使用

```bash
# 每次修改代码后运行
npm run docs:dev
```

### 发布前使用

```bash
# 生成最新文档
npm run docs:generate

# 在Cursor中发布
@deepwiki publish --domain csr-admin-docs
```

## 👥 团队协作

### 邀请团队成员

```
@deepwiki invite --email colleague@company.com --role viewer
```

### 设置审核流程

```
@deepwiki config --reviewers "孙雄鹰,张如诚,xu jin"
```

### 创建团队空间

```
@deepwiki workspace create --name "CSR团队文档"
```

## 🛠️ 高级功能

### 1. API 测试集成

DeepWiki 可以根据 API 文档生成测试工具：

```
@deepwiki generate --with-tests
```

### 2. OpenAPI 规范生成

自动将文档转换为 OpenAPI 格式：

```
@deepwiki export --format openapi
```

### 3. 多语言支持

如果需要英文版本：

```
@deepwiki translate --to en
```

## 📊 监控和分析

### 查看文档访问统计

```
@deepwiki analytics --domain csr-admin-docs
```

### 检查文档完整性

```
@deepwiki validate --check-links --check-examples
```

## ❓ 常见问题

### Q: 文档更新后网站没有刷新？

A: 运行 `@deepwiki refresh --domain csr-admin-docs`

### Q: 如何自定义文档样式？

A: 在 `deepwiki.config.json` 中添加 `theme` 配置

### Q: 可以设置访问密码吗？

A: 使用 `@deepwiki config --password your_password`

### Q: 如何备份文档？

A: 运行 `@deepwiki export --format markdown --output backup/`

## 🎉 预期结果

完成配置后，您的团队将拥有：

- 📱 **移动友好的文档网站**
- 🔗 **可分享的链接** (如: docs.deepwiki.com/csr-admin-docs)
- 🔄 **自动同步更新**
- 👥 **团队协作功能**
- 📊 **使用统计分析**

---

> 💡 **提示**: 如果遇到问题，可以在 Cursor 中输入 `@deepwiki support` 获取帮助，或查看 DeepWiki 官方文档。
