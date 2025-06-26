# CSR-Admin 管理后台

> 基于 React + Ant Design 的企业级管理后台系统

## 🚀 项目简介

CSR-Admin 是一个现代化的管理后台系统，支持用户管理、事件管理和活动管理。采用前后端分离架构，提供完整的 RBAC 权限控制和标准化的 API 接口。

## ✨ 主要功能

- 🔐 **认证系统** - JWT 登录认证，自动 token 刷新
- 👥 **用户管理** - 用户 CRUD、角色分配、审核人设置
- 📅 **事件管理** - 事件发布、编辑、展示控制
- 🎯 **活动管理** - 活动创建、状态管理、时间线展示
- 📊 **数据可视化** - 活动时间线、事件展示

## 🛠️ 技术栈

- **前端框架**: React 18
- **UI 组件库**: Ant Design
- **状态管理**: React Hooks
- **HTTP 客户端**: Axios + 拦截器
- **样式方案**: SCSS Modules
- **构建工具**: Create React App
- **包管理器**: pnpm

## 📦 快速开始

### 环境要求

- Node.js >= 16
- pnpm >= 7

### 安装依赖

```bash
pnpm install
```

### 启动开发服务器

```bash
pnpm start
```

访问 [http://localhost:3000](http://localhost:3000)

### 构建生产版本

```bash
pnpm build
```

## 🔧 配置说明

### API 配置

项目配置文件位于 `src/config/api.js`：

```javascript
export const API_CONFIG = {
  BASE_URL: "http://8.133.240.77:8080/api",
  TIMEOUT: 10000,
};
```

### 环境变量

可在 `.env` 文件中覆盖配置：

```bash
REACT_APP_API_BASE_URL=http://your-api-server.com/api
REACT_APP_API_TIMEOUT=10000
```

## 📁 项目结构

```
src/
├── components/          # 通用组件
│   ├── ActivityTimeline/ # 活动时间线
│   └── EventTimeline/   # 事件时间线
├── config/             # 配置文件
│   └── api.js         # API 配置
├── hooks/             # 自定义 Hooks
├── layouts/           # 布局组件
├── pages/             # 页面组件
│   ├── Login/         # 登录页
│   ├── Users/         # 用户管理
│   ├── EventList/     # 事件列表
│   ├── EventCreate/   # 事件创建
│   └── ActivityCreate/ # 活动创建
├── services/          # API 服务
│   ├── auth.js       # 认证服务
│   └── user.js       # 用户服务
└── utils/             # 工具函数
    └── request.js     # HTTP 请求工具
```

## 🔐 认证机制

系统采用 JWT Bearer Token 认证：

- 自动 token 添加到请求头
- token 过期自动刷新
- 认证失败自动跳转登录
- 支持登出清除本地 token

## 📖 开发指南

### API 调用示例

```javascript
import { get, post } from "@/utils/request";

// GET 请求
const users = await get("/users", { page: 1, size: 10 });

// POST 请求
const result = await post("/users", {
  username: "admin",
  email: "admin@example.com",
});
```

### 错误处理

系统提供统一的错误处理机制：

```javascript
import { handleApiError } from "@/utils/request";

try {
  const data = await api.getUsers();
} catch (error) {
  const errorMessage = handleApiError(error);
  message.error(errorMessage);
}
```

## 📚 相关文档

- [API 接口文档](./API_DOCS.md) - 完整的后端 API 接口说明
- [项目概览](./PROJECT_OVERVIEW.md) - 详细的项目架构和设计说明
- [开发指南](./docs/) - 开发相关的详细文档

## 🤝 贡献指南

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

如有问题，请创建 [Issue](../../issues) 或联系项目维护者。

---

⭐ 如果这个项目对您有帮助，请给个 star 支持一下！
