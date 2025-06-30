import { get } from "../utils/request";
import { API_ENDPOINTS } from "../config/api";

// 获取事件列表
export const getEventList = async ({ page = 1, pageSize = 10 } = {}) => {
  try {
    const response = await get(API_ENDPOINTS.EVENTS.LIST, {
      page,
      pageSize,
    });

    // 直接返回事件数组，因为API文档显示data字段直接是数组
    return response.data || [];
  } catch (error) {
    console.error("获取事件列表失败:", error);
    throw error;
  }
};

// 更新事件展示状态
export const updateEventDisplay = async (eventId, isDisplay) => {
  try {
    // TODO: 实际的API调用，当前使用模拟
    console.log(`更新事件 ${eventId} 展示状态为: ${isDisplay}`);
    return { success: true };
  } catch (error) {
    console.error("更新事件展示状态失败:", error);
    throw error;
  }
};
