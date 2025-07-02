import { get, post, put } from "../utils/request";
import {
  API_ENDPOINTS,
  buildUrl,
  mapLocationsToDisplay,
  mapLocationsToApi,
} from "../config/api";

// 字段映射函数 - 将接口数据转换为页面期望的格式
const mapEventData = (event) => {
  return {
    ...event,
    // 映射字段名差异：API使用驼峰，表单使用下划线
    total_time: event.totalTime || event.total_time, // API可能返回totalTime，表单期望total_time
    is_display:
      event.isDisplay !== undefined ? event.isDisplay : event.is_display, // API返回isDisplay，表单期望is_display
    // 映射地区数组：API值(SH/SZ) -> 显示名称(上海/深圳)
    visibleLocations: mapLocationsToDisplay(event.visibleLocations || []),
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

// 字段映射函数 - 将页面数据转换为API期望的格式 (创建和更新事件通用)
// 实际测试发现创建和更新接口都使用驼峰命名
const mapEventDataToAPI = (eventData) => {
  return {
    name: eventData.name,
    totalTime: eventData.total_time, // API接口使用驼峰命名
    icon: eventData.icon,
    description: eventData.description,
    isDisplay: eventData.is_display, // API接口使用驼峰命名
    // 映射地区数组：显示名称(上海/深圳) -> API值(SH/SZ)
    visibleLocations: mapLocationsToApi(eventData.visibleLocations || []),
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

// 更新事件
export const updateEvent = async (eventId, eventData) => {
  try {
    // 映射字段名并调用API (复用创建接口的映射函数)
    const apiData = mapEventDataToAPI(eventData);
    const url = buildUrl(API_ENDPOINTS.EVENTS.UPDATE, { id: eventId });

    const response = await put(url, apiData);

    return response;
  } catch (error) {
    console.error("更新事件失败:", error);
    throw error;
  }
};

// 更新事件展示状态
export const updateEventDisplay = async (eventId, isDisplay) => {
  try {
    const url = buildUrl(API_ENDPOINTS.EVENTS.UPDATE_DISPLAY, { id: eventId });
    const response = await put(url, { isDisplay });

    return response;
  } catch (error) {
    console.error("更新事件展示状态失败:", error);
    throw error;
  }
};
