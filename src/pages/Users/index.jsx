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
  const [selectedReviewer, setSelectedReviewer] = useState("");

  // reviewer选项
  const reviewerOptions = [
    { value: "孙雄鹰", label: "孙雄鹰" },
    { value: "张如诚", label: "张如诚" },
    { value: "xu jin", label: "xu jin" },
  ];

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

  // 处理设置reviewer
  const handleSetReviewer = useCallback((user) => {
    setCurrentUser(user);
    setSelectedReviewer(user.reviewer || "");
    setReviewerModalVisible(true);
  }, []);

  // 保存reviewer设置
  const handleSaveReviewer = async () => {
    try {
      await updateUserReviewer(currentUser.id, selectedReviewer);
      message.success("设置成功");
      setReviewerModalVisible(false);
      fetchData();
    } catch (error) {
      message.error("设置失败");
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
      title: "Reviewer",
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
            <Space size="middle" wrap>
              <Input
                placeholder="搜索用户名"
                value={searchParams.username}
                onChange={handleSearchInputChange}
                style={{ width: 200 }}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                allowClear
              />
              <Select
                placeholder="选择角色"
                value={searchParams.role}
                onChange={handleRoleChange}
                style={{ width: 120 }}
                allowClear
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
              >
                {locationFilterOptions.map((option) => (
                  <Option key={option.value} value={option.value}>
                    {option.label}
                  </Option>
                ))}
              </Select>
              <Button type="primary" onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={handleResetFilters}>重置</Button>
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
      </Card>

      {/* 设置Reviewer弹窗 */}
      <Modal
        title="设置Reviewer"
        open={reviewerModalVisible}
        onOk={handleSaveReviewer}
        onCancel={() => setReviewerModalVisible(false)}
        destroyOnClose
      >
        <div style={{ marginBottom: 16 }}>
          <strong>用户：</strong>
          {currentUser?.username}
        </div>
        <Select
          placeholder="请选择Reviewer"
          value={selectedReviewer}
          onChange={setSelectedReviewer}
          style={{ width: "100%" }}
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
        >
          <Option value="">无</Option>
          {reviewerOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      </Modal>
    </div>
  );
};

export default UserList;
