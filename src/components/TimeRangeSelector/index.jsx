import React from "react";
import { DatePicker, Space, Button } from "antd";
import { CalendarOutlined, ClockCircleOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import styles from "./index.module.scss";

const { RangePicker } = DatePicker;

const TimeRangeSelector = ({
  value,
  onChange,
  placeholder = ["开始时间", "结束时间"],
  format = "YYYY-MM-DD HH:mm",
  showTime = true,
  allowClear = true,
  disabled = false,
  style,
  className,
  ...props
}) => {
  // 快捷选择选项
  const rangePresets = [
    {
      label: "今天",
      value: [dayjs().startOf("day"), dayjs().endOf("day")],
    },
    {
      label: "明天",
      value: [
        dayjs().add(1, "day").startOf("day"),
        dayjs().add(1, "day").endOf("day"),
      ],
    },
    {
      label: "本周末",
      value: [
        dayjs().day(6).startOf("day"), // 本周六
        dayjs().day(7).endOf("day"), // 本周日
      ],
    },
    {
      label: "下周",
      value: [
        dayjs().add(1, "week").startOf("week"),
        dayjs().add(1, "week").endOf("week"),
      ],
    },
    {
      label: "1小时",
      value: [dayjs(), dayjs().add(1, "hour")],
    },
    {
      label: "2小时",
      value: [dayjs(), dayjs().add(2, "hour")],
    },
    {
      label: "半天",
      value: [dayjs(), dayjs().add(4, "hour")],
    },
    {
      label: "全天",
      value: [
        dayjs().startOf("day").add(9, "hour"),
        dayjs().startOf("day").add(18, "hour"),
      ],
    },
  ];

  // 移除时间限制，允许选择任何时间
  const disabledDate = () => {
    return false; // 不禁用任何日期
  };

  // 移除时间限制，允许选择任何小时和分钟
  const disabledTime = () => {
    return {}; // 不禁用任何时间
  };

  return (
    <div
      className={`${styles.timeRangeSelector} ${className || ""}`}
      style={style}
    >
      <RangePicker
        value={value}
        onChange={onChange}
        showTime={
          showTime
            ? {
                format: "HH:mm",
                defaultValue: [
                  dayjs("09:00", "HH:mm"),
                  dayjs("18:00", "HH:mm"),
                ],
              }
            : false
        }
        format={format}
        placeholder={placeholder}
        allowClear={allowClear}
        disabled={disabled}
        disabledDate={disabledDate}
        disabledTime={disabledTime}
        presets={rangePresets}
        size="large"
        style={{ width: "100%" }}
        suffixIcon={<CalendarOutlined />}
        separator={<ClockCircleOutlined style={{ color: "#1890ff" }} />}
        renderExtraFooter={() => (
          <div className={styles.extraFooter}>
            <Space size="small">
              <Button size="small" type="link">
                💡 提示：可选择任意时间段，支持历史时间和未来时间
              </Button>
            </Space>
          </div>
        )}
        {...props}
      />
    </div>
  );
};

export default TimeRangeSelector;
