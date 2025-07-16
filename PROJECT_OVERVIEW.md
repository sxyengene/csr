# CSR-Admin 项目概览

## 📋 项目简介

CSR-Admin 是一个基于 React + Ant Design 的企业级管理后台系统，主要用于管理用户、事件、活动和活动明细数据。项目已完成 API 标准化改造，采用现代化的前端架构和最佳实践。

## 🏗️ 技术架构

### 前端技术栈

- **React 18** - 现代化的用户界面库
- **Ant Design 5** - 企业级 UI 组件库
- **React Router 6** - 单页应用路由管理
- **Sass** - CSS 预处理器
- **Day.js** - 轻量级日期处理库

### 后端集成

- **服务器**: `http://8.133.240.77:8080`
- **认证**: JWT Bearer Token
- **协议**: RESTful API
- **格式**: JSON

## 📁 项目结构

```
csr-admin/
├── .cursor/                    # Cursor IDE配置
│   └── mcp.json               # MCP服务配置
├── src/
│   ├── config/                # 配置文件
│   │   └── api.js            # API标准化配置 ✨
│   ├── utils/                 # 工具函数
│   │   └── request.js        # 统一请求工具 ✨
│   ├── services/              # 业务服务
│   │   ├── auth.js           # 认证服务 ✨
│   │   └── user.js           # 用户服务
│   ├── pages/                 # 页面组件
│   │   ├── Login/            # 登录页面 ✨
│   │   ├── Users/            # 用户管理
│   │   ├── EventList/        # 事件列表
│   │   ├── EventCreate/      # 事件创建
│   │   ├── ActivityCreate/   # 活动创建
│   │   └── ActivityDetails/  # 活动明细 ✨
│   ├── components/            # 通用组件
│   │   ├── EventTimeline/    # 事件时间线
│   │   └── ActivityTimeline/ # 活动时间线
│   └── layouts/               # 布局组件
├── scripts/                   # 工具脚本
│   ├── generate-docs.js      # 文档生成 ✨
│   └── test-api.js           # API测试 ✨
├── API_DOCS.md               # API接口文档 ✨
├── API_STANDARDIZATION_GUIDE.md # API标准化指南 ✨
├── LOGIN_INTEGRATION.md      # 登录集成说明 ✨
├── DEEPWIKI_GUIDE.md         # DeepWiki使用指南 ✨
└── package.json              # 项目依赖配置
```

> ✨ 标记的文件是本次 API 标准化改造中新增或重构的文件

## 🎯 核心功能模块

### 1. 🔐 认证模块 🔄 **进行中**

- ✅ **用户登录** - JWT Token 认证，自动跳转到后台
- ✅ **用户登出** - 安全退出，Token 失效处理
- ✅ **路由守卫** - 统一认证检查，自动跳转登录
- ⏳ **Token 刷新** - 自动刷新机制 (前端实现，待接入后端 API)
- ⏳ **Token 验证** - Token 有效性验证 (待接入 API)
- ✅ **用户信息** - 从 JWT 解析用户信息显示

### 2. 👥 用户管理模块 ✅ **已完成**

- ✅ **用户列表** - 分页、搜索、排序、角色地区筛选 (已接入 API)
- ✅ **用户详情** - 查看用户信息和记录 (已接入 API)
- ✅ **用户编辑** - 更新用户信息 (已接入 API)
- ✅ **批量操作** - 批量删除用户 (已接入 API)
- ✅ **密码重置** - 管理员重置密码 (已接入 API)
- ✅ **审核人设置** - 为用户分配审核人 (已接入 API，使用用户列表接口搜索)

### 3. 📅 事件管理模块 🔄 **进行中**

- ✅ **事件列表** - 展示所有事件，支持搜索和统计数据 (已接入 API)
- ✅ **事件创建** - 创建新事件，使用时间选择器 (已接入 API)
- ✅ **事件编辑** - 修改事件信息，支持时间范围编辑 (已接入 API)
- ✅ **展示控制** - 控制前台显示状态 (已接入 API)
- ⏳ **事件删除** - 删除事件功能 (待接入 API)
- 📋 **活动管理** - 每个事件下的活动管理

### 4. 🎯 活动管理模块

- **活动创建** - 在事件下创建活动
- **活动编辑** - 修改活动信息
- **状态管理** - 报名状态控制
- **时间线展示** - 活动时间线视图

