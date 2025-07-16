import React, { useState, useEffect, useCallback, useRef } from "react";
import {
  Table,
  Card,
  Input,
  Button,
  Space,
  message,
  Modal,
  Tag,
  Select,
  Form,
} from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import {
  getUserList,
  deleteUsers,
  updateUserReviewer,
} from "../../services/user";
import { LOCATION_OPTIONS } from "../../config/api";
import "./style.scss";

const { confirm } = Modal;
const { Option } = Select;

const UserList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [searchParams, setSearchParams] = useState({
    username: "",
    role: "",
    location: "",
  });
  const [reviewerModalVisible, setReviewerModalVisible] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedReviewer, setSelectedReviewer] = useState(null);
  const [userSearchResults, setUserSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [reviewerForm] = Form.useForm();

  // 角色选项
  const roleOptions = [
    { value: "", label: "全部角色" },
    { value: "admin", label: "管理员" },
    { value: "user", label: "普通用户" },
  ];

  // 地区选项 (添加"全部地区"选项)
  const locationFilterOptions = [
    { value: "", label: "全部地区" },
    ...LOCATION_OPTIONS,
  ];

  // 使用useRef存储当前分页状态，避免依赖循环
  const paginationRef = useRef({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 获取用户列表数据
  const fetchData = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);

        const requestParams = {
          page: params.current || paginationRef.current.current,
          pageSize: params.pageSize || paginationRef.current.pageSize,
          ...searchParams,
          ...params,
        };

        const response = await getUserList(requestParams);
        setData(response.data);

        const newPagination = {
          current: response.page,
          pageSize: response.pageSize,
          total: response.total,
        };

        // 同时更新ref和state
        paginationRef.current = newPagination;
        setPagination(newPagination);
      } catch (error) {
        // 根据错误类型显示不同的提示，但不自动登出
        if (error.code === 403) {
          message.warning("权限不足：需要管理员权限才能查看用户列表");
        } else if (error.code === 401) {
          message.warning("认证失败，请检查登录状态或手动重新登录");
        } else {
          message.error(`获取用户列表失败: ${error.message || "未知错误"}`);
        }
        console.warn("用户列表请求失败:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchParams]
  );

  useEffect(() => {
    fetchData({ current: 1, pageSize: 10 });
  }, [fetchData]);

  // 处理用户详情跳转
  const handleUserDetail = useCallback(
    (userId) => {
      navigate(`/users/${userId}`);
    },
    [navigate]
  );

  // 搜索用户
  const handleUserSearch = useCallback(async (value) => {
    if (!value || value.trim().length < 2) {
      setUserSearchResults([]);
      return;
    }

    try {
      setSearchLoading(true);
      const response = await getUserList({
        page: 1,
        pageSize: 10,
        username: value.trim(),
      });
      setUserSearchResults(response.data);
    } catch (error) {
      message.error("搜索用户失败");
      setUserSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  // 处理设置reviewer
  const handleSetReviewer = useCallback(
    (user) => {
      setCurrentUser(user);
      setSelectedReviewer(null);
      setUserSearchResults([]);
      reviewerForm.resetFields();
      setReviewerModalVisible(true);
    },
    [reviewerForm]
  );

  // 保存reviewer设置
  const handleSaveReviewer = async () => {
    if (!selectedReviewer) {
      message.warning("请选择一个审核人");
      return;
    }

    try {
      await updateUserReviewer(currentUser.id, selectedReviewer.id);
      message.success("设置审核人成功");
      setReviewerModalVisible(false);
      fetchData(); // 刷新列表
    } catch (error) {
      if (error.code === 400) {
        if (error.message.includes("not found")) {
          message.error("用户或审核人不存在");
        } else {
          message.error(error.message || "设置审核人失败");
        }
      } else {
        message.error("设置审核人失败");
      }
    }
  };

  // 表格列配置
  const columns = [
    {
      title: "用户名称",
      dataIndex: "username",
      sorter: true,
      width: "15%",
    },
    {
      title: "用户角色",
      dataIndex: "role",
      width: "12%",
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role === "admin" ? "管理员" : "普通用户"}
        </Tag>
      ),
    },
    {
      title: "所在地区",
      dataIndex: "location",
      width: "10%",
    },
    {
      title: "审核人",
      dataIndex: "reviewer",
      width: "15%",
      render: (reviewer, record) => (
        <Space>
          <span>{reviewer || "未设置"}</span>
          <Button
            type="link"
            size="small"
            icon={<EditOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              handleSetReviewer(record);
            }}
          >
            设置
          </Button>
        </Space>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      sorter: true,
      width: "15%",
    },
    {
      title: "参与事件数量",
      dataIndex: "eventCount",
      sorter: true,
      width: "10%",
    },
    {
      title: "参与活动数量",
      dataIndex: "activityCount",
      sorter: true,
      width: "10%",
    },
    {
      title: "操作",
      key: "action",
      width: "13%",
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" onClick={() => handleUserDetail(record.id)}>
            查看详情
          </Button>
        </Space>
      ),
    },
  ];

  // 处理表格变化（排序、筛选、分页）
  const handleTableChange = useCallback(
    (newPagination, filters, sorter) => {
      fetchData({
        current: newPagination.current,
        pageSize: newPagination.pageSize,
        sortField: sorter.field,
        sortOrder: sorter.order,
        ...filters,
      });
    },
    [fetchData]
  );

  // 处理搜索
  const handleSearch = useCallback(() => {
    setPagination((prev) => ({ ...prev, current: 1 }));
    fetchData({ current: 1 });
  }, [fetchData]);

  // 处理批量删除
  const handleBatchDelete = useCallback(() => {
    if (!selectedRowKeys.length) {
      message.warning("请选择要删除的用户");
      return;
    }

    confirm({
      title: "确定要删除选中的用户吗？",
      icon: <ExclamationCircleOutlined />,
      content: "此操作不可恢复",
      onOk: async () => {
        try {
          await deleteUsers(selectedRowKeys);
          message.success("删除成功");
          setSelectedRowKeys([]);
          fetchData();
        } catch (error) {
          message.error("删除失败");
        }
      },
    });
  }, [selectedRowKeys, fetchData]);

  // 处理搜索输入变化
  const handleSearchInputChange = useCallback((e) => {
    setSearchParams((prev) => ({ ...prev, username: e.target.value }));
  }, []);

  // 处理角色筛选变化
  const handleRoleChange = useCallback((value) => {
    setSearchParams((prev) => ({ ...prev, role: value }));
  }, []);

  // 处理地区筛选变化
  const handleLocationChange = useCallback((value) => {
    setSearchParams((prev) => ({ ...prev, location: value }));
  }, []);

  // 重置筛选条件
  const handleResetFilters = useCallback(() => {
    setSearchParams({
      username: "",
      role: "",
      location: "",
    });
  }, []);

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div className="user-list-container">
      <Card>
        <div className="table-toolbar">
          <div className="search-area">
            <Space size="middle" wrap className="search-controls">
              <Input
                placeholder="搜索用户名"
                value={searchParams.username}
                onChange={handleSearchInputChange}
                style={{ width: 200 }}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                allowClear
                className="search-input"
              />
              <Select
                placeholder="选择角色"
                value={searchParams.role}
                onChange={handleRoleChange}
                style={{ width: 120 }}
                allowClear
                className="search-select"
              >
                {roleOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <Select
                placeholder="选择地区"
                value={searchParams.location}
                onChange={handleLocationChange}
                style={{ width: 120 }}
                allowClear
                className="search-select"
              >
                {locationFilterOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <Space className="search-buttons">
                <Button type="primary" onClick={handleSearch}>
                  搜索
                </Button>
                <Button onClick={handleResetFilters}>重置</Button>
              </Space>
            </Space>
          </div>
          <div className="action-area">
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleBatchDelete}
              disabled={!selectedRowKeys.length}
            >
              批量删除
            </Button>
          </div>
        </div>
        <Table
          rowSelection={rowSelection}
          columns={columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          rowKey="id"
          onRow={(record) => ({
            onClick: () => handleUserDetail(record.id),
            style: { cursor: "pointer" },
          })}
        />

        {/* 移动端卡片视图 */}
        <div className="mobile-card-view">
          {data.map((user) => (
            <div
              key={user.id}
              className="user-card"
              onClick={() => handleUserDetail(user.id)}
            >
              <div className="user-header">
                <span className="user-name">{user.username}</span>
                <Tag
                  className="user-role"
                  color={user.role === "admin" ? "red" : "blue"}
                >
                  {user.role === "admin" ? "管理员" : "普通用户"}
                </Tag>
              </div>
              <div className="user-info">
                <div className="info-item">
                  <strong>地区：</strong>
                  {user.location}
                </div>
                <div className="info-item">
                  <strong>审核人：</strong>
                  {user.reviewer || "未设置"}
                </div>
                <div className="info-item">
                  <strong>创建时间：</strong>
                  {user.createTime}
                </div>
                <div className="info-item">
                  <strong>参与事件：</strong>
                  {user.eventCount}
                </div>
              </div>
              <div className="user-actions">
                <Button
                  type="link"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserDetail(user.id);
                  }}
                >
                  查看详情
                </Button>
                <Button
                  type="link"
                  size="small"
                  icon={<EditOutlined />}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSetReviewer(user);
                  }}
                >
                  设置审核人
                </Button>
              </div>
            </div>
          ))}

          {/* 移动端分页 */}
          {data.length > 0 && (
            <div
              style={{
                textAlign: "center",
                marginTop: "16px",
                padding: "16px 0",
              }}
            >
              <Button
                disabled={pagination.current === 1}
                onClick={() =>
                  handleTableChange({
                    ...pagination,
                    current: pagination.current - 1,
                  })
                }
                style={{ marginRight: "8px" }}
              >
                上一页
              </Button>
              <span style={{ margin: "0 16px", fontSize: "14px" }}>
                {pagination.current} /{" "}
                {Math.ceil(pagination.total / pagination.pageSize)}
              </span>
              <Button
                disabled={
                  pagination.current >=
                  Math.ceil(pagination.total / pagination.pageSize)
                }
                onClick={() =>
                  handleTableChange({
                    ...pagination,
                    current: pagination.current + 1,
                  })
                }
              >
                下一页
              </Button>
            </div>
          )}
        </div>
      </Card>

      {/* 设置审核人弹窗 */}
      <Modal
        title="设置审核人"
        open={reviewerModalVisible}
        onOk={handleSaveReviewer}
        onCancel={() => setReviewerModalVisible(false)}
        destroyOnClose
        width={600}
      >
        <Form form={reviewerForm} layout="vertical">
          <div style={{ marginBottom: 16 }}>
            <strong>用户：</strong>
            {currentUser?.username}
          </div>

          <Form.Item label="搜索用户" required>
            <Input.Search
              placeholder="输入用户名搜索（至少2个字符）"
              onSearch={handleUserSearch}
              onChange={(e) => handleUserSearch(e.target.value)}
              loading={searchLoading}
              allowClear
            />
          </Form.Item>

          {userSearchResults.length > 0 && (
            <Form.Item label="选择审核人">
              <div
                style={{
                  maxHeight: 200,
                  overflow: "auto",
                  border: "1px solid #d9d9d9",
                  borderRadius: 4,
                }}
              >
                {userSearchResults.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => setSelectedReviewer(user)}
                    style={{
                      padding: "8px 12px",
                      cursor: "pointer",
                      borderBottom: "1px solid #f0f0f0",
                      backgroundColor:
                        selectedReviewer?.id === user.id
                          ? "#e6f7ff"
                          : "transparent",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      if (selectedReviewer?.id !== user.id) {
                        e.target.style.backgroundColor = "#f5f5f5";
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedReviewer?.id !== user.id) {
                        e.target.style.backgroundColor = "transparent";
                      }
                    }}
                  >
                    <div style={{ fontWeight: "bold" }}>{user.username}</div>
                    <div style={{ fontSize: "12px", color: "#666" }}>
                      {user.role === "admin" ? "管理员" : "普通用户"} ·{" "}
                      {user.location}
                    </div>
                  </div>
                ))}
              </div>
            </Form.Item>
          )}

          {selectedReviewer && (
            <Form.Item label="已选择的审核人">
              <div
                style={{
                  padding: "8px 12px",
                  backgroundColor: "#f6ffed",
                  border: "1px solid #b7eb8f",
                  borderRadius: 4,
                }}
              >
                <div style={{ fontWeight: "bold", color: "#52c41a" }}>
                  ✓ {selectedReviewer.username}
                </div>
                <div style={{ fontSize: "12px", color: "#666" }}>
                  {selectedReviewer.role === "admin" ? "管理员" : "普通用户"} ·{" "}
                  {selectedReviewer.location}
                </div>
              </div>
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserList;
