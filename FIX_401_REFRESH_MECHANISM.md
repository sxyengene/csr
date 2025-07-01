# 修复 401 错误自动刷新 Token 机制

## 🐛 **问题描述**

用户反馈：在 EventList 页面遇到 401 认证失败，但没有看到 refresh token 请求。

## 🔍 **问题分析**

### 原有实现的缺陷

- ✅ **请求拦截器**：检查本地 token 过期时间，过期则先刷新
- ❌ **响应拦截器**：未处理服务器返回的 401 错误

### 问题场景

1. 本地 token 未过期（7 天失效时间）
2. 但服务器端 token 已实际过期
3. 请求拦截器认为 token 有效，直接发送请求
4. 服务器返回 401，但响应拦截器未处理 → **用户看到 401 错误**

## 🔧 **修复方案**

### 双重检测机制

```javascript
// 请求拦截器：本地时间检测
if (isTokenExpired()) {
  // 本地检测到过期，先刷新
}

// 响应拦截器：服务器401检测
if (status === 401 && !originalRequest._retry) {
  // 服务器认为过期，尝试刷新并重试
}
```

### 实现细节

#### 1. 响应拦截器增强

```javascript
async (error) => {
  const originalRequest = error.config;

  // 处理401错误
  if (status === 401 && !originalRequest._retry) {
    const refreshTokenValue = localStorage.getItem(
      TOKEN_CONFIG.REFRESH_TOKEN_KEY
    );

    if (refreshTokenValue && !originalRequest.url?.includes("/auth/login")) {
      originalRequest._retry = true; // 避免无限重试

      try {
        console.log("🔄 收到401错误，尝试刷新token...");
        const newToken = await refreshToken();

        // 更新原请求header并重试
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // 刷新失败，清除token
        localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
        localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
        return Promise.reject(
          createErrorResponse(401, "登录已过期且无法刷新，请重新登录")
        );
      }
    }
  }
};
```

#### 2. 防止无限重试

- 使用 `originalRequest._retry` 标记
- 每个请求最多重试一次
- 避免 refresh 失败后的循环调用

#### 3. 异常处理

- 刷新失败时清除所有 token
- 返回友好的错误提示
- 跳过登录接口的 401 处理

## ✅ **修复效果**

### 现在的完整流程

```
用户请求API
    ↓
[请求拦截器] 检查本地token过期？
    ↓ 是
自动刷新token → 继续请求
    ↓ 否
直接发送请求
    ↓
服务器返回401？
    ↓ 是
[响应拦截器] 尝试刷新token → 重试请求
    ↓ 否
正常返回响应
```

### 用户体验

- ✅ **无感知刷新** - 两种过期检测机制
- ✅ **自动重试** - 401 错误后自动重试原请求
- ✅ **智能降级** - 刷新失败时清除 token 并提示
- ✅ **避免循环** - 防止无限重试机制

## 🧪 **测试验证**

### 方法 1：模拟服务器 token 过期

```javascript
// 1. 保持本地token有效（不修改localStorage）
// 2. 服务器端token实际过期
// 3. 发起API请求 → 应该看到自动刷新
```

### 方法 2：观察 Network 面板

现在应该看到：

```
1. GET /api/events → 401 Unauthorized
2. POST /api/auth/refresh → 200 OK
3. GET /api/events → 200 OK (重试成功)
```

### 方法 3：控制台日志

```
🔄 收到401错误，尝试刷新token...
✅ Token刷新成功，重试原请求
```

## 📊 **对比修复前后**

| 情况              | 修复前           | 修复后             |
| ----------------- | ---------------- | ------------------ |
| 本地 token 过期   | ✅ 自动刷新      | ✅ 自动刷新        |
| 服务器 token 过期 | ❌ 显示 401 错误 | ✅ 自动刷新+重试   |
| refreshToken 过期 | ❌ 不处理        | ✅ 清除 token+提示 |
| 无限重试风险      | ⚠️ 可能存在      | ✅ 已防止          |

## 🎯 **总结**

修复后的 token 刷新机制提供了：

- 🔄 **双重检测** - 本地时间 + 服务器 401
- 🚀 **自动重试** - 刷新成功后无感知继续
- 🛡️ **安全降级** - 失败时优雅处理
- 💪 **完整覆盖** - 各种 token 过期场景

现在用户在 EventList 等页面遇到 401 时，会自动看到 refresh 请求并完成无感知刷新！
