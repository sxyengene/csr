# CSR-Admin 后端 API 接口文档

## 📋 项目概述

CSR-Admin 是一个基于 React + Ant Design 的企业级管理后台系统，主要用于管理用户、事件和活动。本文档详细描述了系统所需的所有后端 API 接口。

## 🔧 技术规范

- **认证方式**: JWT Token
- **数据格式**: JSON
- **编码格式**: UTF-8
- **API 基础路径**: `/api`
- **请求头要求**:
  ```
  Content-Type: application/json
  Authorization: Bearer {token}  # 需要认证的接口
  ```

## 📊 接口概览

| 模块        | 接口数量  | 说明                          |
| ----------- | --------- | ----------------------------- |
| 🔐 认证模块 | 2 个      | 用户登录、退出                |
| 👥 用户管理 | 8 个      | 用户 CRUD、密码重置、记录查询 |
| 📅 事件管理 | 6 个      | 事件 CRUD、状态管理           |
| 🎯 活动管理 | 5 个      | 活动 CRUD                     |
| 📊 活动明细 | 1 个      | 活动参与数据统计查询          |
| **总计**    | **22 个** | **完整业务闭环**              |

---

## 🔐 认证模块

### 1. 用户登录 ✅ 已接入

**POST** `/api/auth/login`

用户登录获取访问令牌。

**测试账号:**

- 用户名: `john_doe`，密码: `password123`
- 用户名: `admin`，密码: `admin123`

**请求参数:**

```json
{
  "username": "admin", // 用户名，必填
  "password": "admin123" // 密码，必填
}
```

**响应示例:**

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoiUk9MRV9VU0VSIiwidHlwZSI6ImFjY2VzcyIsInN1YiI6Imphc29uIiwiaWF0IjoxNzUxMDA3NDk4LCJleHAiOjE3NTEwMTEwOTh9.6loWPoU1ISStwSZ09nqia5iUJSdxhbCwLqTEMbD4TKI",
    "refreshToken": "eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6Imphc29uIiwiaWF0IjoxNzUxMDA3NDk4LCJleHAiOjE3NTEwOTM4OTh9.qCh3NtkdNUFi4OP_tkgVnj6PIAqlBxwsMFDuzhASupA",
    "tokenType": "Bearer",
    "expiresIn": 300
  }
}
```

**错误响应:**

```json
{
  "code": 401,
  "message": "用户名或密码错误"
}
```

### 2. 退出登录 ✅ 已接入

**POST** `/api/auth/logout`

用户退出登录，使当前 refresh token 失效。

**请求头:**

```
Authorization: Bearer {accessToken}
```

**请求参数:**

```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiJ9.eyJ0eXBlIjoicmVmcmVzaCIsInN1YiI6Imphc29uIiwiaWF0IjoxNzUxMDA3NDk4LCJleHAiOjE3NTEwOTM4OTh9.qCh3NtkdNUFi4OP_tkgVnj6PIAqlBxwsMFDuzhASupA"
}
```

**响应示例:**

```json
{
  "code": 200,
  "message": "Logged out successfully",
  "data": null
}
```

---

## 👥 用户管理模块

### 3. 获取用户列表

**GET** `/api/users`

获取分页用户列表，支持搜索和排序。

**查询参数:**

- `page` (number, 可选): 页码，默认 1
- `pageSize` (number, 可选): 每页数量，默认 10
- `username` (string, 可选): 用户名搜索关键词
- `sortField` (string, 可选): 排序字段
- `sortOrder` (string, 可选): 排序方向(ascend/descend)

**请求示例:**

```
GET /api/users?page=1&pageSize=10&username=用户&sortField=createTime&sortOrder=descend
```

**响应示例:**

```json
{
  "code": 200,
  "data": {
    "data": [
      {
        "id": 1,
        "username": "用户1",
        "role": "admin", // admin=管理员, user=普通用户
        "location": "上海", // 上海/深圳
        "reviewer": "孙雄鹰", // 审核人
        "createTime": "2024-01-15 10:30:00",
        "eventCount": 5, // 参与事件数
        "activityCount": 12 // 参与活动数
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

### 4. 获取用户详情 ✅ 已接入

**GET** `/api/users/{id}`

根据用户 ID 获取用户详细信息。

**路径参数:**

- `id` (number): 用户 ID

**响应示例:**

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "username": "用户1",
    "role": "admin",
    "location": "上海",
    "reviewer": "孙雄鹰",
    "createTime": "2024-01-15 10:30:00",
    "eventCount": 5,
    "activityCount": 12
  }
}
```

### 5. 更新用户信息 ✅ 已接入

**PUT** `/api/users/{id}`

更新用户基本信息。

**路径参数:**

- `id` (number): 用户 ID

**请求参数:**

```json
{
  "username": "新用户名",
  "role": "user", // admin/user
  "location": "深圳" // 上海/深圳
}
```

**响应示例:**

```json
{
  "code": 200,
  "message": "更新成功"
}
```

### 6. 更新用户审核人

**PUT** `/api/users/{id}/reviewer`

为用户设置或更改审核人。

**路径参数:**

- `id` (number): 用户 ID

**请求参数:**

```json
{
  "reviewer": "张如诚" // 审核人姓名，可为空字符串表示清除
}
```

**响应示例:**

```json
{
  "code": 200,
  "message": "设置成功"
}
```

### 7. 重置用户密码 ✅ 已接入

**PUT** `/api/users/{id}/reset-password`

管理员重置用户密码。

**路径参数:**

- `id` (number): 用户 ID

**请求参数:**

```json
{
  "password": "newPassword123" // 新密码，最少6位
}
```

**响应示例:**

```json
{
  "code": 200,
  "message": "密码重置成功"
}
```

### 8. 获取用户事件记录

**GET** `/api/users/{id}/events`

获取用户参与的事件记录。

**路径参数:**

- `id` (number): 用户 ID

**响应示例:**

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "年度技术分享大会",
      "type": "线下事件", // 线上事件/线下事件/混合事件
      "duration": "8小时",
      "status": "active" // active=进行中, ended=已结束
    }
  ]
}
```

### 9. 获取用户活动记录

**GET** `/api/users/{id}/activities`

获取用户参与的活动记录。

**路径参数:**

- `id` (number): 用户 ID

**响应示例:**

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "开场致辞",
      "eventName": "年度技术分享大会",
      "duration": "30分钟"
    }
  ]
}
```

### 10. 批量删除用户

**DELETE** `/api/users/batch-delete`

批量删除多个用户。

**请求参数:**

```json
{
  "userIds": [1, 2, 3, 4] // 要删除的用户ID数组
}
```

**响应示例:**

```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 📅 事件管理模块

