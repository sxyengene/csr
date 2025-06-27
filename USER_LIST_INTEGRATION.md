# 用户列表接口接入说明

## 🎉 接入状态

✅ **用户列表接口已成功接入！**

系统已成功接入用户列表的真实 API，支持分页、搜索和排序功能。

## 🔧 接入详情

### API 信息

- **接口地址**: `GET /api/users`
- **认证方式**: Bearer Token
- **功能**: 获取用户列表，支持分页、搜索、排序

### 请求参数

| 参数      | 类型    | 必需 | 说明                      |
| --------- | ------- | ---- | ------------------------- |
| page      | integer | 否   | 页码 (默认: 1)            |
| pageSize  | integer | 否   | 每页条数 (默认: 10)       |
| username  | string  | 否   | 用户名搜索 (模糊匹配)     |
| sortField | string  | 否   | 排序字段                  |
| sortOrder | string  | 否   | 排序方向 (ascend/descend) |

### 响应格式

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": 1,
        "username": "john_doe",
        "role": "User",
        "location": "上海",
        "reviewerId": 2,
        "reviewerName": "李明",
        "createTime": "2024-01-15 10:30:00",
        "eventCount": 5,
        "activityCount": 12
      }
    ],
    "total": 25,
    "page": 1,
    "pageSize": 10
  }
}
```

## 🔄 字段映射

### 数据转换逻辑

为了兼容现有页面，接入时进行了以下字段映射：

```javascript
const mapUserData = (user) => {
  return {
    ...user,
    // 映射角色字段
    role: user.role === "Administrator" ? "admin" : "user",
    // 映射reviewer字段
    reviewer: user.reviewerName || "",
  };
};
```

### 字段对应关系

| 接口字段              | 页面字段      | 转换逻辑              |
| --------------------- | ------------- | --------------------- |
| role: "User"          | role: "user"  | User → user           |
| role: "Administrator" | role: "admin" | Administrator → admin |
| reviewerName          | reviewer      | 直接映射              |

## 🚀 功能特性

### ✅ 已支持功能

1. **分页显示** - 支持自定义页码和每页条数
2. **用户搜索** - 根据用户名进行模糊搜索
3. **排序功能** - 支持多字段排序
4. **数据展示** - 完整显示用户信息
   - 用户名称
   - 用户角色 (带标签显示)
   - 所在地区
   - 审核人信息
   - 创建时间
   - 参与事件/活动数量

### ⚠️ 混合实现功能

以下功能暂时保持模拟实现，等待后续接口：

1. **批量删除** - 使用模拟删除
2. **设置审核人** - 使用模拟更新

## 📋 使用示例

### 基础查询

```javascript
import { getUserList } from "../services/user";

// 获取第一页用户
const result = await getUserList({
  page: 1,
  pageSize: 10,
});
```

### 搜索用户

```javascript
// 搜索用户名包含"john"的用户
const result = await getUserList({
  page: 1,
  pageSize: 10,
  username: "john",
});
```

### 排序查询

```javascript
// 按创建时间降序排列
const result = await getUserList({
  page: 1,
  pageSize: 10,
  sortField: "createTime",
  sortOrder: "descend",
});
```

## 🧪 测试方法

### 1. 启动项目

```bash
npm start
```

### 2. 访问用户管理页面

打开浏览器访问：`http://localhost:3000/users`

### 3. 测试功能

1. **基础列表** - 查看用户列表是否正常显示
2. **分页功能** - 切换页码，验证分页是否正常
3. **搜索功能** - 输入用户名进行搜索
4. **排序功能** - 点击表头进行排序

### 4. 检查数据

确认以下数据正常显示：

- 用户基本信息
- 角色标签 (管理员显示红色，普通用户显示蓝色)
- 审核人信息
- 事件和活动数量

## ⚠️ 注意事项

### 已知限制

1. **测试账号**: 由于测试账号可能有变化，请使用有效的登录凭据
2. **批量操作**: 批量删除和设置审核人功能暂时为模拟实现
3. **错误处理**: 如果 API 调用失败，会显示友好的错误提示

### 故障排查

1. **登录失败**: 确认使用正确的用户名密码
2. **数据不显示**: 检查网络连接和 API 服务器状态
3. **权限错误**: 确认用户具有访问用户列表的权限

## 📊 接口兼容性

| 功能          | 状态     | 说明                      |
| ------------- | -------- | ------------------------- |
| ✅ 分页查询   | 完全兼容 | 支持 page、pageSize 参数  |
| ✅ 用户搜索   | 完全兼容 | 支持 username 模糊搜索    |
| ✅ 排序功能   | 完全兼容 | 支持 sortField、sortOrder |
| ✅ 数据显示   | 完全兼容 | 通过字段映射实现兼容      |
| ⚠️ 批量删除   | 待接入   | 需要批量删除 API          |
| ⚠️ 设置审核人 | 待接入   | 需要更新审核人 API        |

## 🎯 下一步计划

### 短期目标

1. **接入用户详情 API** - `GET /api/users/{id}`
2. **接入用户更新 API** - `PUT /api/users/{id}`
3. **接入批量删除 API** - `DELETE /api/users/batch`

### 中期目标

1. **用户创建功能** - 添加新用户
2. **权限管理** - 角色权限控制
3. **审核流程** - 完善审核人设置

---

🎉 **成功接入用户列表！** 现在可以在页面中查看真实的用户数据，享受完整的分页、搜索和排序功能。
