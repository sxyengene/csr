import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Radio,
  Select,
  Checkbox,
  Spin,
  Space,
} from "antd";
import { ArrowLeftOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useNavigate, useParams } from "react-router-dom";
import { createEvent, getEventDetail, updateEvent } from "../../services/event";
import { showApiError } from "../../utils/request";
import TimeRangeSelector from "../../components/TimeRangeSelector";

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
    { value: "SH", label: "上海" },
    { value: "SZ", label: "深圳" },
  ];

  // 角色选项
  const roleOptions = [
    { value: "admin", label: "管理员" },
    { value: "user", label: "普通用户" },
  ];

  useEffect(() => {
    const fetchEventDetail = async () => {
      if (isEdit && id) {
        try {
          setLoading(true);
          const eventDetail = await getEventDetail(id);

          // 处理时间字段的转换 - 将字符串转换为 dayjs 对象
          const formData = {
            ...eventDetail,
            timeRange:
              eventDetail.startTime && eventDetail.endTime
                ? [dayjs(eventDetail.startTime), dayjs(eventDetail.endTime)]
                : null,
          };

          form.setFieldsValue(formData);
        } catch (error) {
          showApiError(error, "获取事件详情失败");
          // 获取失败时返回事件列表
          navigate("/");
        } finally {
          setLoading(false);
        }
      }
    };

    fetchEventDetail();
  }, [form, isEdit, id, navigate]);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // 处理时间格式转换
      const [startTime, endTime] = values.timeRange || [];
      const submitData = {
        ...values,
        startTime: startTime
          ? dayjs(startTime).format("YYYY-MM-DD HH:mm:ss")
          : null,
        endTime: endTime ? dayjs(endTime).format("YYYY-MM-DD HH:mm:ss") : null,
      };
      delete submitData.timeRange;

      if (isEdit) {
        // 调用更新事件的API
        await updateEvent(id, submitData);
        message.success("事件更新成功！");
      } else {
        // 调用创建事件的API
        await createEvent(submitData);
        message.success("事件创建成功！");
      }

      navigate("/"); // 返回事件列表页
    } catch (error) {
      showApiError(error, isEdit ? "更新事件失败" : "创建事件失败");
    } finally {
      setLoading(false);
    }
  };

  // 编辑模式下等待数据加载完成
  if (isEdit && loading) {
    return (
      <Card
        title="编辑事件"
        className="create-event-card"
        style={{ textAlign: "center", padding: "50px" }}
      >
        <Spin size="large" tip="加载事件详情中..." />
      </Card>
    );
  }

  const handleGoBack = () => {
    navigate("/");
  };

  return (
    <Card
      title={
        <Space>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={handleGoBack}
          >
            返回列表
          </Button>
          <span>{isEdit ? "编辑事件" : "创建事件"}</span>
        </Space>
      }
      className="create-event-card"
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        autoComplete="off"
        initialValues={{
          is_display: true,
          visibleLocations: ["SH", "SZ"], // 默认全部地区可见
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
          label="事件时间"
          name="timeRange"
          rules={[{ required: true, message: "请选择事件时间" }]}
        >
          <TimeRangeSelector placeholder={["事件开始时间", "事件结束时间"]} />
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