### 11. 获取事件列表

**GET** `/api/events`

获取事件列表，包含关联的活动信息。

**查询参数:**

- `page` (number, 可选): 页码，默认 1
- `pageSize` (number, 可选): 每页数量，默认 10
- `needsTotal` (boolean, 可选): 是否包含参与人数和总时间统计，默认 false
- `eventName` (string, 可选): 事件名称搜索关键词（不区分大小写，部分匹配）

**请求示例:**

```
GET /api/events?page=1&pageSize=10&needsTotal=true&eventName=tech
```

**响应示例 (needsTotal=true):**

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "年度技术分享大会",
        "startTime": "2024-03-20 09:00",
        "endTime": "2024-03-20 18:00",
        "isDisplay": true,
        "bgImage": "https://example.com/bg.jpg",
        "createdAt": "2024-03-15 14:30",
        "totalParticipants": 25, // 事件总参与人数
        "totalTime": 1200, // 事件总时长(分钟)
        "activities": [
          {
            "id": 1,
            "name": "开场致辞",
            "description": "公司CEO致开场词",
            "startTime": "2024-03-20 09:00",
            "endTime": "2024-03-20 09:30",
            "status": "ACTIVE",
            "createdAt": "2024-03-15 14:45",
            "totalParticipants": 25, // 活动参与人数
            "totalTime": 750 // 活动总时长(分钟)
          },
          {
            "id": 2,
            "name": "技术演讲",
            "description": "技术专家分享",
            "startTime": "2024-03-20 10:00",
            "endTime": "2024-03-20 12:00",
            "status": "ACTIVE",
            "createdAt": "2024-03-15 14:50",
            "totalParticipants": 15,
            "totalTime": 1800
          }
        ]
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10
  }
}
```

**响应示例 (needsTotal=false 或省略):**

```json
{
  "code": 200,
  "message": "Success",
  "data": {
    "data": [
      {
        "id": 1,
        "name": "年度技术分享大会",
        "startTime": "2024-03-20 09:00",
        "endTime": "2024-03-20 18:00",
        "isDisplay": true,
        "bgImage": "https://example.com/bg.jpg",
        "createdAt": "2024-03-15 14:30",
        "activities": [
          {
            "id": 1,
            "name": "开场致辞",
            "description": "公司CEO致开场词",
            "startTime": "2024-03-20 09:00",
            "endTime": "2024-03-20 09:30",
            "status": "ACTIVE",
            "createdAt": "2024-03-15 14:45"
          }
        ]
      }
    ],
    "total": 5,
    "page": 1,
    "pageSize": 10
  }
}
```

### 12. 获取事件详情

**GET** `/api/events/{id}`

获取事件详细信息。

**路径参数:**

- `id` (number): 事件 ID

**响应示例:**

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "年度技术分享大会",
    "startTime": "2024-03-20 09:00:00", // 开始时间
    "endTime": "2024-03-20 18:00:00", // 结束时间
    "icon": "/icons/tech-conference.png",
    "description": "公司年度技术分享大会，邀请各部门技术专家分享最新技术成果...",
    "is_display": true,
    "visibleLocations": ["上海", "深圳"], // 可见地区
    "visibleRoles": ["admin", "user"] // 可见角色
  }
}
```

