import React, { useState, useEffect, useCallback, useRef } from "react";
import { Table, Card, Input, Button, Space, message, Select } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import "./style.scss";

const { Option } = Select;

const ActivityDetails = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });
  const [searchParams, setSearchParams] = useState({
    username: "",
    eventName: "",
    activityName: "",
  });

  // 使用useRef存储当前分页状态，避免依赖循环
  const paginationRef = useRef({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 模拟数据 - 后续需要替换为真实API
  const mockData = [
    {
      id: 1,
      username: "张三",
      eventName: "年度技术分享大会",
      activityName: "开场致辞",
      reviewer: "孙雄鹰",
      donationAmount: 500.0,
    },
    {
      id: 2,
      username: "李四",
      eventName: "年度技术分享大会",
      activityName: "技术演讲",
      reviewer: "张如诚",
      donationAmount: 300.0,
    },
    {
      id: 3,
      username: "王五",
      eventName: "团队建设活动",
      activityName: "户外拓展",
      reviewer: "xu jin",
      donationAmount: 800.0,
    },
    {
      id: 4,
      username: "赵六",
      eventName: "公益活动",
      activityName: "爱心捐赠",
      reviewer: "孙雄鹰",
      donationAmount: 1200.0,
    },
    {
      id: 5,
      username: "钱七",
      eventName: "年度技术分享大会",
      activityName: "圆桌讨论",
      reviewer: "张如诚",
      donationAmount: 600.0,
    },
  ];

  // 获取活动明细数据
  const fetchData = useCallback(
    async (params = {}) => {
      try {
        setLoading(true);

        // 模拟API调用
        // const requestParams = {
        //   page: params.current || paginationRef.current.current,
        //   pageSize: params.pageSize || paginationRef.current.pageSize,
        //   ...searchParams,
        //   ...params,
        // };

        // 模拟数据处理
        let filteredData = [...mockData];

        // 应用搜索筛选
        if (searchParams.username) {
          filteredData = filteredData.filter((item) =>
            item.username.includes(searchParams.username)
          );
        }
        if (searchParams.eventName) {
          filteredData = filteredData.filter((item) =>
            item.eventName.includes(searchParams.eventName)
          );
        }
        if (searchParams.activityName) {
          filteredData = filteredData.filter((item) =>
            item.activityName.includes(searchParams.activityName)
          );
        }

        // 应用排序
        if (params.sortField === "donationAmount") {
          filteredData.sort((a, b) => {
            if (params.sortOrder === "ascend") {
              return a.donationAmount - b.donationAmount;
            } else {
              return b.donationAmount - a.donationAmount;
            }
          });
        }

        // 模拟分页
        const current = params.current || paginationRef.current.current;
        const pageSize = params.pageSize || paginationRef.current.pageSize;
        const start = (current - 1) * pageSize;
        const end = start + pageSize;
        const pageData = filteredData.slice(start, end);

        setData(pageData);

        const newPagination = {
          current: current,
          pageSize: pageSize,
          total: filteredData.length,
        };

        // 同时更新ref和state
        paginationRef.current = newPagination;
        setPagination(newPagination);
      } catch (error) {
        message.error(`获取活动明细失败: ${error.message || "未知错误"}`);
        console.warn("活动明细请求失败:", error);
      } finally {
        setLoading(false);
      }
    },
    [searchParams]
  );

  useEffect(() => {
    fetchData({ current: 1, pageSize: 10 });
  }, [fetchData]);

  // 表格列配置
  const columns = [
    {
      title: "序号",
      key: "index",
      width: "8%",
      render: (_, __, index) => {
        const current = pagination.current || 1;
        const pageSize = pagination.pageSize || 10;
        return (current - 1) * pageSize + index + 1;
      },
    },
    {
      title: "用户名",
      dataIndex: "username",
      key: "username",
      width: "15%",
    },
    {
      title: "事件名",
      dataIndex: "eventName",
      key: "eventName",
      width: "20%",
    },
    {
      title: "活动名",
      dataIndex: "activityName",
      key: "activityName",
      width: "20%",
    },
    {
      title: "Reviewer",
      dataIndex: "reviewer",
      key: "reviewer",
      width: "15%",
    },
    {
      title: "捐献金额",
      dataIndex: "donationAmount",
      key: "donationAmount",
      width: "12%",
      sorter: true,
      render: (amount) => `¥${amount.toFixed(2)}`,
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

  // 处理搜索输入变化
  const handleUsernameChange = useCallback((e) => {
    setSearchParams((prev) => ({ ...prev, username: e.target.value }));
  }, []);

  const handleEventNameChange = useCallback((e) => {
    setSearchParams((prev) => ({ ...prev, eventName: e.target.value }));
  }, []);

  const handleActivityNameChange = useCallback((e) => {
    setSearchParams((prev) => ({ ...prev, activityName: e.target.value }));
  }, []);

  // 重置筛选条件
  const handleResetFilters = useCallback(() => {
    setSearchParams({
      username: "",
      eventName: "",
      activityName: "",
    });
  }, []);

  return (
    <div className="activity-details-container">
      <Card>
        <div className="table-toolbar">
          <div className="search-area">
            <Space size="middle" wrap>
              <Input
                placeholder="搜索用户名"
                value={searchParams.username}
                onChange={handleUsernameChange}
                style={{ width: 150 }}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                allowClear
              />
              <Input
                placeholder="搜索事件名"
                value={searchParams.eventName}
                onChange={handleEventNameChange}
                style={{ width: 150 }}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                allowClear
              />
              <Input
                placeholder="搜索活动名"
                value={searchParams.activityName}
                onChange={handleActivityNameChange}
                style={{ width: 150 }}
                onPressEnter={handleSearch}
                prefix={<SearchOutlined />}
                allowClear
              />
              <Button type="primary" onClick={handleSearch}>
                搜索
              </Button>
              <Button onClick={handleResetFilters} icon={<ReloadOutlined />}>
                重置
              </Button>
            </Space>
          </div>
        </div>
        <Table
          columns={columns}
          dataSource={data}
          pagination={pagination}
          loading={loading}
          onChange={handleTableChange}
          rowKey="id"
          scroll={{ x: 800 }}
        />
      </Card>
    </div>
  );
};

export default ActivityDetails;
