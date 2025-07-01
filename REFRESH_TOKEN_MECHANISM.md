# Refresh Token 自动刷新机制

## ✅ **回答您的问题**

**是的！** 系统在登录过期时会自动调用 refresh 接口进行 token 更新。

## 🔄 **自动刷新流程**

### 1. **触发条件**

- 用户发起任何 API 请求（除登录接口外）
- 检测到 accessToken 已过期
- 存在有效的 refreshToken

### 2. **自动执行流程**

```
用户请求API → 检查token过期 → 自动调用refresh → 使用新token继续请求
```

### 3. **具体代码实现**

```javascript
// 在request.js的请求拦截器中
if (isTokenExpired()) {
  const hasRefreshToken = localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);

  if (hasRefreshToken) {
    console.log("🔄 Token已过期，尝试自动刷新...");
    const newToken = await refreshToken();
    config.headers.Authorization = `Bearer ${newToken}`;
    console.log("✅ Token刷新成功");
  }
}
```

## 📊 **API 兼容性修复**

### 问题发现

在检查您提供的 API 文档时，我发现了兼容性问题：

| 字段           | 原实现期望  | API 文档实际 | 修复状态      |
| -------------- | ----------- | ------------ | ------------- |
| `accessToken`  | ✅ 期望     | ✅ 返回      | ✅ 匹配       |
| `refreshToken` | ❌ 期望新值 | ❌ 不返回    | ✅ **已修复** |
| `tokenType`    | ⚠️ 未处理   | ✅ 返回      | ✅ **已修复** |
| `expiresIn`    | ✅ 期望     | ✅ 返回      | ✅ 匹配       |

### 修复内容

```javascript
// 修复前 - 错误的字段解构
const { accessToken, refreshToken: newRefreshToken, expiresIn } = data.data;

// 修复后 - 符合API文档
const { accessToken, tokenType, expiresIn } = data.data;
// refreshToken保持不变，不更新
```

## 🎯 **现在的工作机制**

### 1. **登录时**

- 存储 `accessToken` 和 `refreshToken`
- 设置 7 天失效时间（覆盖后端返回的短期时间）

### 2. **请求时**

- 自动检查 token 是否过期
- 过期则自动调用 refresh 接口
- 刷新成功后继续原请求

### 3. **刷新时**

- 使用原有 refreshToken
- 获取新的 accessToken 和 tokenType
- refreshToken 保持不变（符合 API 文档）
- 重新设置 7 天失效时间

### 4. **失败处理**

- 如果 refreshToken 也过期，返回 401 错误
- 用户看到"Token 已过期且刷新失败，请重新登录"提示

## 🧪 **测试方法**

### 方法 1：手动触发过期

```javascript
// 在浏览器控制台执行
localStorage.setItem("tokenExpiresAt", (Date.now() - 1000).toString());
// 然后尝试任何API操作，应该看到自动刷新
```

### 方法 2：观察控制台日志

当 token 过期时，控制台会显示：

```
🔄 Token已过期，尝试自动刷新...
✅ Token刷新成功
```

### 方法 3：查看 Network 请求

在开发者工具 Network 标签中应该看到：

1. 原始 API 请求 → 检测到过期
2. `POST /api/auth/refresh` → 自动刷新
3. 原始 API 请求重试 → 使用新 token 成功

## 📋 **API 调用详情**

### 请求

```javascript
POST /api/auth/refresh
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 响应

```javascript
{
  "code": 200,
  "message": "Success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 300  // 被覆盖为7天
  }
}
```

## 🎉 **总结**

✅ **自动刷新已启用** - 用户无感知的 token 刷新  
✅ **API 完全兼容** - 符合您提供的接口文档  
✅ **7 天长期有效** - 减少刷新频率  
✅ **完善错误处理** - 刷新失败时友好提示

现在系统会在 token 过期时自动无缝刷新，用户无需手动重新登录！
