# 架构设计说明

## 🤔 您的疑问很有道理！

您问得很好："为什么又有 request.js，auth.js 里的 config 又从 config.js 里面取？"

让我解释一下**正确的架构设计**和**避免循环依赖**的考虑。

## 📐 正确的分层架构

```
┌─────────────────┐
│   业务层        │  ← 其他业务services (user.js, event.js等)
│   (Services)    │
├─────────────────┤
│   工具层        │  ← request.js (通用HTTP工具)
│   (Utils)       │
├─────────────────┤
│   认证层        │  ← auth.js (认证服务)
│   (Auth)        │
├─────────────────┤
│   配置层        │  ← config/api.js (配置中心)
│   (Config)      │
└─────────────────┘
```

## 🔄 避免循环依赖的设计

### ❌ 错误的依赖关系（会造成循环依赖）

```
request.js ←→ auth.js  (互相依赖，造成循环)
```

### ✅ 正确的依赖关系

```
业务Services → request.js → auth.js → config.js
```

## 📂 各文件的职责说明

### 1. `src/config/api.js` - 配置中心

```javascript
// 职责：统一管理所有配置
export const API_CONFIG = { BASE_URL: "..." };
export const TOKEN_CONFIG = { ACCESS_TOKEN_KEY: "..." };
export const API_ENDPOINTS = { AUTH: { LOGIN: "..." } };
```

**为什么需要**：集中管理配置，方便环境切换和维护。

### 2. `src/services/auth.js` - 认证底层服务

```javascript
// 职责：处理认证相关的底层逻辑
// - 使用原生fetch + config
// - 不依赖request.js（避免循环依赖）
// - 提供token管理功能给上层使用

import { API_CONFIG, TOKEN_CONFIG } from "../config/api";

export const login = async () => {
  // 直接使用fetch，因为这是底层认证服务
  const response = await fetch(`${API_CONFIG.BASE_URL}...`);
  // ...
};
```

**为什么需要**：作为认证的底层实现，被 request.js 调用。

### 3. `src/utils/request.js` - 通用 HTTP 工具

```javascript
// 职责：封装统一的HTTP请求逻辑
// - 自动添加认证头
// - 统一错误处理
// - 标准响应格式处理
// - 重试机制

import { getToken, isTokenExpired, refreshToken } from "../services/auth";

export const get = () => {
  // 使用auth.js提供的token管理功能
  const token = getToken();
  // ...
};
```

**为什么需要**：为业务层提供统一的、功能丰富的 HTTP 请求工具。

### 4. `src/services/user.js` - 业务服务

```javascript
// 职责：具体的业务逻辑
// - 使用request.js工具
// - 专注于业务逻辑而不是HTTP细节

import { get, post, getData } from "../utils/request";

export const getUserList = async () => {
  // 使用封装好的工具，享受自动认证、错误处理等功能
  return getData(get("/api/users"));
};
```

**为什么需要**：业务逻辑与 HTTP 细节分离，代码更清晰。

## 💡 设计原则

### 1. **单一职责原则**

- `config.js` → 只管配置
- `auth.js` → 只管认证
- `request.js` → 只管 HTTP 请求
- `user.js` → 只管用户业务

### 2. **依赖倒置原则**

- 高层模块（业务）不依赖低层模块（HTTP 细节）
- 都依赖抽象（统一的 request 接口）

### 3. **避免循环依赖**

```
✅ 正确：业务 → request → auth → config
❌ 错误：request ←→ auth (循环依赖)
```

## 🤖 实际使用示例

### 在业务代码中使用（推荐方式）

```javascript
// src/services/user.js
import { get, post, getData, handleApiError } from "../utils/request";

export const getUserList = async (params) => {
  try {
    // 享受自动认证、错误处理、重试等功能
    const users = await getData(get("/api/users", params));
    return users;
  } catch (error) {
    throw new Error(handleApiError(error));
  }
};
```

### 为什么不直接在业务代码中使用 fetch？

```javascript
// ❌ 不推荐：每个业务都要重复写认证、错误处理
export const getUserList = async () => {
  const token = localStorage.getItem("token");
  const response = await fetch("/api/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  // 还要处理token过期、网络错误、重试等...
};
```

## 🎯 这样设计的好处

1. **避免循环依赖** - 清晰的分层，没有循环引用
2. **职责明确** - 每个文件都有明确的单一职责
3. **易于维护** - 修改 HTTP 逻辑只需要改 request.js
4. **易于测试** - 每层都可以独立测试
5. **代码复用** - 所有业务都可以复用 request.js 的功能

## 📋 总结

- `config.js` - 配置中心，被所有层使用 ✅
- `auth.js` - 认证底层，使用 config，被 request 使用 ✅
- `request.js` - HTTP 工具，使用 auth，被业务使用 ✅
- 业务 services - 使用 request，专注业务逻辑 ✅

这样的架构清晰、无循环依赖，且每层职责明确！
