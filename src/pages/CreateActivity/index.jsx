import React, { useEffect } from "react";
import { Form, Input, InputNumber, Button, Card, message, Radio } from "antd";
import { useNavigate, useParams } from "react-router-dom";

const { TextArea } = Input;

const CreateActivity = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  useEffect(() => {
    if (isEdit) {
      // 这里应该从API获取活动详情
      // 模拟从API获取数据
      const mockActivityData = {
        name: "模拟活动",
        total_time: 120,
        icon: "mock-icon-path",
        description: "这是一个模拟的活动描述",
        is_display: true, // 添加前台展示字段
      };
      form.setFieldsValue(mockActivityData);
    }
  }, [form, isEdit]);

  const onFinish = (values) => {
    console.log("提交的数据:", values);
    if (isEdit) {
      // 这里应该调用更新活动的API
      message.success("活动更新成功！");
    } else {
      // 这里应该调用创建活动的API
      message.success("活动创建成功！");
    }
    navigate("/"); // 返回活动列表页
  };

  return (
    <Card
      title={isEdit ? "编辑活动" : "创建活动"}
      className="create-activity-card"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
      >
        <Form.Item
          label="活动名称"
          name="name"
          rules={[
            { required: true, message: "请输入活动名称" },
            { max: 45, message: "活动名称不能超过45个字符" },
          ]}
        >
          <Input placeholder="请输入活动名称" />
        </Form.Item>

        <Form.Item
          label="前台展示"
          name="is_display"
          rules={[{ required: true, message: "请选择是否在前台展示" }]}
          initialValue={true}
        >
          <Radio.Group>
            <Radio value={true}>显示</Radio>
            <Radio value={false}>隐藏</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item
          label="活动时长（分钟）"
          name="total_time"
          rules={[
            { required: true, message: "请输入活动时长" },
            { type: "number", min: 1, message: "活动时长必须大于0" },
          ]}
        >
          <InputNumber
            style={{ width: "100%" }}
            placeholder="请输入活动时长"
            min={1}
          />
        </Form.Item>

        <Form.Item
          label="活动图标"
          name="icon"
          rules={[
            { required: true, message: "请输入活动图标路径" },
            { max: 45, message: "图标路径不能超过45个字符" },
          ]}
        >
          <Input placeholder="请输入活动图标路径" />
        </Form.Item>

        <Form.Item
          label="活动描述"
          name="description"
          rules={[
            { required: true, message: "请输入活动描述" },
            { max: 1000, message: "活动描述不能超过1000个字符" },
          ]}
        >
          <TextArea
            placeholder="请输入活动详细描述"
            rows={4}
            showCount
            maxLength={1000}
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {isEdit ? "更新活动" : "创建活动"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default CreateActivity;
