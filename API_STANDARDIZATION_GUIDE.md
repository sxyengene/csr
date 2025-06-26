# API 标准化改造完成指南

## 🎉 完成状态

✅ **API 标准化改造已完成！**

系统已按照您提供的基本规则完成了全面的 API 标准化改造。

## 📋 实现的标准规则

### 1. 认证方式

- **Bearer Token (JWT)** - 自动添加到所有请求头
- 格式：`Authorization: Bearer {accessToken}`

### 2. 内容类型

- **application/json** - 默认请求和响应格式

### 3. 标准响应格式

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    // 响应数据
  }
}
```

### 4. 错误响应格式

```json
{
  "code": 400,
  "message": "Error message",
  "data": null
}
```

## 🛠️ 新增的核心文件

### 1. `src/config/api.js` - API 配置中心

- 🔧 统一的 API 配置（服务器地址、超时时间等）
- 📝 标准响应码定义
- 🔑 Token 管理配置
- 📍 API 端点常量
- 🔄 重试机制配置

### 2. `src/utils/request.js` - 标准化请求工具（重构）

- 🚀 自动认证头添加
- 🔄 Token 过期自动刷新
- ⚡ 智能重试机制
- 📊 标准响应处理
- 🛡️ 统一错误处理

### 3. `src/services/auth.js` - 认证服务（更新）

- 🔐 使用配置化的 Token 管理
- 📍 使用标准化的 API 端点
- 🔄 支持自动 Token 刷新

## 📖 使用示例

### 基础用法

```javascript
import { get, post, put, del, getData, handleApiError } from "../utils/request";

// 方式一：完整响应对象
try {
  const response = await get("/api/users", { page: 1, pageSize: 10 });
  if (response.isSuccess()) {
    const users = response.getData();
    console.log("用户列表:", users);
  }
} catch (error) {
  message.error(handleApiError(error));
}

// 方式二：便捷数据获取（推荐）
try {
  const users = await getData(get("/api/users", { page: 1, pageSize: 10 }));
  console.log("用户列表:", users);
} catch (error) {
  message.error(handleApiError(error));
}
```

### 使用预定义端点

```javascript
import { API_ENDPOINTS, buildUrl } from "../config/api";

// 获取用户详情
const userUrl = buildUrl(API_ENDPOINTS.USERS.DETAIL, { id: 123 });
const user = await getData(get(userUrl));

// 创建用户
const newUser = await getData(
  post(API_ENDPOINTS.USERS.CREATE, {
    username: "newuser",
    role: "user",
    location: "上海",
  })
);

// 更新用户
const updateUrl = buildUrl(API_ENDPOINTS.USERS.UPDATE, { id: 123 });
await put(updateUrl, { username: "updatedname" });
```

## 🔄 自动化功能

### Token 管理

- ✅ 自动添加认证头
- ✅ 自动检测过期
- ✅ 自动刷新 Token
- ✅ 失败自动跳转登录

### 错误处理

- ✅ 标准化错误格式
- ✅ 友好错误提示
- ✅ 自动 401 处理

### 重试机制

- ✅ 网络错误自动重试
- ✅ 5xx 错误自动重试
- ✅ 指数退避延迟

## 📊 配置常量

```javascript
import {
  API_CONFIG, // 基础配置
  RESPONSE_CODES, // 响应码
  TOKEN_CONFIG, // Token配置
  API_ENDPOINTS, // API端点
} from "../config/api";

// 使用配置
console.log(API_CONFIG.BASE_URL); // 服务器地址
console.log(RESPONSE_CODES.SUCCESS); // 200
console.log(TOKEN_CONFIG.ACCESS_TOKEN_KEY); // "accessToken"
console.log(API_ENDPOINTS.AUTH.LOGIN); // "/api/auth/login"
```

## ⚡ 核心特性

### 1. 标准化响应处理

- `ApiResponse`类提供统一的响应对象
- `isSuccess()`、`getData()`、`getErrorMessage()`方法
- 自动解析标准格式

### 2. 智能错误处理

- 自动映射错误码到友好消息
- 统一的`handleApiError()`函数
- 支持自定义错误处理

### 3. 配置化管理

- 集中的配置管理
- 易于环境切换
- 可扩展的端点管理

### 4. 开发体验优化

- TypeScript 友好
- 简洁的 API 调用
- 丰富的工具函数

## 🔧 迁移指南

### 旧代码：

```javascript
fetch("/api/users", {
  method: "GET",
  headers: {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  },
})
  .then((res) => res.json())
  .then((data) => {
    if (data.code === 200) {
      // 处理数据
    }
  });
```

### 新代码：

```javascript
try {
  const users = await getData(get("/api/users"));
  // 直接处理数据
} catch (error) {
  message.error(handleApiError(error));
}
```

## 🧪 测试验证

### 运行 API 测试

```bash
# 测试API连接和登录功能
npm run test:api

# 启动开发服务器
npm start
```

### 测试账号

根据 API 文档，可以使用：

- 用户名：`john_doe` 密码：`password123`
- 用户名：`admin` 密码：`admin123`

## 📈 性能提升

- 🚀 **请求速度** - 优化的网络请求处理
- 🔄 **重试机制** - 自动处理临时网络问题
- ⏱️ **超时控制** - 防止请求卡死
- 💾 **Token 缓存** - 减少重复认证

## 🎯 下一步建议

1. **接入其他 API 模块** - 用户管理、事件管理、活动管理
2. **添加数据缓存** - 提升用户体验
3. **集成状态管理** - Redux/Zustand 等
4. **添加监控** - API 调用统计和错误监控

---

> 🎉 **恭喜！** 您的系统现在拥有了企业级的 API 标准化架构，可以高效、可靠地处理所有后端交互。所有 API 调用都将自动享受认证、错误处理、重试等功能！