### 5. 📊 活动明细模块 ✅ **已完成**

- ✅ **明细列表** - 显示用户活动参与详情表格
- ✅ **多维筛选** - 支持用户名、事件名、活动名筛选
- ✅ **金额排序** - 按捐献金额升序/降序排列
- ✅ **分页展示** - 大数据量分页处理
- ✅ **响应式设计** - 适配桌面和移动端
- ✅ **数据导航** - 清晰的序号和数据展示
- ✅ **事件统计** - 新增事件统计表格，展示事件和活动的参与人次、总时间统计
- ✅ **双表格展示** - 使用 Tabs 组件分别展示活动明细和事件统计

## 🚀 API 标准化特性

### 统一规范

- ✅ **Bearer Token 认证** - JWT 自动管理
- ✅ **JSON 格式** - 统一数据交换格式
- ✅ **标准响应** - `{code, message, data}` 格式
- ✅ **错误处理** - 友好的错误提示

### 自动化功能

- ✅ **Token 自动刷新** - 无感知续期
- ✅ **请求重试** - 网络异常自动重试
- ✅ **错误映射** - 状态码自动转换
- ✅ **认证拦截** - 401 自动跳转登录

### 开发体验

- ✅ **类型安全** - 标准化响应对象
- ✅ **配置管理** - 集中的 API 配置
- ✅ **工具函数** - 丰富的便捷方法
- ✅ **调试友好** - 完善的错误信息

## 📊 API 接口清单

| 模块        | 接口数量  | 状态                                 |
| ----------- | --------- | ------------------------------------ |
| 🔐 认证模块 | 4 个      | 🔄 **进行中** (2/4)                  |
| 👥 用户管理 | 8 个      | ✅ **已完成** (8/8)                  |
| 📅 事件管理 | 6 个      | 🔄 **进行中** (5/6)                  |
| 🎯 活动管理 | 5 个      | 📋 待接入                            |
| 📊 活动明细 | 1 个      | 🔄 **进行中** (前端完成，待接入 API) |
| **总计**    | **24 个** | **15 个已完成，9 个待接入**          |

### 已接入接口

1. ✅ `POST /api/auth/login` - 用户登录
2. ✅ `POST /api/auth/logout` - 用户登出
3. ✅ `GET /api/users` - 用户列表 (支持搜索功能)
4. ✅ `GET /api/users/{id}` - 获取用户详情
5. ✅ `PUT /api/users/{id}` - 更新用户信息
6. ✅ `PUT /api/users/{id}/reset-password` - 重置用户密码
7. ✅ `GET /api/events` - 事件列表
8. ✅ `POST /api/events` - 创建事件
9. ✅ `GET /api/events/{id}` - 获取事件详情
10. ✅ `PUT /api/events/{id}` - 更新事件
11. ✅ `PUT /api/events/{id}/display` - 更新事件显示状态
12. ✅ `GET /api/users/{id}/events` - 获取用户事件记录
13. ✅ `GET /api/users/{id}/activities` - 获取用户活动记录
14. ✅ `DELETE /api/users/batch-delete` - 批量删除用户
15. ✅ `PUT /api/users/{id}/reviewer` - 设置用户审核人

### 待接入接口

1. ⏳ `POST /api/auth/refresh` - 刷新 Token
2. ⏳ `POST /api/auth/validate` - 验证 Token
3. ⏳ `DELETE /api/events/{id}` - 删除事件
4. ⏳ `GET /api/activities` - 活动列表
5. ⏳ `GET /api/activities/{id}` - 获取活动详情
6. ⏳ `POST /api/activities` - 创建活动
7. ⏳ `PUT /api/activities/{id}` - 更新活动
8. ⏳ `DELETE /api/activities/{id}` - 删除活动
9. ⏳ `GET /api/activity-details` - 活动明细列表 (支持筛选和排序)

详细的 API 列表请查看 [API_DOCS.md](./API_DOCS.md)

## 🧪 测试和验证

### 快速测试

```bash
# 安装依赖
npm install

# 测试API连接
npm run test:api

# 启动开发服务器
npm start

# 访问登录页面
# http://localhost:3000/login
```

### 测试账号

- 用户名：`john_doe` 密码：`password123`
- 用户名：`admin` 密码：`admin123`

## 📖 文档资源

### 开发文档

