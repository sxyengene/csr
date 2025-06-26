# 工具库使用分析

## 🔍 当前代码分析

### 现有实现中可以优化的地方

#### 1. 对象和数组操作

**当前代码：** 手写对象处理逻辑

```javascript
// src/config/api.js
Object.keys(params).forEach((key) => {
  url = url.replace(`{${key}}`, params[key]);
});
```

**建议：** 使用 `lodash` 简化

```javascript
import { template } from "lodash";
const compiledUrl = template(url, { interpolate: /\{(.+?)\}/g });
return compiledUrl(params);
```

#### 2. 查询参数处理

**当前代码：** 依赖 axios 内置处理

```javascript
// axios自动处理params
return axiosInstance.get(url, { params, ...config });
```

**建议：** 使用 `qs` 库获得更好控制

```javascript
import qs from "qs";
const queryString = qs.stringify(params, {
  arrayFormat: "brackets",
  skipNulls: true,
});
```

#### 3. 深度合并配置

**当前代码：** 简单展开操作

```javascript
const config = { ...defaultOptions, ...options };
```

**建议：** 使用 `lodash.merge` 处理嵌套对象

```javascript
import merge from "lodash/merge";
const config = merge({}, defaultOptions, options);
```

#### 4. 数据验证

**当前代码：** 手写验证逻辑

```javascript
if (params[key] !== undefined && params[key] !== null && params[key] !== "") {
  // ...
}
```

**建议：** 使用 `yup` 或 `joi` 进行数据验证

## 📦 推荐工具库

### 🔧 核心工具库

#### 1. **lodash** - 必需 ⭐⭐⭐

```bash
npm install lodash
```

**用途：**

- 对象/数组操作
- 深度合并
- 工具函数
- URL 模板处理

**收益：** 代码更简洁，性能更好，减少 bug

#### 2. **qs** - 推荐 ⭐⭐

```bash
npm install qs
```

**用途：**

- 查询参数序列化
- 支持复杂数据结构
- 更好的 URL 处理

**收益：** 更强大的查询参数处理

#### 3. **yup** - 可选 ⭐

```bash
npm install yup
```

**用途：**

- 数据验证
- API 参数验证
- 表单验证

**收益：** 统一的验证逻辑

### 🎨 UI 相关工具库

#### 4. **clsx** - 推荐 ⭐⭐

```bash
npm install clsx
```

**用途：**

- 条件性 className 组合
- 替代复杂的字符串拼接

**收益：** 更清晰的样式逻辑

#### 5. **react-use** - 可选 ⭐

```bash
npm install react-use
```

**用途：**

- 常用 React hooks
- 减少重复代码

## 🚀 具体改进建议

### 改进 src/config/api.js

**当前：**

```javascript
export const buildUrl = (endpoint, params = {}) => {
  let url = endpoint;
  Object.keys(params).forEach((key) => {
    url = url.replace(`{${key}}`, params[key]);
  });
  return url;
};
```

**改进后：**

```javascript
import { template } from "lodash";

export const buildUrl = (endpoint, params = {}) => {
  const compiledUrl = template(endpoint, {
    interpolate: /\{(.+?)\}/g,
  });
  return compiledUrl(params);
};
```

### 改进 src/utils/request.js

**新增工具函数：**

```javascript
import { merge, omitBy, isNil } from "lodash";
import qs from "qs";

// 清理参数（移除null/undefined）
const cleanParams = (params) => omitBy(params, isNil);

// 深度合并配置
const mergeConfig = (defaultConfig, userConfig) =>
  merge({}, defaultConfig, userConfig);

// 构建查询字符串
const buildQueryString = (params) =>
  qs.stringify(cleanParams(params), {
    arrayFormat: "brackets",
    skipNulls: true,
  });
```

### 新增 src/utils/validators.js

```javascript
import * as yup from "yup";

// API参数验证schemas
export const loginSchema = yup.object({
  username: yup.string().required("用户名不能为空"),
  password: yup.string().min(6, "密码至少6位").required("密码不能为空"),
});

export const paginationSchema = yup.object({
  page: yup.number().min(1).default(1),
  pageSize: yup.number().min(1).max(100).default(10),
});
```

## 💰 成本效益分析

### ✅ 建议立即添加

1. **lodash** (必需)

   - 成本：+67KB (gzipped: ~17KB)
   - 收益：代码质量显著提升，减少 bug
   - 推荐：只导入需要的函数 `import merge from 'lodash/merge'`

2. **clsx** (推荐)
   - 成本：+2KB
   - 收益：更清晰的 CSS 类名逻辑

### 🤔 可选添加

3. **qs** (按需)

   - 成本：+42KB (gzipped: ~8KB)
   - 收益：更强大的查询参数处理
   - 考虑：当前 axios 处理已够用

4. **yup** (按需)
   - 成本：+184KB (gzipped: ~37KB)
   - 收益：统一的数据验证
   - 考虑：只在需要复杂验证时添加

## 🎯 分阶段实施建议

### 第一阶段：核心优化

```bash
npm install lodash clsx
```

重构 config/api.js 和核心工具函数

### 第二阶段：增强功能

```bash
npm install qs
```

优化查询参数处理

### 第三阶段：数据验证

```bash
npm install yup
```

添加 API 参数验证

## 📊 总结

**当前状况：** 代码实现较为原始，有优化空间
**建议：** 逐步引入成熟工具库，提升代码质量
**优先级：** lodash > clsx > qs > yup