### 13. 创建事件

**POST** `/api/events`

创建新的事件。

**请求参数:**

```json
{
  "name": "新事件名称", // 必填，最大45字符
  "startTime": "2024-03-20 09:00:00", // 必填，开始时间
  "endTime": "2024-03-20 18:00:00", // 必填，结束时间
  "icon": "/icons/new-event.png", // 必填，图标路径，最大45字符
  "description": "事件详细描述...", // 必填，最大1000字符
  "is_display": true, // 必填，是否前台展示
  "visibleLocations": ["上海"], // 必填，可见地区数组
  "visibleRoles": ["admin", "user"] // 必填，可见角色数组
}
```

**响应示例:**

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 2
  }
}
```

### 14. 更新事件

**PUT** `/api/events/{id}`

更新事件信息。

**路径参数:**

- `id` (number): 事件 ID

**请求参数:** 同创建事件接口

**响应示例:**

```json
{
  "code": 200,
  "message": "更新成功"
}
```

### 15. 更新事件展示状态

**PUT** `/api/events/{id}/display`

单独更新事件的前台展示状态。

**路径参数:**

- `id` (number): 事件 ID

**请求参数:**

```json
{
  "is_display": false // true=显示, false=隐藏
}
```

**响应示例:**

```json
{
  "code": 200,
  "message": "更新成功"
}
```

### 16. 删除事件

**DELETE** `/api/events/{id}`

删除指定事件（同时删除关联的活动）。

**路径参数:**

- `id` (number): 事件 ID

**响应示例:**

```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 🎯 活动管理模块

### 17. 获取活动列表

**GET** `/api/activities`

获取活动列表。

**查询参数:**

- `eventId` (number, 可选): 事件 ID，筛选特定事件下的活动
- `page` (number, 可选): 页码
- `pageSize` (number, 可选): 每页数量

**响应示例:**

```json
{
  "code": 200,
  "data": [
    {
      "id": 1,
      "name": "开场致辞",
      "eventId": 1,
      "startTime": "2024-03-20 09:00",
      "endTime": "2024-03-20 09:30",
      "description": "公司CEO致开场词",
      "status": "registering", // 活动状态
      "templateType": "default", // 模板类型
      "visibleLocations": ["上海", "深圳"],
      "visibleRoles": ["admin", "user"]
    }
  ]
}
```

### 18. 获取活动详情

**GET** `/api/activities/{id}`

获取活动详细信息。

**路径参数:**

- `id` (number): 活动 ID

**响应示例:**

```json
{
  "code": 200,
  "data": {
    "id": 1,
    "name": "开场致辞",
    "eventId": 1,
    "startTime": "2024-03-20 09:00",
    "endTime": "2024-03-20 09:30",
    "description": "公司CEO致开场词，介绍大会主题和议程安排",
    "status": "registering",
    "templateType": "default",
    "visibleLocations": ["上海", "深圳"],
    "visibleRoles": ["admin", "user"]
  }
}
```

### 19. 创建活动

**POST** `/api/activities`

在指定事件下创建新活动。

**请求参数:**

