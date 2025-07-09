import { get, post, put, del } from "../utils/request";
import { API_ENDPOINTS, buildUrl } from "../config/api";

// 模板类型映射 - 将前端字符串映射为后端ID
const TEMPLATE_TYPE_MAPPING = {
  default: 1,
  meeting: 2,
  transaction: 3,
  activity: 4,
};

// 字段映射函数 - 将前端数据转换为API期望的格式
const mapActivityDataToAPI = (activityData) => {
  return {
    name: activityData.name,
    eventId: parseInt(activityData.eventId),
    templateId: parseInt(activityData.templateId) || 1, // 直接使用templateId，不再映射templateType
    duration: parseInt(activityData.duration) || 0, // 直接使用用户输入的duration
    icon: activityData.icon,
    description: activityData.description,
    startTime: activityData.startTime, // 保持原格式，不转换
    endTime: activityData.endTime, // 保持原格式，不转换
    status: activityData.status || "not_registered", // 提供默认状态，因为API要求必填
    visibleLocations: activityData.visibleLocations || [],
    visibleRoles: activityData.visibleRoles || [], // 保持原格式，不转换
  };
};

// 字段映射函数 - 将API数据转换为前端期望的格式
const mapActivityDataFromAPI = (activityData) => {
  return {
    ...activityData,
    // 直接返回templateId，不再需要反向映射templateType
    templateId: activityData.templateId,
    // visibleRoles保持原样，不转换
  };
};

// 创建活动
export const createActivity = async (activityData) => {
  try {
    const apiData = mapActivityDataToAPI(activityData);
    console.log("发送到API的活动数据:", apiData);

    const response = await post(API_ENDPOINTS.ACTIVITIES.CREATE, apiData);
    return response;
  } catch (error) {
    console.error("创建活动失败:", error);
    throw error;
  }
};

// 更新活动
export const updateActivity = async (activityId, activityData) => {
  try {
    const apiData = mapActivityDataToAPI(activityData);
    const url = buildUrl(API_ENDPOINTS.ACTIVITIES.UPDATE, { id: activityId });

    const response = await put(url, apiData);
    return response;
  } catch (error) {
    console.error("更新活动失败:", error);
    throw error;
  }
};

// 获取活动详情
export const getActivityDetail = async (activityId) => {
  try {
    const url = buildUrl(API_ENDPOINTS.ACTIVITIES.DETAIL, { id: activityId });
    const response = await get(url);

    return mapActivityDataFromAPI(response.data);
  } catch (error) {
    console.error("获取活动详情失败:", error);
    throw error;
  }
};

// 获取活动列表
export const getActivityList = async (params = {}) => {
  try {
    const response = await get(API_ENDPOINTS.ACTIVITIES.LIST, params);

    const activities = response.data?.data || [];
    return {
      data: activities.map(mapActivityDataFromAPI),
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      pageSize: response.data?.pageSize || 10,
    };
  } catch (error) {
    console.error("获取活动列表失败:", error);
    throw error;
  }
};

// 删除活动
export const deleteActivity = async (activityId) => {
  try {
    const url = buildUrl(API_ENDPOINTS.ACTIVITIES.DELETE, { id: activityId });
    const response = await del(url);
    return response;
  } catch (error) {
    console.error("删除活动失败:", error);
    throw error;
  }
};
