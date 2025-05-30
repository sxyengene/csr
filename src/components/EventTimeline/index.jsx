import React, { useState } from "react";
import { Timeline, Empty } from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const EventTimeline = ({ events, activityId }) => {
  const navigate = useNavigate();
  const [expandedEvents, setExpandedEvents] = useState(new Set());

  const toggleDescription = (eventId) => {
    const newExpandedEvents = new Set(expandedEvents);
    if (newExpandedEvents.has(eventId)) {
      newExpandedEvents.delete(eventId);
    } else {
      newExpandedEvents.add(eventId);
    }
    setExpandedEvents(newExpandedEvents);
  };

  const handleEditEvent = (e, eventId) => {
    e.stopPropagation(); // 阻止事件冒泡
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
            onClick={() => toggleDescription(event.id)}
          >
            <EditOutlined
              className={styles.editIcon}
              onClick={(e) => handleEditEvent(e, event.id)}
            />
            <h3>{event.name}</h3>
            <p className={styles.time}>
              {`${event.startTime} - ${event.endTime}`}
            </p>
            {event.description && (
              <div
                className={`${styles.description} ${
                  expandedEvents.has(event.id) ? styles.expanded : ""
                }`}
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
