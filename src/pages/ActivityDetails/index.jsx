import React, { useState, useEffect, useCallback, useRef } from "react";
import { Table, Card, Input, Button, Space, message, Tabs } from "antd";
import { SearchOutlined, ReloadOutlined } from "@ant-design/icons";
import { getEventList } from "../../services/event";
import "./style.scss";

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
  const [eventData, setEventData] = useState([]);
  const [eventLoading, setEventLoading] = useState(false);
  const [eventSearchParams, setEventSearchParams] = useState({
    eventName: "",
  });
  const [eventPagination, setEventPagination] = useState({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 使用useRef存储当前分页状态，避免依赖循环
  const paginationRef = useRef({
    current: 1,
    pageSize: 10,
    total: 0,
  });

  // 使用useRef存储事件分页状态，避免依赖循环
  const eventPaginationRef = useRef({
    current: 1,
    pageSize: 10,
    total: 0,
  });

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

  // 获取事件统计数据
  const fetchEventData = useCallback(
    async (params = {}) => {
      try {
        setEventLoading(true);

        const requestParams = {
          page: params.current || eventPaginationRef.current.current,
          pageSize: params.pageSize || eventPaginationRef.current.pageSize,
          needsTotal: true, // 获取统计数据
          eventName: eventSearchParams.eventName,
          ...params,
        };

        const response = await getEventList(requestParams);

        // 处理数据，为每个事件和活动创建表格行
        const tableData = [];
        let index = 1;

        response.data.forEach((event) => {
          // 添加事件行
          tableData.push({
            id: `event-${event.id}`,
            rowType: "event",
            index: index++,
            eventName: event.name,
            activityName: "",
            activityParticipants: "",
            activityTotalTime: "",
            eventParticipants: event.totalParticipants || 0,
            eventTotalTime: event.totalTime || 0,
            eventTotalAmount: event.totalAmount || 0, // 新增
          });

          // 添加活动行
          if (event.activities && event.activities.length > 0) {
            event.activities.forEach((activity) => {
              tableData.push({
                id: `activity-${activity.id}`,
                rowType: "activity",
                index: index++,
                eventName: "",
                activityName: activity.name,
                activityParticipants: activity.totalParticipants || 0,
                activityTotalTime: activity.totalTime || 0,
                eventParticipants: "",
                eventTotalTime: "",
              });
            });
          }
        });

        setEventData(tableData);

        const newPagination = {
          current: response.page,
          pageSize: response.pageSize,
          total: response.total,
        };

        // 同时更新ref和state
        eventPaginationRef.current = newPagination;
        setEventPagination(newPagination);
      } catch (error) {
        message.error(`获取事件统计失败: ${error.message || "未知错误"}`);
        console.warn("事件统计请求失败:", error);
      } finally {
        setEventLoading(false);
      }
    },
    [eventSearchParams]
  );

  // 初始化数据
  useEffect(() => {
    fetchData({ current: 1, pageSize: 10 });
  }, [fetchData]);

  useEffect(() => {
    fetchEventData({ current: 1, pageSize: 10 });
  }, [fetchEventData]);

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

  // 事件统计表格列配置
  const eventColumns = [
    {
      title: "序号",
      dataIndex: "index",
      key: "index",
      width: "8%",
    },
    {
      title: "Event名称",
      dataIndex: "eventName",
      key: "eventName",
      width: "20%",
      render: (text, record) => (
        <span
          style={{ fontWeight: record.rowType === "event" ? "bold" : "normal" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Activity名称",
      dataIndex: "activityName",
      key: "activityName",
      width: "20%",
      render: (text, record) => (
        <span
          style={{ paddingLeft: record.rowType === "activity" ? "20px" : "0" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "AC参与人次",
      dataIndex: "activityParticipants",
      key: "activityParticipants",
      width: "12%",
      align: "center",
    },
    {
      title: "AC参与总时间(分钟)",
      dataIndex: "activityTotalTime",
      key: "activityTotalTime",
      width: "15%",
      align: "center",
    },
    {
      title: "Event人次",
      dataIndex: "eventParticipants",
      key: "eventParticipants",
      width: "12%",
      align: "center",
      render: (text, record) => (
        <span
          style={{ fontWeight: record.rowType === "event" ? "bold" : "normal" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "Event总时间(分钟)",
      dataIndex: "eventTotalTime",
      key: "eventTotalTime",
      width: "13%",
      align: "center",
      render: (text, record) => (
        <span
          style={{ fontWeight: record.rowType === "event" ? "bold" : "normal" }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "总金额",
      dataIndex: "eventTotalAmount",
      key: "eventTotalAmount",
      width: "13%",
      align: "center",
      render: (text, record) =>
        record.rowType === "event" ? `¥${(text || 0).toFixed(2)}` : "",
    },
  ];

  // 处理事件表格变化（分页）
  const handleEventTableChange = useCallback(
    (newPagination) => {
      fetchEventData({
        current: newPagination.current,
        pageSize: newPagination.pageSize,
      });
    },
    [fetchEventData]
  );

  // 处理事件搜索
  const handleEventSearch = useCallback(() => {
    // 更新ref和state
    eventPaginationRef.current = { ...eventPaginationRef.current, current: 1 };
    setEventPagination((prev) => ({ ...prev, current: 1 }));
    fetchEventData({ current: 1 });
  }, [fetchEventData]);

  // 处理事件名称搜索输入变化
  const handleEventNameSearchChange = useCallback((e) => {
    setEventSearchParams((prev) => ({ ...prev, eventName: e.target.value }));
  }, []);

  // 重置事件筛选条件
  const handleResetEventFilters = useCallback(() => {
    setEventSearchParams({
      eventName: "",
    });
  }, []);

  const tabItems = [
    {
      key: "statistics",
      label: "事件统计",
      children: (
        <Card>
          <div className="table-toolbar">
            <div className="search-area">
              <Space size="middle" wrap>
                <Input
                  placeholder="搜索事件名"
                  value={eventSearchParams.eventName}
                  onChange={handleEventNameSearchChange}
                  style={{ width: 200 }}
                  onPressEnter={handleEventSearch}
                  prefix={<SearchOutlined />}
                  allowClear
                />
                <Button type="primary" onClick={handleEventSearch}>
                  搜索
                </Button>
                <Button
                  onClick={handleResetEventFilters}
                  icon={<ReloadOutlined />}
                >
                  重置
                </Button>
              </Space>
            </div>
          </div>
          <Table
            columns={eventColumns}
            dataSource={eventData}
            pagination={eventPagination}
            loading={eventLoading}
            onChange={handleEventTableChange}
            rowKey="id"
            scroll={{ x: 1000 }}
            rowClassName={(record) =>
              record.rowType === "event" ? "event-row" : "activity-row"
            }
          />
        </Card>
      ),
    },
    {
      key: "details",
      label: "活动明细",
      children: (
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
      ),
    },
  ];

  return (
    <div className="activity-details-container">
      <Tabs defaultActiveKey="statistics" items={tabItems} />
    </div>
  );
};

export default ActivityDetails;
