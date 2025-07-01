import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  InputNumber,
  Button,
  Card,
  message,
  Radio,
  Select,
  Checkbox,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { createEvent } from "../../services/event";
import { showApiError } from "../../utils/request";

const { TextArea } = Input;
const { Option } = Select;

const EventCreate = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);

  // 地区选项
  const locationOptions = [
    { value: "上海", label: "上海" },
    { value: "深圳", label: "深圳" },
  ];

  // 角色选项
  const roleOptions = [
    { value: "admin", label: "管理员" },
    { value: "user", label: "普通用户" },
  ];

  useEffect(() => {
    if (isEdit) {
      // 这里应该从API获取事件详情
      // 模拟从API获取数据
      const mockEventData = {
        name: "模拟事件",
        total_time: 120,
        icon: "mock-icon-path",
        description: "这是一个模拟的事件描述",
        is_display: true,
        visibleLocations: ["上海", "深圳"], // 可见地区
        visibleRoles: ["admin", "user"], // 可见角色
      };
      form.setFieldsValue(mockEventData);
    }
  }, [form, isEdit]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      if (isEdit) {
        // TODO: 调用更新事件的API
        message.success("事件更新成功！");
      } else {
        // 调用创建事件的API
        await createEvent(values);
        message.success("事件创建成功！");
      }

      navigate("/"); // 返回事件列表页
    } catch (error) {
      showApiError(error, isEdit ? "更新事件失败" : "创建事件失败");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title={isEdit ? "编辑事件" : "创建事件"}
      className="create-event-card"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          is_display: true,
          visibleLocations: ["上海", "深圳"], // 默认全部地区可见
          visibleRoles: ["admin", "user"], // 默认全部角色可见
        }}
      >
        <Form.Item
          label="事件名称"
          name="name"
          rules={[
            { required: true, message: "请输入事件名称" },
            { max: 45, message: "事件名称不能超过45个字符" },
          ]}
        >
          <Input placeholder="请输入事件名称" />
        </Form.Item>

        <Form.Item
          label="前台展示"
          name="is_display"
          rules={[{ required: true, message: "请选择是否在前台展示" }]}
        >
          <Radio.Group>
            <Radio value={true}>显示</Radio>
            <Radio value={false}>隐藏</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="事件时长（分钟）"
          name="total_time"
          rules={[
            { required: true, message: "请输入事件时长" },
            { type: "number", min: 1, message: "事件时长必须大于0" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="请输入事件时长"
            min={1}
          />
        </Form.Item>

        <Form.Item
          label="事件图标"
          name="icon"
          rules={[
            { required: true, message: "请输入事件图标路径" },
            { max: 45, message: "图标路径不能超过45个字符" },
          ]}
        >
          <Input placeholder="请输入事件图标路径" showCount maxLength={45} />
        </Form.Item>

        <Form.Item
          label="事件描述"
          name="description"
          rules={[
            { required: true, message: "请输入事件描述" },
            { max: 1000, message: "事件描述不能超过1000个字符" },
          ]}
        >
          <TextArea
            placeholder="请输入事件详细描述"
            rows={4}
            showCount
            maxLength={1000}
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

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading} block>
            {isEdit ? "更新事件" : "创建事件"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default EventCreate;
