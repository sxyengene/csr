import { get, post } from "../utils/request";
import { API_ENDPOINTS, buildUrl } from "../config/api";

// 字段映射函数 - 将接口数据转换为页面期望的格式
const mapEventData = (event) => {
  return {
    ...event,
    // 映射字段名差异
    is_display: event.isDisplay,
  };
};

// 获取事件列表
export const getEventList = async ({ page = 1, pageSize = 10 } = {}) => {
  try {
    const response = await get(API_ENDPOINTS.EVENTS.LIST, {
      page,
      pageSize,
    });

    // 从嵌套的data结构中提取事件数组
    const events = response.data?.data || [];

    // 映射字段名并返回
    return {
      data: events.map(mapEventData),
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      pageSize: response.data?.pageSize || 10,
    };
  } catch (error) {
    console.error("获取事件列表失败:", error);
    throw error;
  }
};

// 字段映射函数 - 将页面数据转换为API期望的格式
const mapEventDataToAPI = (eventData) => {
  return {
    name: eventData.name,
    totalTime: eventData.total_time,
    icon: eventData.icon,
    description: eventData.description,
    isDisplay: eventData.is_display,
    visibleLocations: eventData.visibleLocations,
    visibleRoles: eventData.visibleRoles,
  };
};

// 获取事件详情
export const getEventDetail = async (eventId) => {
  try {
    const url = buildUrl(API_ENDPOINTS.EVENTS.DETAIL, { id: eventId });
    const response = await get(url);

    // 映射字段名并返回
    return mapEventData(response.data);
  } catch (error) {
    console.error("获取事件详情失败:", error);
    throw error;
  }
};

// 创建事件
export const createEvent = async (eventData) => {
  try {
    // 映射字段名并调用API
    const apiData = mapEventDataToAPI(eventData);
    const response = await post(API_ENDPOINTS.EVENTS.CREATE, apiData);

    return response;
  } catch (error) {
    console.error("创建事件失败:", error);
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
