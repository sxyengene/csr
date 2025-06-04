import React, { useEffect } from "react";
import { Form, Input, DatePicker, Button, Card, message, Select } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./index.module.scss";

const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { Option } = Select;

const ActivityCreate = () => {
  const navigate = useNavigate();
  const { eventId, activityId } = useParams();
  const [form] = Form.useForm();
  const isEdit = !!activityId;

  // 活动状态选项
  const activityStatusOptions = [
    { value: "not_registered", label: "未报名" },
    { value: "registering", label: "报名中" },
    { value: "full", label: "已满人" },
    { value: "ended", label: "已结束" },
  ];

  useEffect(() => {
    if (isEdit) {
      // TODO: 从API获取活动详情
      // 模拟从API获取数据
      const mockActivityData = {
        name: "模拟活动",
        timeRange: [dayjs("2024-03-20 09:00"), dayjs("2024-03-20 10:00")],
        description: "这是一个模拟活动的描述",
        status: "registering", // 添加状态字段
      };
      form.setFieldsValue(mockActivityData);
    }
  }, [form, isEdit]);

  const handleSubmit = async (values) => {
    try {
      const [startTime, endTime] = values.timeRange;
      const activityData = {
        ...values,
        eventId,
        startTime: startTime.format("YYYY-MM-DD HH:mm"),
        endTime: endTime.format("YYYY-MM-DD HH:mm"),
      };
      delete activityData.timeRange;

      if (isEdit) {
        // TODO: 调用更新活动API
        console.log("更新活动数据:", activityData);
        message.success("更新活动成功");
      } else {
        // TODO: 调用创建活动API
        console.log("创建活动数据:", activityData);
        message.success("创建活动成功");
      }

      navigate(`/`);
    } catch (error) {
      message.error(isEdit ? "更新活动失败" : "创建活动失败");
    }
  };

  const handleCancel = () => {
    navigate(`/`);
  };

  return (
    <div className={styles.container}>
      <Card title={isEdit ? "编辑活动" : "创建活动"} className={styles.card}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            eventId,
          }}
        >
          <Form.Item
            name="name"
            label="活动名称"
            rules={[{ required: true, message: "请输入活动名称" }]}
          >
            <Input placeholder="请输入活动名称" maxLength={45} />
          </Form.Item>

          <Form.Item
            name="status"
            label="活动状态"
            rules={[{ required: true, message: "请选择活动状态" }]}
            initialValue="not_registered"
          >
            <Select placeholder="请选择活动状态">
              {activityStatusOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="活动时间"
            rules={[{ required: true, message: "请选择活动时间" }]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder={["开始时间", "结束时间"]}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="活动描述"
            rules={[{ required: true, message: "请输入活动描述" }]}
          >
            <TextArea
              placeholder="请输入活动描述"
              autoSize={{ minRows: 3, maxRows: 6 }}
              maxLength={1000}
              showCount
            />
          </Form.Item>

          <Form.Item className={styles.actions}>
            <Button onClick={handleCancel}>取消</Button>
            <Button type="primary" htmlType="submit">
              {isEdit ? "更新" : "创建"}
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default ActivityCreate;
