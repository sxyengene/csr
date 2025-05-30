import React, { useState, useEffect, useCallback } from "react";
import { Table, Card, Input, Button, Space, message, Modal, Tag } from "antd";
import {
  SearchOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getUserList, deleteUsers } from "../../services/user";
import "./style.scss";

const { confirm } = Modal;

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
  });

  // 获取用户列表数据
  const fetchData = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);
        const response = await getUserList({
          page: params.current || pagination.current,
          pageSize: params.pageSize || pagination.pageSize,
          ...searchParams,
          ...params,
        });
        setData(response.data);
        setPagination({
          ...pagination,
          total: response.total,
        });
      } catch (error) {
        message.error("获取用户列表失败");
      } finally {
        setLoading(false);
      }
    },
    [pagination.current, pagination.pageSize, searchParams]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 处理用户详情跳转
  const handleUserDetail = useCallback(
    (userId) => {
      navigate(`/users/${userId}`);
    },
    [navigate]
  );

  // 表格列配置
  const columns = [
    {
      title: "用户名称",
      dataIndex: "username",
      sorter: true,
      width: "20%",
    },
    {
      title: "用户角色",
      dataIndex: "role",
      width: "15%",
      render: (role) => (
        <Tag color={role === "admin" ? "red" : "blue"}>
          {role === "admin" ? "管理员" : "普通用户"}
        </Tag>
      ),
    },
    {
      title: "创建时间",
      dataIndex: "createTime",
      sorter: true,
      width: "20%",
    },
    {
      title: "参与事件数量",
      dataIndex: "eventCount",
      sorter: true,
      width: "15%",
    },
    {
      title: "参与活动数量",
      dataIndex: "activityCount",
      sorter: true,
      width: "15%",
    },
    {
      title: "操作",
      key: "action",
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

  const rowSelection = {
    selectedRowKeys,
    onChange: setSelectedRowKeys,
  };

  return (
    <div className="user-list-container">
      <Card>
        <div className="table-toolbar">
          <div className="search-area">
            <Input
              placeholder="搜索用户名"
              value={searchParams.username}
              onChange={handleSearchInputChange}
              style={{ width: 200, marginRight: 16 }}
              onPressEnter={handleSearch}
              prefix={<SearchOutlined />}
            />
            <Button type="primary" onClick={handleSearch}>
              搜索
            </Button>
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
    </div>
  );
};

export default UserList;
