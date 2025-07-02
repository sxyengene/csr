# CSR-Admin 项目概览

## 📋 项目简介

CSR-Admin 是一个基于 React + Ant Design 的企业级管理后台系统，主要用于管理用户、事件和活动。项目已完成 API 标准化改造，采用现代化的前端架构和最佳实践。

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
│   │   └── ActivityCreate/   # 活动创建
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

### 1. 🔐 认证模块 ✅ **已完成**

- ✅ **用户登录** - JWT Token 认证，自动跳转到后台
- ✅ **用户登出** - 安全退出，Token 失效处理
- ✅ **路由守卫** - 统一认证检查，自动跳转登录
- ✅ **Token 管理** - 自动刷新机制，过期处理
- ✅ **用户信息** - 从 JWT 解析用户信息显示

### 2. 👥 用户管理模块 🔄 **进行中**

- ✅ **用户列表** - 分页、搜索、排序、角色地区筛选 (已接入 API)
- ✅ **用户详情** - 查看用户信息和记录 (已接入 API)
- ✅ **用户编辑** - 更新用户信息 (已接入 API)
- ⚠️ **批量操作** - 批量删除用户 (暂用模拟)
- ✅ **密码重置** - 管理员重置密码 (已接入 API)
- ⚠️ **审核人设置** - 为用户分配审核人 (暂用模拟)

### 3. 📅 事件管理模块 🔄 **进行中**

- ✅ **事件列表** - 展示所有事件 (已接入 API)
- ✅ **事件创建** - 创建新事件 (已接入 API)
- ✅ **事件编辑** - 修改事件信息 (已接入完整 API)
- ✅ **展示控制** - 控制前台显示状态 (已接入 API)
- 📋 **活动管理** - 每个事件下的活动管理

### 4. 🎯 活动管理模块

- **活动创建** - 在事件下创建活动
- **活动编辑** - 修改活动信息
- **状态管理** - 报名状态控制
- **时间线展示** - 活动时间线视图

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

| 模块        | 接口数量  | 状态                        |
| ----------- | --------- | --------------------------- |
| 🔐 认证模块 | 3 个      | ✅ **已完成** (2/3)         |
| 👥 用户管理 | 8 个      | 🔄 **进行中** (7/8)         |
| 📅 事件管理 | 6 个      | 🔄 **进行中** (5/6)         |
| 🎯 活动管理 | 5 个      | 📋 待接入                   |
| **总计**    | **22 个** | **14 个已完成，8 个待接入** |

### 已接入接口

1. ✅ `POST /api/auth/login` - 用户登录
2. ✅ `POST /api/auth/logout` - 用户登出
3. ✅ `GET /api/users` - 用户列表 (新接入)
4. ✅ `GET /api/users/{id}` - 获取用户详情 (新接入)
5. ✅ `PUT /api/users/{id}` - 更新用户信息 (新接入)
6. ✅ `PUT /api/users/{id}/reset-password` - 重置用户密码 (新接入)
7. ✅ `GET /api/events` - 事件列表 (新接入)
8. ✅ `POST /api/events` - 创建事件 (新接入)
9. ✅ `GET /api/events/{id}` - 获取事件详情 (新接入)
10. ✅ `PUT /api/events/{id}` - 更新事件 (新接入)
11. ✅ `PUT /api/events/{id}/display` - 更新事件显示状态 (新接入)
12. ✅ `GET /api/users/{id}/events` - 获取用户事件记录 (新接入)
13. ✅ `GET /api/users/{id}/activities` - 获取用户活动记录 (新接入)
14. ✅ `DELETE /api/users/batch-delete` - 批量删除用户 (新接入)

### 待接入接口

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
- **[API_STANDARDIZATION_GUIDE.md](./API_STANDARDIZATION_GUIDE.md)** - API 标准化使用指南
- **[LOGIN_INTEGRATION.md](./LOGIN_INTEGRATION.md)** - 登录功能接入说明

### 工具文档

- **[DEEPWIKI_GUIDE.md](./DEEPWIKI_GUIDE.md)** - DeepWiki 文档生成指南

### 技术文档

- 所有核心文件都包含详细的 JSDoc 注释
- 配置文件有完整的说明和示例

## 🎯 下一步规划

### 短期目标（1-2 周）

1. **接入用户管理 API** - 完成用户 CRUD 操作
2. **接入事件管理 API** - 完成事件管理功能
3. **接入活动管理 API** - 完成活动管理功能

### 中期目标（1 个月）

1. **数据缓存优化** - 添加前端缓存机制
2. **状态管理集成** - 引入 Redux 或 Zustand
3. **UI/UX 优化** - 提升用户体验

### 长期目标（3 个月）

1. **性能监控** - API 调用统计和性能监控
2. **国际化支持** - 多语言支持
3. **移动端适配** - 响应式设计优化

## 🔧 开发指南

### 新增 API 接口

1. 在 `src/config/api.js` 中添加端点定义
2. 使用 `src/utils/request.js` 中的工具函数
3. 参考 `src/services/auth.js` 的实现模式

### 错误处理

```javascript
import { getData, handleApiError } from "../utils/request";
import { message } from "antd";

try {
  const result = await getData(get("/api/users"));
  // 处理成功响应
} catch (error) {
  message.error(handleApiError(error));
}
```

### 使用配置常量

```javascript
import { API_ENDPOINTS, buildUrl } from "../config/api";

const userUrl = buildUrl(API_ENDPOINTS.USERS.DETAIL, { id: 123 });
```

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
