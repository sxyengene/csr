# TimeRangeSelector 时间范围选择器

一个增强版的时间范围选择组件，基于 Ant Design 的 RangePicker 封装，提供更好的用户体验和日历联动功能。

## ✨ 特性

- 📅 **日历联动选择** - 直观的日历视图，支持快速选择时间范围
- ⚡ **快捷选择** - 预设常用时间段（今天、明天、本周末、1 小时、2 小时等）
- 🚫 **智能禁用** - 自动禁用过去的时间，防止无效选择
- 💡 **友好提示** - 底部提示信息，帮助用户更好地使用
- 🎨 **美观样式** - 自定义图标和分隔符，提升视觉体验
- ⏰ **时间验证** - 内置时间逻辑验证，确保结束时间晚于开始时间

## 📦 使用方法

### 基础用法

```jsx
import TimeRangeSelector from "../../components/TimeRangeSelector";

<Form.Item
  name="timeRange"
  label="活动时间"
  rules={[{ required: true, message: "请选择活动时间" }]}
>
  <TimeRangeSelector placeholder={["活动开始时间", "活动结束时间"]} />
</Form.Item>;
```

### 高级用法

```jsx
<TimeRangeSelector
  value={timeRange}
  onChange={handleTimeChange}
  placeholder={["开始时间", "结束时间"]}
  format="YYYY-MM-DD HH:mm:ss"
  showTime={true}
  allowClear={true}
  disabled={false}
  style={{ width: "100%" }}
  className="custom-selector"
/>
```

## 🎯 Props

| 参数        | 说明             | 类型                                                           | 默认值                   |
| ----------- | ---------------- | -------------------------------------------------------------- | ------------------------ |
| value       | 时间范围值       | [Dayjs, Dayjs]                                                 | -                        |
| onChange    | 时间变化回调     | (dates: [Dayjs, Dayjs], dateStrings: [string, string]) => void | -                        |
| placeholder | 占位符           | [string, string]                                               | ["开始时间", "结束时间"] |
| format      | 时间格式         | string                                                         | "YYYY-MM-DD HH:mm"       |
| showTime    | 是否显示时间选择 | boolean                                                        | true                     |
| allowClear  | 是否显示清除按钮 | boolean                                                        | true                     |
| disabled    | 是否禁用         | boolean                                                        | false                    |
| style       | 自定义样式       | CSSProperties                                                  | -                        |
| className   | 自定义类名       | string                                                         | -                        |

## 🚀 快捷选择预设

组件内置了以下快捷选择选项：

- **今天** - 当天 00:00 到 23:59
- **明天** - 明天 00:00 到 23:59
- **本周末** - 本周六日
- **下周** - 下周一到周日
- **1 小时** - 从现在开始的 1 小时
- **2 小时** - 从现在开始的 2 小时
- **半天** - 从现在开始的 4 小时
- **全天** - 工作时间 09:00 到 18:00

## 🛡️ 时间验证

组件自动处理以下验证逻辑：

1. **禁用过去时间** - 不能选择今天之前的日期
2. **禁用过去小时** - 如果选择今天，不能选择当前时间之前的小时
3. **结束时间验证** - 确保结束时间晚于开始时间

## 💅 样式定制

组件支持自定义样式，包括：

- 自定义图标（日历图标和分隔符图标）
- 快捷选择列表的悬停效果
- 底部提示区域的样式
- 整体组件的尺寸和间距

## 🔧 在项目中的应用

目前已应用于：

- **ActivityCreate** - 活动创建页面的时间选择
- **EventCreate** - 事件创建页面的时间选择

统一了时间选择的用户体验，提供了更直观和便捷的操作方式。