```json
{
  "name": "新活动名称", // 必填，最大45字符
  "eventId": 1, // 必填，所属事件ID
  "startTime": "2024-03-20 14:00", // 必填，开始时间
  "endTime": "2024-03-20 15:30", // 必填，结束时间
  "description": "活动详细描述...", // 必填，最大1000字符
  "status": "not_registered", // 必填，活动状态
  "templateType": "meeting", // 必填，模板类型
  "visibleLocations": ["上海"], // 必填，可见地区
  "visibleRoles": ["admin"] // 必填，可见角色
}
```

**活动状态说明:**

- `not_registered`: 未报名
- `registering`: 报名中
- `full`: 已满人
- `ended`: 已结束

**模板类型说明:**

- `default`: 默认
- `meeting`: 会议
- `transaction`: 交易
- `activity`: 活动

**响应示例:**

```json
{
  "code": 200,
  "message": "创建成功",
  "data": {
    "id": 15
  }
}
```

### 20. 更新活动

**PUT** `/api/activities/{id}`

更新活动信息。

**路径参数:**

- `id` (number): 活动 ID

**请求参数:** 同创建活动接口

**响应示例:**

```json
{
  "code": 200,
  "message": "更新成功"
}
```

### 21. 删除活动

**DELETE** `/api/activities/{id}`

删除指定活动。

**路径参数:**

- `id` (number): 活动 ID

**响应示例:**

```json
{
  "code": 200,
  "message": "删除成功"
}
```

---

## 📊 活动明细模块

### 22. 获取活动明细列表

**GET** `/api/activity-details`

获取用户活动参与明细数据，支持筛选和排序。

**查询参数:**

- `page` (number, 可选): 页码，默认 1
- `pageSize` (number, 可选): 每页数量，默认 10
- `username` (string, 可选): 用户名搜索关键词
- `eventName` (string, 可选): 事件名搜索关键词
- `activityName` (string, 可选): 活动名搜索关键词
- `sortField` (string, 可选): 排序字段 (donationAmount)
- `sortOrder` (string, 可选): 排序方向 (ascend/descend)

**请求示例:**

```
GET /api/activity-details?page=1&pageSize=10&username=张三&sortField=donationAmount&sortOrder=descend
```

**响应示例:**

```json
{
  "code": 200,
  "data": {
    "data": [
      {
        "id": 1,
        "username": "张三",
        "eventName": "年度技术分享大会",
        "activityName": "开场致辞",
        "reviewer": "孙雄鹰",
        "donationAmount": 500.0
      },
      {
        "id": 2,
        "username": "李四",
        "eventName": "年度技术分享大会",
        "activityName": "技术演讲",
        "reviewer": "张如诚",
        "donationAmount": 300.0
      }
    ],
    "total": 100,
    "page": 1,
    "pageSize": 10
  }
}
```

---

## 📝 数据结构说明

### 用户角色

- `admin`: 管理员，拥有所有权限
- `user`: 普通用户，受权限限制

### 地区选项

- `上海`: 上海地区
- `深圳`: 深圳地区

### 审核人选项

- `孙雄鹰`
- `张如诚`
- `xu jin`

### 活动状态

- `not_registered`: 未报名（灰色）
- `registering`: 报名中（蓝色）
- `full`: 已满人（橙色）
- `ended`: 已结束（红色）

---

## ⚠️ 错误码说明

| 状态码 | 说明                | 示例                   |
| ------ | ------------------- | ---------------------- |
| 200    | 请求成功            | 正常业务响应           |
| 400    | 请求参数错误        | 缺少必填参数           |
| 401    | 未认证或 token 过期 | 需要重新登录           |
| 403    | 权限不足            | 普通用户访问管理员接口 |
| 404    | 资源不存在          | 用户/事件/活动不存在   |
| 500    | 服务器内部错误      | 系统异常               |

**错误响应格式:**

```json
{
  "code": 400,
  "message": "请求参数错误",
  "details": "用户名不能为空" // 可选，详细错误信息
}
```

---

## 🚀 开发建议

1. **认证处理**: 除登录接口外，所有接口都需要在请求头中携带有效的 JWT token
2. **分页处理**: 列表接口建议实现分页，避免数据量过大
3. **数据验证**: 严格验证请求参数，特别是字符串长度和必填项
4. **权限控制**: 根据用户角色控制接口访问权限
5. **日志记录**: 记录关键操作日志，便于问题排查
6. **性能优化**: 对频繁查询的接口进行缓存优化

---

## 📞 联系方式

如有接口相关问题，请联系开发团队。

> 文档版本：v1.1  
> 最后更新：2025/7/2 19:45:00
> 维护者：CSR 开发团队
