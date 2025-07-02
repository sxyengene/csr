import { get, put, del } from "../utils/request";
import { API_ENDPOINTS, buildUrl, mapLocationToDisplay } from "../config/api";

// 字段映射函数 - 将接口数据转换为页面期望的格式
const mapUserData = (user) => {
  return {
    ...user,
    // 映射角色字段（保持兼容性，支持两种格式）
    role: user.role === "Administrator" ? "admin" : user.role,
    // 映射reviewer字段
    reviewer: user.reviewerName || "",
    // 映射地区字段：API值(SH/SZ) -> 显示名称(上海/深圳)
    location: mapLocationToDisplay(user.location),
  };
};

// 获取用户列表 (接入真实API)
export const getUserList = async ({
  page = 1,
  pageSize = 10,
  username = "",
  role = "",
  location = "",
  sortField,
  sortOrder,
}) => {
  try {
    const params = {
      page,
      pageSize,
    };

    // 添加搜索参数
    if (username) {
      params.username = username;
    }

    // 添加角色筛选参数
    if (role) {
      params.role = role;
    }

    // 添加地区筛选参数 (前端已传递API值，直接使用)
    if (location) {
      params.location = location; // 直接使用API值 (SH/SZ)
    }

    // 添加排序参数
    if (sortField && sortOrder) {
      params.sortField = sortField;
      params.sortOrder = sortOrder === "ascend" ? "asc" : "desc";
    }

    const response = await get(API_ENDPOINTS.USERS.LIST, params);

    // 处理嵌套的数据结构：response.data = {data: [...], total, page, pageSize}
    const userData = response.data?.data || [];
    const mappedData = userData.map(mapUserData);

    return {
      data: mappedData,
      total: response.data?.total || 0,
      page: response.data?.page || 1,
      pageSize: response.data?.pageSize || 10,
    };
  } catch (error) {
    console.error("获取用户列表失败:", error);
    throw error;
  }
};

// 注意：mockEvents 和 mockActivities 已移除，现在使用真实API

// 获取用户详情 (接入真实API)
export const getUserDetail = async (id) => {
  try {
    const url = buildUrl(API_ENDPOINTS.USERS.DETAIL, { id });
    const response = await get(url);
    return mapUserData(response.data);
  } catch (error) {
    console.error("获取用户详情失败:", error);
    throw error;
  }
};

// 更新用户信息 (接入真实API)
export const updateUser = async (id, data) => {
  try {
    const url = buildUrl(API_ENDPOINTS.USERS.UPDATE, { id });
    const response = await put(url, data);
    return response;
  } catch (error) {
    console.error("更新用户信息失败:", error);
    throw error;
  }
};

// 搜索用户 (接入真实API)
export const searchUsers = async (keyword, limit = 10) => {
  try {
    const params = {
      keyword,
      limit,
    };
    const response = await get(API_ENDPOINTS.USERS.SEARCH, params);
    // 处理返回的用户数据，映射必要字段
    const users = response.data || [];
    return users.map(mapUserData);
  } catch (error) {
    console.error("搜索用户失败:", error);
    throw error;
  }
};

// 更新用户reviewer (接入真实API)
export const updateUserReviewer = async (id, reviewerId) => {
  try {
    const url = buildUrl(API_ENDPOINTS.USERS.UPDATE_REVIEWER, { id });
    const response = await put(url, { reviewerId });
    return response;
  } catch (error) {
    console.error("更新用户reviewer失败:", error);
    throw error;
  }
};

// 重置用户密码 (接入真实API)
export const resetUserPassword = async (id, newPassword) => {
  try {
    const url = buildUrl(API_ENDPOINTS.USERS.RESET_PASSWORD, { id });
    const response = await put(url, { password: newPassword });
    return response;
  } catch (error) {
    console.error("重置用户密码失败:", error);
    throw error;
  }
};

// 获取用户事件记录 (接入真实API)
export const getUserEvents = async (userId) => {
  try {
    const url = buildUrl(API_ENDPOINTS.USERS.EVENTS, { id: userId });
    const response = await get(url);
    return response.data || [];
  } catch (error) {
    console.error("获取用户事件记录失败:", error);
    throw error;
  }
};

// 获取用户活动记录 (接入真实API)
export const getUserActivities = async (userId) => {
  try {
    const url = buildUrl(API_ENDPOINTS.USERS.ACTIVITIES, { id: userId });
    const response = await get(url);
    return response.data || [];
  } catch (error) {
    console.error("获取用户活动记录失败:", error);
    throw error;
  }
};

// 批量删除用户 (接入真实API)
export const deleteUsers = async (userIds) => {
  try {
    const response = await del(API_ENDPOINTS.USERS.BATCH_DELETE, {
      data: { userIds },
    });
    return response;
  } catch (error) {
    console.error("批量删除用户失败:", error);
    throw error;
  }
};
