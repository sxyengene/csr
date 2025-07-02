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

// 模拟用户数据 (保留作为备用)
const mockUsers = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  username: `用户${index + 1}`,
  role: index === 0 ? "admin" : "user",
  location: index % 4 === 0 ? "SZ" : "SH", // 大部分用户在上海，使用API值(SH/SZ)
  reviewer:
    index % 3 === 0
      ? "孙雄鹰"
      : index % 3 === 1
      ? "张如诚"
      : index % 5 === 0
      ? "xu jin"
      : "",
  createTime: new Date(
    Date.now() - Math.random() * 10000000000
  ).toLocaleString(),
  eventCount: Math.floor(Math.random() * 20),
  activityCount: Math.floor(Math.random() * 10),
}));

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

// 更新用户reviewer (暂时保持模拟实现)
export const updateUserReviewer = async (id, reviewer) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userIndex = mockUsers.findIndex((u) => u.id === Number(id));
  if (userIndex === -1) {
    throw new Error("用户不存在");
  }
  mockUsers[userIndex].reviewer = reviewer;
  return { success: true };
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
