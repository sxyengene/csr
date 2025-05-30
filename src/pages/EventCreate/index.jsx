import React, { useEffect } from "react";
import { Form, Input, DatePicker, Button, Card, message } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import styles from "./index.module.scss";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const EventCreate = () => {
  const navigate = useNavigate();
  const { activityId, eventId } = useParams();
  const [form] = Form.useForm();
  const isEdit = !!eventId;

  useEffect(() => {
    if (isEdit) {
      // TODO: 从API获取事件详情
      // 模拟从API获取数据
      const mockEventData = {
        name: "模拟事件",
        timeRange: [dayjs("2024-03-20 09:00"), dayjs("2024-03-20 10:00")],
        description: "这是一个模拟事件的描述",
      };
      form.setFieldsValue(mockEventData);
    }
  }, [form, isEdit]);

  const handleSubmit = async (values) => {
    try {
      const [startTime, endTime] = values.timeRange;
      const eventData = {
        ...values,
        activityId,
        startTime: startTime.format("YYYY-MM-DD HH:mm"),
        endTime: endTime.format("YYYY-MM-DD HH:mm"),
      };
      delete eventData.timeRange;

      if (isEdit) {
        // TODO: 调用更新事件API
        console.log("更新事件数据:", eventData);
        message.success("更新事件成功");
      } else {
        // TODO: 调用创建事件API
        console.log("创建事件数据:", eventData);
        message.success("创建事件成功");
      }

      navigate(`/`);
    } catch (error) {
      message.error(isEdit ? "更新事件失败" : "创建事件失败");
    }
  };

  const handleCancel = () => {
    navigate(`/`);
  };

  return (
    <div className={styles.container}>
      <Card title={isEdit ? "编辑事件" : "创建事件"} className={styles.card}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            activityId,
          }}
        >
          <Form.Item
            name="name"
            label="事件名称"
            rules={[{ required: true, message: "请输入事件名称" }]}
          >
            <Input placeholder="请输入事件名称" maxLength={45} />
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="事件时间"
            rules={[{ required: true, message: "请选择事件时间" }]}
          >
            <RangePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              placeholder={["开始时间", "结束时间"]}
            />
          </Form.Item>

          <Form.Item
            name="description"
            label="事件描述"
            rules={[{ required: true, message: "请输入事件描述" }]}
          >
            <TextArea
              placeholder="请输入事件描述"
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

export default EventCreate;
