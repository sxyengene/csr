import React, { useEffect, useState } from "react";
import {
  Form,
  Input,
  Button,
  Card,
  message,
  Select,
  Checkbox,
  InputNumber,
} from "antd";
import { useNavigate, useParams } from "react-router-dom";
import dayjs from "dayjs";
import {
  createActivity,
  updateActivity,
  getActivityDetail,
} from "../../services/activity";
import TimeRangeSelector from "../../components/TimeRangeSelector";
import styles from "./index.module.scss";
import { get } from "../../utils/request";
const { TextArea } = Input;
const { Option } = Select;

const ActivityCreate = () => {
  const navigate = useNavigate();
  const { eventId, activityId } = useParams();
  const [form] = Form.useForm();
  const isEdit = !!activityId;

  // 地区选项 - 按项目要求只保留上海和深圳
  const locationOptions = [
    { value: "上海", label: "上海" },
    { value: "深圳", label: "深圳" },
  ];

  // 角色选项 - 按项目要求保持admin/user格式
  const roleOptions = [
    { value: "admin", label: "管理员" },
    { value: "user", label: "普通用户" },
  ];

  // 模板相关
  const [templateList, setTemplateList] = useState([]);
  const [templateLoading, setTemplateLoading] = useState(false);

  // 获取模板列表
  const fetchTemplates = async (name = "") => {
    setTemplateLoading(true);
    try {
      const res = await get("/api/templates", name ? { name } : {});
      setTemplateList(res.data || []);
    } catch (e) {
      message.error("获取模板列表失败");
    } finally {
      setTemplateLoading(false);
    }
  };

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    if (isEdit && activityId) {
      // 从API获取活动详情
      const fetchActivityDetail = async () => {
        try {
          const activityData = await getActivityDetail(activityId);

          // 转换为表单需要的格式
          const formData = {
            ...activityData,
            timeRange: [
              dayjs(activityData.startTime),
              dayjs(activityData.endTime),
            ],
            templateId: activityData.templateId, // 回显模板id
          };

          form.setFieldsValue(formData);
        } catch (error) {
          message.error("获取活动详情失败");
          console.error("获取活动详情失败:", error);
        }
      };

      fetchActivityDetail();
    }
  }, [form, isEdit, activityId]);

  const handleSubmit = async (values) => {
    try {
      const [startTime, endTime] = values.timeRange;

      // 验证时间逻辑
      if (endTime.isBefore(startTime)) {
        message.error("结束时间不能早于开始时间");
        return;
      }

      const activityData = {
        ...values,
        eventId: parseInt(eventId),
        startTime: startTime.format("YYYY-MM-DD HH:mm"), // 保持原格式
        endTime: endTime.format("YYYY-MM-DD HH:mm"), // 保持原格式
        templateId: values.templateId, // 保证带上模板id
      };
      delete activityData.timeRange;

      if (isEdit) {
        // 调用更新活动API
        await updateActivity(activityId, activityData);
        message.success("更新活动成功");
      } else {
        // 调用创建活动API
        const response = await createActivity(activityData);
        console.log("创建活动响应:", response);
        message.success("创建活动成功");
      }

      // 返回事件列表页面
      navigate("/");
    } catch (error) {
      console.error("活动操作失败:", error);

      // 处理特定的错误消息
      let errorMessage = isEdit ? "更新活动失败" : "创建活动失败";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }

      message.error(errorMessage);
    }
  };

  const handleCancel = () => {
    navigate("/");
  };

  return (
    <div className={styles.container}>
      <Card title={isEdit ? "编辑活动" : "创建活动"} className={styles.card}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            visibleLocations: ["上海", "深圳"], // 默认全部地区可见
            visibleRoles: ["admin", "user"], // 默认全部角色可见
            // duration 和 icon 为空，不设默认值
          }}
        >
          {/* 新增模板选择 */}
          <Form.Item
            name="templateId"
            label="活动类型"
            rules={[{ required: true, message: "请选择活动类型" }]}
          >
            <Select
              placeholder="请选择活动类型"
              loading={templateLoading}
              showSearch
              filterOption={false}
              onSearch={fetchTemplates}
              allowClear
            >
              {templateList.map((tpl) => (
                <Option key={tpl.id} value={tpl.id}>
                  {tpl.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="活动名称"
            rules={[
              { required: true, message: "请输入活动名称" },
              { max: 45, message: "活动名称不能超过45个字符" },
            ]}
          >
            <Input placeholder="请输入活动名称" maxLength={45} showCount />
          </Form.Item>

          <Form.Item
            name="icon"
            label="活动图标"
            rules={[{ required: true, message: "请输入活动图标" }]}
          >
            <Input placeholder="请输入图标标识符，如：cleanup-icon" />
          </Form.Item>

          <Form.Item
            name="duration"
            label="活动时长（小时）"
            rules={[
              { required: false, message: "请输入活动时长" },
              {
                type: "number",
                min: 0,
                max: 168,
                message: "请输入0-168之间的有效数字",
              },
              {
                validator: (_, value) => {
                  if (value === null || value === undefined || value === "") {
                    return Promise.resolve();
                  }
                  if (value >= 0 && value <= 168 && Number(value) % 0.5 === 0) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("活动时长请输入0.5的倍数"));
                },
              },
            ]}
          >
            <InputNumber
              placeholder="请输入活动时长"
              min={0}
              max={168} // 一周的小时数
              step={0.5} // 支持0.5小时的精度
              style={{ width: "100%" }}
              addonAfter="小时"
              formatter={(value) => (value ? `${value}` : "")}
            />
          </Form.Item>

          <Form.Item
            name="timeRange"
            label="活动时间"
            rules={[{ required: true, message: "请选择活动时间" }]}
          >
            <TimeRangeSelector placeholder={["活动开始时间", "活动结束时间"]} />
          </Form.Item>

          <Form.Item
            name="description"
            label="活动描述"
            rules={[
              { required: true, message: "请输入活动描述" },
              { max: 1000, message: "活动描述不能超过1000个字符" },
            ]}
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
            rules={[
              { required: true, message: "请选择可见地区" },
              { type: "array", min: 1, message: "至少选择一个地区" },
            ]}
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
            rules={[
              { required: true, message: "请选择可见角色" },
              { type: "array", min: 1, message: "至少选择一个角色" },
            ]}
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
