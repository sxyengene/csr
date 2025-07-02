import React, { useState, useEffect, useCallback } from "react";
import {
  Card,
  Descriptions,
  Button,
  message,
  Modal,
  Form,
  Input,
  Select,
  Tabs,
  Table,
  Tag,
  Space,
} from "antd";
import { useParams, useNavigate } from "react-router-dom";
import {
  getUserDetail,
  updateUser,
  resetUserPassword,
  getUserEvents,
  getUserActivities,
} from "../../../services/user";
import { LOCATION_OPTIONS } from "../../../config/api";
import "./style.scss";

const { TabPane } = Tabs;
const { Option } = Select;

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [resetModalVisible, setResetModalVisible] = useState(false);
  const [events, setEvents] = useState([]);
  const [activities, setActivities] = useState([]);
  const [form] = Form.useForm();
  const [resetForm] = Form.useForm();

  // 获取用户详情
  const fetchUserDetail = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getUserDetail(id);
      setUserInfo(data);
    } catch (error) {
      message.error("获取用户信息失败");
    } finally {
      setLoading(false);
    }
  }, [id]);

  // 获取用户事件记录
  const fetchUserEvents = useCallback(async () => {
    try {
      const data = await getUserEvents(id);
      setEvents(data);
    } catch (error) {
      message.error("获取事件记录失败");
    }
  }, [id]);

  // 获取用户活动记录
  const fetchUserActivities = useCallback(async () => {
    try {
      const data = await getUserActivities(id);
      setActivities(data);
    } catch (error) {
      message.error("获取活动记录失败");
    }
  }, [id]);

  useEffect(() => {
    fetchUserDetail();
    fetchUserEvents();
    fetchUserActivities();
  }, [fetchUserDetail, fetchUserEvents, fetchUserActivities]);

  // 处理用户信息更新
  const handleUpdate = async (values) => {
    try {
      await updateUser(id, values);
      message.success("更新成功");
      setEditModalVisible(false);
      fetchUserDetail();
    } catch (error) {
      message.error("更新失败");
    }
  };

  // 处理密码重置
  const handleResetPassword = async (values) => {
    try {
      await resetUserPassword(id, values.password);
      message.success("密码重置成功");
      setResetModalVisible(false);
      resetForm.resetFields();
    } catch (error) {
      message.error("密码重置失败");
    }
  };

  // 处理活动详情跳转
  const handleActivityDetail = useCallback(
    (activityId) => {
      navigate(`/activities/${activityId}`);
    },
    [navigate]
  );

  // 事件记录表格列配置
  const eventColumns = [
    {
      title: "事件名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "事件类型",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "参与时长",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      render: (status) => (
        <Tag color={status === "active" ? "green" : "default"}>
          {status === "active" ? "进行中" : "已结束"}
        </Tag>
      ),
    },
  ];

  // 活动记录表格列配置
  const activityColumns = [
    {
      title: "活动名称",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "所属事件",
      dataIndex: "eventName",
      key: "eventName",
    },
    {
      title: "参与时长",
      dataIndex: "duration",
      key: "duration",
    },
    {
      title: "操作",
      key: "action",
      render: (_, record) => (
        <Button
          type="link"
          onClick={(e) => {
            e.stopPropagation();
            handleActivityDetail(record.id);
          }}
        >
          查看详情
        </Button>
      ),
    },
  ];

  // 处理编辑按钮点击
  const handleEditClick = useCallback(() => {
    form.setFieldsValue(userInfo);
    setEditModalVisible(true);
  }, [form, userInfo]);

  return (
    <div className="user-detail-container">
      <Card
        title="用户详情"
        extra={
          <Space>
            <Button type="primary" onClick={handleEditClick}>
              编辑信息
            </Button>
            <Button onClick={() => setResetModalVisible(true)}>重置密码</Button>
            <Button onClick={() => navigate("/users")}>返回列表</Button>
          </Space>
        }
        loading={loading}
      >
        <Descriptions bordered>
          <Descriptions.Item label="用户名">
            {userInfo?.username}
          </Descriptions.Item>
          <Descriptions.Item label="用户角色">
            <Tag color={userInfo?.role === "admin" ? "red" : "blue"}>
              {userInfo?.role === "admin" ? "管理员" : "普通用户"}
            </Tag>
          </Descriptions.Item>
          <Descriptions.Item label="所在地区">
            {userInfo?.location}
          </Descriptions.Item>
          <Descriptions.Item label="创建时间">
            {userInfo?.createTime}
          </Descriptions.Item>
          <Descriptions.Item label="参与事件数">
            {userInfo?.eventCount}
          </Descriptions.Item>
          <Descriptions.Item label="参与活动数">
            {userInfo?.activityCount}
          </Descriptions.Item>
        </Descriptions>

        <Tabs defaultActiveKey="events" className="detail-tabs">
          <TabPane tab="事件记录" key="events">
            <Table
              columns={eventColumns}
              dataSource={events}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
          <TabPane tab="活动记录" key="activities">
            <Table
              columns={activityColumns}
              dataSource={activities}
              rowKey="id"
              pagination={false}
            />
          </TabPane>
        </Tabs>
      </Card>

      {/* 编辑用户信息弹窗 */}
      <Modal
        title="编辑用户信息"
        open={editModalVisible}
        onOk={() => form.submit()}
        onCancel={() => setEditModalVisible(false)}
        destroyOnClose
      >
        <Form form={form} onFinish={handleUpdate} layout="vertical">
          <Form.Item
            name="username"
            label="用户名"
            rules={[{ required: true, message: "请输入用户名" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="role"
            label="用户角色"
            rules={[{ required: true, message: "请选择用户角色" }]}
          >
            <Select>
              <Option value="admin">管理员</Option>
              <Option value="user">普通用户</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="location"
            label="所在地区"
            rules={[{ required: true, message: "请选择所在地区" }]}
            initialValue="SH"
          >
            <Select>
              {LOCATION_OPTIONS.map((option) => (
                <Option key={option.value} value={option.value}>
                  {option.label}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      {/* 重置密码弹窗 */}
      <Modal
        title="重置密码"
        open={resetModalVisible}
        onOk={() => resetForm.submit()}
        onCancel={() => setResetModalVisible(false)}
        destroyOnClose
      >
        <Form form={resetForm} onFinish={handleResetPassword} layout="vertical">
          <Form.Item
            name="password"
            label="新密码"
            rules={[
              { required: true, message: "请输入新密码" },
              { min: 6, message: "密码长度不能小于6位" },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            name="confirmPassword"
            label="确认密码"
            dependencies={["password"]}
            rules={[
              { required: true, message: "请确认新密码" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("两次输入的密码不一致"));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserDetail;
