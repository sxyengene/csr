# API 字段映射修复记录

## 🐛 **问题描述**

在编辑事件时，更新接口返回验证错误：

```json
{
  "isDisplay": "must not be null",
  "totalTime": "must not be null"
}
```

## 🔍 **问题分析**

### API 文档 vs 实际接口

| 接口类型 | API 文档显示               | 实际接口期望             | 问题        |
| -------- | -------------------------- | ------------------------ | ----------- |
| 创建事件 | `totalTime`, `isDisplay`   | `totalTime`, `isDisplay` | ✅ 文档正确 |
| 更新事件 | `total_time`, `is_display` | `totalTime`, `isDisplay` | ❌ 文档错误 |

**结论**: 更新事件的 API 文档有误，实际接口使用驼峰命名而非下划线命名。

## 🔧 **修复方案**

### 修复前的错误映射

```javascript
// 错误：基于API文档的映射
const mapEventDataToUpdateAPI = (eventData) => {
  return {
    total_time: eventData.total_time, // ❌ 实际接口不接受
    is_display: eventData.is_display, // ❌ 实际接口不接受
    // ...
  };
};
```

### 修复后的正确映射

```javascript
// 正确：统一使用驼峰命名
const mapEventDataToAPI = (eventData) => {
  return {
    totalTime: eventData.total_time, // ✅ 转换为驼峰命名
    isDisplay: eventData.is_display, // ✅ 转换为驼峰命名
    // ...
  };
};

// 创建和更新接口共用同一个映射函数
export const createEvent = async (eventData) => {
  const apiData = mapEventDataToAPI(eventData);
  // ...
};

export const updateEvent = async (eventId, eventData) => {
  const apiData = mapEventDataToAPI(eventData); // 复用同一函数
  // ...
};
```

## ✅ **验证方法**

### 1. 控制台调试信息

更新事件时查看控制台输出：

```
🔄 更新事件 - 原始数据: { total_time: 240, is_display: true, ... }
🔄 更新事件 - 映射后数据: { totalTime: 240, isDisplay: true, ... }
🔄 更新事件 - API地址: /api/events/1
```

### 2. 网络请求验证

检查实际发送的请求体：

```json
{
  "name": "事件名称",
  "totalTime": 240, // ✅ 驼峰命名
  "isDisplay": true, // ✅ 驼峰命名
  "icon": "/path/to/icon",
  "description": "描述",
  "visibleLocations": ["上海"],
  "visibleRoles": ["admin"]
}
```

## 📝 **经验总结**

### 1. **API 文档可能有误**

- 不要完全依赖 API 文档
- 通过实际测试验证字段格式
- 错误信息往往能提供正确的字段名

### 2. **字段映射策略**

- 优先复用映射函数，避免重复代码
- 添加调试信息便于排查问题
- 保持表单字段命名的一致性

### 3. **错误处理改进**

- 从验证错误中识别正确的字段名
- `"isDisplay": "must not be null"` → 接口期望 `isDisplay`
- `"totalTime": "must not be null"` → 接口期望 `totalTime`

## 🎯 **最终效果**

- ✅ 事件创建功能正常
- ✅ 事件更新功能正常
- ✅ 字段映射统一规范
- ✅ 代码简洁无重复

---

**经验**: 遇到字段验证错误时，错误信息中的字段名往往就是接口期望的正确格式！
