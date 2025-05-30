import React, { useState } from "react";
import { Timeline, Empty, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const EventTimeline = ({ events, activityId }) => {
  const navigate = useNavigate();
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  // 事件状态映射
  const statusConfig = {
    not_registered: { color: "default", text: "未报名" },
    registering: { color: "blue", text: "报名中" },
    full: { color: "orange", text: "已满人" },
    ended: { color: "red", text: "已结束" },
  };

  const toggleDescription = (eventId, e) => {
    // 如果点击的是状态标签，不展开/收起描述
    if (e.target.closest(".event-status")) {
      return;
    }

    const newExpandedEvents = new Set(expandedEvents);
    if (newExpandedEvents.has(eventId)) {
      newExpandedEvents.delete(eventId);
    } else {
      newExpandedEvents.add(eventId);
    }
    setExpandedEvents(newExpandedEvents);
  };

  const handleEventClick = (eventId, e) => {
    e.stopPropagation();
    navigate(`/event/edit/${activityId}/${eventId}`);
  };

  if (!events || events.length === 0) {
    return <Empty description="暂无事件" />;
  }

  return (
    <Timeline className={styles.timeline}>
      {events.map((event) => (
        <Timeline.Item key={event.id}>
          <div
            className={styles.eventItem}
            onClick={(e) => handleEventClick(event.id, e)}
          >
            <div className={styles.eventHeader}>
              <h3>{event.name}</h3>
              <Tag
                className="event-status"
                color={statusConfig[event.status]?.color || "default"}
                onClick={(e) => e.stopPropagation()}
              >
                {statusConfig[event.status]?.text || "未知状态"}
              </Tag>
            </div>
            <p className={styles.time}>
              {`${event.startTime} - ${event.endTime}`}
            </p>
            {event.description && (
              <div
                className={`${styles.description} ${
                  expandedEvents.has(event.id) ? styles.expanded : ""
                }`}
                onClick={(e) => toggleDescription(event.id, e)}
              >
                <p>{event.description}</p>
              </div>
            )}
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  );
};

export default EventTimeline;