- **[API_DOCS.md](./API_DOCS.md)** - 完整的 21 个 API 接口文档
- **[API_CONFIG_GUIDE.md](./API_CONFIG_GUIDE.md)** - API 配置统一管理指南 ✨
- **[API_STANDARDIZATION_GUIDE.md](./API_STANDARDIZATION_GUIDE.md)** - API 标准化使用指南
- **[LOGIN_INTEGRATION.md](./LOGIN_INTEGRATION.md)** - 登录功能接入说明

### 工具文档

- **[DEEPWIKI_GUIDE.md](./DEEPWIKI_GUIDE.md)** - DeepWiki 文档生成指南

### 技术文档

- 所有核心文件都包含详细的 JSDoc 注释
- 配置文件有完整的说明和示例

## 🎯 下一步规划

### 短期目标（1-2 周）

1. **完善事件管理 API** - 添加事件删除功能
2. **接入活动管理 API** - 完成活动管理功能
3. **接入活动明细 API** - 将活动明细从模拟数据改为真实 API

### 中期目标（1 个月）

1. **数据缓存优化** - 添加前端缓存机制
2. **状态管理集成** - 引入 Redux 或 Zustand
3. **UI/UX 优化** - 提升用户体验
4. **功能完善** - 事件时间字段优化（已从时长改为开始/结束时间）

### 长期目标（3 个月）

1. **性能监控** - API 调用统计和性能监控
2. **国际化支持** - 多语言支持
3. **移动端适配** - 响应式设计优化

## 🔧 开发指南

### API 统一配置架构

**配置中心化**: 项目已实现完全统一的 API 配置管理

```javascript
// src/config/api.js - 统一配置中心
export const API_CONFIG = {
  BASE_URL:
    process.env.NODE_ENV === "development" ? "http://8.133.240.77:8080" : "/",
  // ... 其他配置
};

// 所有服务都通过统一工具发送请求
import { get, post, put, del } from "../utils/request";
```

**请求流程**：

1. 所有 service 文件使用 `utils/request.js` 工具
2. 请求工具使用 `config/api.js` 中的 `BASE_URL`
3. 自动添加认证头、错误处理、重试机制

### 新增 API 接口

1. **添加端点定义**：

```javascript
// src/config/api.js
export const API_ENDPOINTS = {
  NEW_MODULE: {
    LIST: "/api/new-module",
    DETAIL: "/api/new-module/{id}",
  },
};
```

2. **创建服务函数**：

```javascript
// src/services/newModule.js
import { get, post } from "../utils/request";
import { API_ENDPOINTS, buildUrl } from "../config/api";

export const getNewModuleList = async (params) => {
  return get(API_ENDPOINTS.NEW_MODULE.LIST, params);
};
```

3. **页面中使用**：

```javascript
import { getData, showApiError } from "../utils/request";
import { getNewModuleList } from "../services/newModule";

try {
  const data = await getData(getNewModuleList({ page: 1 }));
} catch (error) {
  showApiError(error);
}
```

### 错误处理

**统一错误处理**：

```javascript
import { getData, showApiError } from "../utils/request";

try {
  const result = await getData(get("/api/users"));
  // 处理成功响应
} catch (error) {
  // 自动显示友好的错误信息
  showApiError(error, "获取用户列表失败");
}
```

### 使用配置常量

**动态 URL 构建**：

```javascript
import { API_ENDPOINTS, buildUrl } from "../config/api";

// 构建带参数的URL
const userUrl = buildUrl(API_ENDPOINTS.USERS.DETAIL, { id: 123 });
// 结果: "/api/users/123"
```

### 配置修改指南

**修改服务器地址**：

- 开发环境：修改 `src/config/api.js` 中的开发环境地址
- 生产环境：无需修改，使用相对路径 `/`
- 所有接口自动使用新地址，无需逐个修改

## 📞 技术支持

### 问题排查

1. **网络问题** - 运行 `npm run test:api` 检查连接
2. **登录问题** - 确认使用正确的测试账号
3. **API 问题** - 查看浏览器 Network 面板

### 开发团队

- **前端架构** - CSR 开发团队
- **API 设计** - 参考 API_DOCS.md 文档
- **文档维护** - 使用 DeepWiki 自动更新

---

> 🎉 **项目优势**: 通过标准化改造，CSR-Admin 现在具备了企业级的 API 架构，可以高效、可靠地支持业务发展。所有后续的 API 接入都可以快速完成，享受统一的认证、错误处理和重试机制！
