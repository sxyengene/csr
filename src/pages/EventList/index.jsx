import React, { useState } from "react";
import { Button, Empty, Card, Switch, message } from "antd";
import { PlusOutlined, EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";
import ActivityTimeline from "../../components/ActivityTimeline";

// 使用更可靠的默认背景图
const defaultBgImage =
  "https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png";

const EventList = () => {
  const navigate = useNavigate();
  const [expandedEvent, setExpandedEvent] = useState(null);

  // 模拟数据，实际项目中应该从API获取
  const [events, setEvents] = useState([
    {
      id: 1,
      name: "年度技术分享大会",
      startTime: "2024-03-20 09:00",
      endTime: "2024-03-20 18:00",
      is_display: true,
      bgImage:
        "https://gw.alipayobjects.com/zos/antfincdn/aPkFc8Sj7n/method-draw-image.svg",
      activities: [
        {
          id: 1,
          name: "开场致辞",
          description: "公司CEO致开场词",
          startTime: "2024-03-20 09:00",
          endTime: "2024-03-20 09:30",
          status: "registering", // 活动状态
        },
        {
          id: 2,
          name: "技术分享",
          description:
            "前端团队分享React最佳实践和性能优化技巧，包括组件设计、状态管理、性能优化等多个方面的深入探讨。",
          startTime: "2024-03-20 09:30",
          endTime: "2024-03-20 11:30",
          status: "full", // 活动状态
        },
      ],
    },
    {
      id: 2,
      name: "产品发布会",
      startTime: "2024-04-15 14:00",
      endTime: "2024-04-15 17:00",
      is_display: false,
      bgImage:
        "https://gw.alipayobjects.com/zos/antfincdn/x43I27A55%26/photo-1438109491414-7198515b166b.webp",
      activities: [
        {
          id: 3,
          name: "产品演示",
          description: "新产品功能演示和使用说明",
          startTime: "2024-04-15 14:00",
          endTime: "2024-04-15 15:30",
          status: "not_registered", // 活动状态
        },
        {
          id: 4,
          name: "媒体问答",
          description: "与媒体记者交流问答环节",
          startTime: "2024-04-15 15:45",
          endTime: "2024-04-15 16:30",
          status: "ended", // 活动状态
        },
      ],
    },
    {
      id: 3,
      name: "团队建设事件",
      startTime: "2024-05-01 09:00",
      endTime: "2024-05-01 18:00",
      is_display: true,
      bgImage:
        "https://gw.alipayobjects.com/zos/antfincdn/LlvErxo8H9/photo-1503185912284-5271ff81b9a8.webp",
      activities: [
        {
          id: 5,
          name: "户外拓展",
          description: "团队户外拓展训练活动",
          startTime: "2024-05-01 09:00",
          endTime: "2024-05-01 12:00",
          status: "registering", // 活动状态
        },
        {
          id: 6,
          name: "团队午餐",
          description: "共享美食，增进团队感情",
          startTime: "2024-05-01 12:00",
          endTime: "2024-05-01 13:30",
          status: "registering", // 活动状态
        },
        {
          id: 7,
          name: "团队游戏",
          description: "有趣的团队互动游戏环节",
          startTime: "2024-05-01 14:00",
          endTime: "2024-05-01 17:00",
          status: "full", // 活动状态
        },
      ],
    },
    {
      id: 4,
      name: "客户答谢晚宴",
      startTime: "2024-06-10 18:00",
      endTime: "2024-06-10 21:30",
      is_display: true,
      bgImage:
        "https://gw.alipayobjects.com/zos/antfincdn/cV16ZqzMjW/photo-1473091540282-9b846e7965e3.webp",
      activities: [
        {
          id: 8,
          name: "欢迎酒会",
          description: "欢迎致辞和开场酒会",
          startTime: "2024-06-10 18:00",
          endTime: "2024-06-10 18:45",
          status: "not_registered", // 活动状态
        },
        {
          id: 9,
          name: "晚宴",
          description: "精致美食晚宴",
          startTime: "2024-06-10 19:00",
          endTime: "2024-06-10 20:30",
          status: "registering", // 活动状态
        },
        {
          id: 10,
          name: "文艺表演",
          description: "精彩的文艺节目表演",
          startTime: "2024-06-10 20:30",
          endTime: "2024-06-10 21:30",
          status: "ended", // 活动状态
        },
      ],
    },
    {
      id: 5,
      name: "年终总结大会",
      startTime: "2024-12-30 13:00",
      endTime: "2024-12-30 17:30",
      is_display: false,
      bgImage: null, // 使用默认背景图
      activities: [
        {
          id: 11,
          name: "年度回顾",
          description: "回顾公司全年成就与亮点",
          startTime: "2024-12-30 13:00",
          endTime: "2024-12-30 14:30",
          status: "not_registered", // 活动状态
        },
        {
          id: 12,
          name: "颁奖典礼",
          description: "年度优秀员工及团队表彰",
          startTime: "2024-12-30 14:45",
          endTime: "2024-12-30 16:00",
          status: "not_registered", // 活动状态
        },
        {
          id: 13,
          name: "展望未来",
          description: "新年战略规划发布",
          startTime: "2024-12-30 16:15",
          endTime: "2024-12-30 17:30",
          status: "not_registered", // 活动状态
        },
      ],
    },
  ]);

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
    try {
      // TODO: 调用API更新事件展示状态
      setEvents((prev) =>
        prev.map((event) =>
          event.id === eventId ? { ...event, is_display: checked } : event
        )
      );
      message.success(`事件已${checked ? "显示" : "隐藏"}`);
    } catch (error) {
      message.error("更新失败，请重试");
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

      {events.length === 0 ? (
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
