import React, { useEffect } from "react";
import {
  Form,
  Input,
  DatePicker,
  Button,
  Card,
  message,
  Select,
  Checkbox,
} from "antd";
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

  // 模板类型选项
  const templateTypeOptions = [
    { value: "default", label: "默认" },
    { value: "meeting", label: "meeting" },
    { value: "transaction", label: "交易" },
    { value: "activity", label: "活动" },
  ];

  // 地区选项
  const locationOptions = [
    { value: "SH", label: "上海" },
    { value: "SZ", label: "深圳" },
  ];

  // 角色选项
  const roleOptions = [
    { value: "admin", label: "管理员" },
    { value: "user", label: "普通用户" },
  ];

  useEffect(() => {
    if (isEdit) {
      // TODO: 从API获取活动详情
      // 模拟从API获取数据
      const mockActivityData = {
        name: "模拟活动",
        timeRange: [dayjs("2024-03-20 09:00"), dayjs("2024-03-20 10:00")],
        description: "这是一个模拟活动的描述",
        status: "registering",
        templateType: "default", // 模板类型
        visibleLocations: ["SH", "SZ"], // 可见地区
        visibleRoles: ["admin", "user"], // 可见角色
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
            templateType: "default", // 默认模板类型
            visibleLocations: ["SH", "SZ"], // 默认全部地区可见
            visibleRoles: ["admin", "user"], // 默认全部角色可见
          }}
        >
          <Form.Item
            name="templateType"
            label="模板类型"
            rules={[{ required: true, message: "请选择模板类型" }]}
          >
            <Select placeholder="请选择模板类型">
              {templateTypeOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

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

          <Form.Item
            name="visibleLocations"
            label="可见地区"
            rules={[{ required: true, message: "请选择可见地区" }]}
          >
            <Select mode="multiple" placeholder="请选择可见地区" allowClear>
              {locationOptions.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="visibleRoles"
            label="可见角色"
            rules={[{ required: true, message: "请选择可见角色" }]}
          >
            <Checkbox.Group>
              {roleOptions.map((option) => (
                <Checkbox key={option.value} value={option.value}>
                  {option.label}
                </Checkbox>
              ))}
            </Checkbox.Group>
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
