import React, { useState } from "react";
import { Timeline, Empty, Button, Modal, message } from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { deleteActivity } from "../../services/activity";
import clsx from "clsx";
import styles from "./index.module.scss";

const ActivityTimeline = ({ activities, eventId, onActivityDeleted }) => {
  const navigate = useNavigate();
  const [expandedActivities, setExpandedActivities] = useState(new Set());

  const toggleDescription = (activityId, e) => {
    const newExpandedActivities = new Set(expandedActivities);
    if (newExpandedActivities.has(activityId)) {
      newExpandedActivities.delete(activityId);
    } else {
      newExpandedActivities.add(activityId);
    }
    setExpandedActivities(newExpandedActivities);
  };

  const handleEditActivity = (activityId, e) => {
    e.stopPropagation();
    navigate(`/activity/edit/${eventId}/${activityId}`);
  };

  const handleDeleteActivity = (activityId, activityName, e) => {
    e.stopPropagation();

    Modal.confirm({
      title: "确认删除活动",
      icon: <ExclamationCircleOutlined />,
      content: `确定要删除活动"${activityName}"吗？此操作不可撤销。`,
      okText: "确认删除",
      okType: "danger",
      cancelText: "取消",
      onOk: async () => {
        try {
          await deleteActivity(activityId);
          message.success("活动删除成功");
          // 通知父组件刷新数据
          if (onActivityDeleted) {
            onActivityDeleted();
          }
        } catch (error) {
          console.error("删除活动失败:", error);

          // 处理不同类型的错误
          if (error.code === 401) {
            message.error("登录已过期，请重新登录");
          } else if (error.code === 403) {
            message.error("权限不足，无法删除活动");
          } else if (error.code === 400) {
            message.error("活动不存在或已被删除");
          } else if (error.message) {
            message.error(`删除失败：${error.message}`);
          } else {
            message.error("删除失败，请重试");
          }
        }
      },
    });
  };

  if (!activities || activities.length === 0) {
    return <Empty description="暂无活动" />;
  }

  return (
    <Timeline className={styles.timeline}>
      {activities.map((activity) => (
        <Timeline.Item key={activity.id}>
          <div className={styles.activityItem}>
            {/* 悬浮操作按钮 */}
            <div className={styles.activityActions}>
              <Button
                type="text"
                size="small"
                icon={<EditOutlined />}
                onClick={(e) => handleEditActivity(activity.id, e)}
                title="编辑活动"
              />
              <Button
                type="text"
                size="small"
                danger
                icon={<DeleteOutlined />}
                onClick={(e) =>
                  handleDeleteActivity(activity.id, activity.name, e)
                }
                title="删除活动"
              />
            </div>

            {/* 活动主要信息 */}
            <div className={styles.activityContent}>
              <div className={styles.activityHeader}>
                <h3
                  className={styles.activityName}
                  style={{ whiteSpace: "normal", wordBreak: "break-all" }}
                >
                  {activity.name}
                </h3>
              </div>

              <p className={styles.time}>
                {`${activity.startTime?.slice(
                  0,
                  10
                )} - ${activity.endTime?.slice(0, 10)}`}
              </p>

              {activity.description && (
                <div
                  className={clsx(styles.description, {
                    [styles.expanded]: expandedActivities.has(activity.id),
                  })}
                  onClick={(e) => toggleDescription(activity.id, e)}
                >
                  <p>{activity.description}</p>
                </div>
              )}
            </div>
          </div>
        </Timeline.Item>
      ))}
    </Timeline>
  );
};

export default ActivityTimeline;
