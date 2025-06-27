# 认证功能接入说明 (Login & Logout)

## 🎉 完成状态

✅ **认证功能已全面完成！**

系统已成功接入完整的认证功能，包括：

- ✅ **登录功能** - 后端 API 接入，JWT Token 认证
- ✅ **登出功能** - 安全退出，Token 失效处理
- ✅ **路由守卫** - 统一认证检查，自动跳转
- ✅ **用户界面** - 用户信息显示，下拉菜单操作

## 🔧 接入详情

### API 信息

- **服务器地址**: `http://8.133.240.77:8080`
- **登录接口**: `POST /api/auth/login`
- **登出接口**: `POST /api/auth/logout`
- **认证方式**: JWT Bearer Token
- **Token 过期时间**: 300 秒（5 分钟）

### 响应格式

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "tokenType": "Bearer",
    "expiresIn": 300
  }
}
```

## 🚀 快速测试

### 1. 安装依赖

```bash
npm install
```

### 2. 测试 API 连接

```bash
npm run test:api
```

### 3. 启动项目

```bash
npm start
```

### 4. 访问登录页

打开浏览器访问：`http://localhost:3000/login`

## 🔐 登录测试账号

根据 API 文档，您可以尝试以下测试账号：

1. **API 文档示例账号**:

   - 用户名: `john_doe`
   - 密码: `password123`

2. **常见测试账号**:

   - 用户名: `admin`
   - 密码: `admin123`

3. **其他测试账号**:
   - 用户名: `test`
   - 密码: `test123`

## 🛠️ 技术实现

### 文件修改列表

1. **`src/services/auth.js`** - 接入实际 API

   - 替换模拟登录为实际 API 调用
   - 添加 token 存储和管理
   - 实现 token 刷新机制

2. **`src/utils/request.js`** - 通用 API 请求工具

   - 自动处理认证头
   - 统一错误处理
   - 支持 token 自动刷新

3. **`src/pages/Login/index.jsx`** - 登录页面优化

   - 移除重复的 token 存储
   - 优化成功提示信息

4. **`scripts/test-api.js`** - API 测试工具
   - 验证服务器连接
   - 测试登录功能
   - 生成测试报告

### Token 管理机制

系统现在支持完整的 JWT token 管理：

```javascript
// 存储的token信息
localStorage.setItem("accessToken", accessToken); // 访问令牌
localStorage.setItem("refreshToken", refreshToken); // 刷新令牌
localStorage.setItem("tokenType", "Bearer"); // 令牌类型
localStorage.setItem("tokenExpiresIn", "300"); // 过期时间(秒)
localStorage.setItem("tokenExpiresAt", timestamp); // 过期时间戳
```

### 自动认证功能

- **自动添加认证头**: 所有 API 请求自动携带`Authorization: Bearer {token}`
- **过期检测**: 自动检查 token 是否过期
- **自动刷新**: token 过期时尝试自动刷新
- **自动跳转**: 认证失败时自动跳转到登录页

## 📋 使用流程

### 开发流程

1. 用户在登录页面输入账号密码
2. 前端调用`/api/auth/login`接口
3. 服务器验证并返回 JWT token
4. 前端自动存储 token 信息
5. 后续 API 请求自动携带认证头
6. Token 过期时自动刷新或重新登录

### API 调用示例

```javascript
import { get, post } from "../utils/request";

// GET请求 - 自动携带认证头
const users = await get("/api/users", { page: 1, pageSize: 10 });

// POST请求 - 自动携带认证头
const newUser = await post("/api/users", { username: "newuser" });
```

## ⚠️ 注意事项

### Token 过期处理

- Token 有效期为 5 分钟
- 系统会在 token 过期前自动尝试刷新
- 如果刷新失败，会自动跳转到登录页面

### 网络错误处理

- 网络连接失败时会显示友好的错误提示
- API 调用失败时会显示具体的错误信息

### 兼容性说明

- 保持了与原有代码的兼容性
- 原有的`localStorage.getItem("token")`仍然有效
- 新增的认证功能向下兼容

## 🔍 故障排除

### 登录失败

1. **检查网络连接**:

   ```bash
   ping 8.133.240.77
   ```

2. **测试 API 连接**:

   ```bash
   npm run test:api
   ```

3. **检查账号密码**: 确认使用正确的测试账号

### API 调用失败

1. **检查 token 是否有效**: 在浏览器控制台查看 localStorage
2. **查看网络请求**: 在浏览器开发者工具的 Network 面板查看请求详情
3. **检查认证头**: 确认 API 请求包含`Authorization`头

### 常见错误码

- `401`: 未认证或 token 过期 → 重新登录
- `403`: 权限不足 → 检查用户权限
- `404`: 接口不存在 → 检查 API 路径
- `500`: 服务器错误 → 联系后端开发人员

## 📞 支持

如果遇到问题，请：

1. 首先运行`npm run test:api`检查 API 连接
2. 查看浏览器控制台的错误信息
3. 检查 Network 面板的请求响应
4. 联系后端开发人员确认 API 服务状态

---

> 🎯 **下一步**: 可以继续接入其他 API 接口，如用户管理、事件管理等模块。所有接口都可以使用`src/utils/request.js`工具进行调用，享受统一的认证和错误处理功能。
