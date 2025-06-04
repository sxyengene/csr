import React, { useState } from "react";
import { Timeline, Empty, Tag } from "antd";
import { useNavigate } from "react-router-dom";
import styles from "./index.module.scss";

const ActivityTimeline = ({ activities, eventId }) => {
  const navigate = useNavigate();
  const [expandedActivities, setExpandedActivities] = useState(new Set());

  // 活动状态映射
  const statusConfig = {
    not_registered: { color: "default", text: "未报名" },
    registering: { color: "blue", text: "报名中" },
    full: { color: "orange", text: "已满人" },
    ended: { color: "red", text: "已结束" },
  };

  const toggleDescription = (activityId, e) => {
    // 如果点击的是状态标签，不展开/收起描述
    if (e.target.closest(".activity-status")) {
      return;
    }

    const newExpandedActivities = new Set(expandedActivities);
    if (newExpandedActivities.has(activityId)) {
      newExpandedActivities.delete(activityId);
    } else {
      newExpandedActivities.add(activityId);
    }
    setExpandedActivities(newExpandedActivities);
  };

  const handleActivityClick = (activityId, e) => {
    e.stopPropagation();
    navigate(`/activity/edit/${eventId}/${activityId}`);
  };

  if (!activities || activities.length === 0) {
    return <Empty description="暂无活动" />;
  }

  return (
    <Timeline className={styles.timeline}>
      {activities.map((activity) => (
        <Timeline.Item key={activity.id}>
          <div
            className={styles.activityItem}
            onClick={(e) => handleActivityClick(activity.id, e)}
          >
            <div className={styles.activityHeader}>
              <h3>{activity.name}</h3>
              <Tag
                className="activity-status"
                color={statusConfig[activity.status]?.color || "default"}
                onClick={(e) => e.stopPropagation()}
              >
                {statusConfig[activity.status]?.text || "未知状态"}
              </Tag>
            </div>
            <p className={styles.time}>
              {`${activity.startTime} - ${activity.endTime}`}
            </p>
            {activity.description && (
              <div
                className={`${styles.description} ${
                  expandedActivities.has(activity.id) ? styles.expanded : ""
                }`}
                onClick={(e) => toggleDescription(activity.id, e)}
              >
                <p>{activity.description}</p>
              </div>
            )}
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  );
};

export default ActivityTimeline;
