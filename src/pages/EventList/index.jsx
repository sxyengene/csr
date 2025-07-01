import React, { useState, useEffect } from "react";
import { Button, Empty, Card, Switch, message, Spin } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getEventList, updateEventDisplay } from "../../services/event";
import styles from "./index.module.scss";
import ActivityTimeline from "../../components/ActivityTimeline";

// 使用更可靠的默认背景图
const defaultBgImage =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

const EventList = () => {
  const navigate = useNavigate();
  const [expandedEvent, setExpandedEvent] = useState(null);
  const [loading, setLoading] = useState(false);
  const [switchLoading, setSwitchLoading] = useState({}); // 记录每个Switch的loading状态

  // 从API获取的事件数据
  const [events, setEvents] = useState([]);

  // 获取事件列表数据
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const result = await getEventList();
      // result包含 {data: [...], total, page, pageSize}
      setEvents(result.data || []);
    } catch (error) {
      console.error("获取事件列表失败:", error);

      // 处理不同类型的错误
      if (error.code === 401) {
        message.error("登录已过期，请重新登录");
        // 401错误时跳转到登录页
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      } else if (error.code === 403) {
        message.error("权限不足，无法访问事件列表");
      } else if (error.message) {
        message.error(`获取事件列表失败：${error.message}`);
      } else {
        message.error("获取事件列表失败，请重试");
      }
    } finally {
      setLoading(false);
    }
  };

  // 组件加载时获取数据
  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAddEvent = () => {
    navigate("/events/create");
  };

  const handleEditEvent = (id, e) => {
    e.stopPropagation();
    navigate(`/events/${id}/edit`);
  };

  const handleCreateActivity = (eventId, e) => {
    e.stopPropagation();
    navigate(`/activity/create/${eventId}`);
  };

  const handleEventClick = (eventId) => {
    setExpandedEvent(expandedEvent === eventId ? null : eventId);
  };

  // 处理事件展示状态切换
  const handleDisplayToggle = async (eventId, checked, e) => {
    e.stopPropagation(); // 阻止事件冒泡

    // 设置对应Switch的loading状态
    setSwitchLoading((prev) => ({ ...prev, [eventId]: true }));

    try {
      await updateEventDisplay(eventId, checked);
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, is_display: checked } : event
        )
      );
      message.success(`事件已${checked ? "显示" : "隐藏"}`);
    } catch (error) {
      console.error("更新事件展示状态失败:", error);

      // 处理不同类型的错误
      if (error.code === 401) {
        message.error("登录已过期，请重新登录");
      } else if (error.code === 403) {
        message.error("权限不足，无法修改事件状态");
      } else if (error.message) {
        message.error(`更新失败：${error.message}`);
      } else {
        message.error("更新失败，请重试");
      }
    } finally {
      // 清除对应Switch的loading状态
      setSwitchLoading((prev) => ({ ...prev, [eventId]: false }));
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>事件列表</h1>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAddEvent}>
          添加事件
        </Button>
      </div>

      {loading ? (
        <div style={{ textAlign: "center", padding: "50px" }}>
          <Spin size="large" />
        </div>
      ) : events.length === 0 ? (
        <Empty description="暂无事件" />
      ) : (
        <div className={styles.eventList}>
          {events.map((event) => (
            <Card
              key={event.id}
              className={styles.eventCard}
              onClick={() => handleEventClick(event.id)}
            >
              <div
                className={styles.bgImage}
                style={{
                  backgroundImage: `url(${event.bgImage || defaultBgImage})`,
                }}
              />
              <div className={styles.content}>
                <div className={styles.info}>
                  <div className={styles.titleRow}>
                    <h2>{event.name}</h2>
                    <div className={styles.displaySwitch}>
                      <span className={styles.switchLabel}>前台展示</span>
                      <Switch
                        checked={event.is_display}
                        loading={switchLoading[event.id] || false}
                        onChange={(checked, e) =>
                          handleDisplayToggle(event.id, checked, e)
                        }
                        size="small"
                      />
                    </div>
                  </div>
                  <p>{`${event.startTime} - ${event.endTime}`}</p>
                </div>
                <div className={styles.actions}>
                  <Button
                    icon={<EditOutlined />}
                    onClick={(e) => handleEditEvent(event.id, e)}
                  >
                    编辑事件
                  </Button>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={(e) => handleCreateActivity(event.id, e)}
                  >
                    创建活动
                  </Button>
                </div>
              </div>
              {expandedEvent === event.id && (
                <div className={styles.timeline}>
                  <ActivityTimeline
                    activities={event.activities}
                    eventId={event.id}
                  />
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default EventList;
