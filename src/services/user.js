import { get } from "../utils/request";
import { API_ENDPOINTS } from "../config/api";

// 字段映射函数 - 将接口数据转换为页面期望的格式
const mapUserData = (user) => {
  return {
    ...user,
    // 映射角色字段
    role: user.role === "Administrator" ? "admin" : "user",
    // 映射reviewer字段
    reviewer: user.reviewerName || "",
  };
};

// 获取用户列表 (接入真实API)
export const getUserList = async ({
  page = 1,
  pageSize = 10,
  username = "",
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

    // 添加排序参数
    if (sortField && sortOrder) {
      params.sortField = sortField;
      params.sortOrder = sortOrder === "ascend" ? "asc" : "desc";
    }

    const response = await get(API_ENDPOINTS.USERS.LIST, params);

    // 转换数据格式
    const mappedData = response.data.map(mapUserData);

    return {
      data: mappedData,
      total: response.total,
      page: response.page,
      pageSize: response.pageSize,
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
  location: index % 4 === 0 ? "深圳" : "上海", // 大部分用户在上海
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

// 模拟事件数据
const mockEvents = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `事件${index + 1}`,
  type: ["线上事件", "线下事件", "混合事件"][Math.floor(Math.random() * 3)],
  duration: `${Math.floor(Math.random() * 8 + 1)}小时`,
  status: Math.random() > 0.5 ? "active" : "ended",
}));

// 模拟活动数据
const mockActivities = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: `活动${index + 1}`,
  eventName: `事件${Math.floor(Math.random() * 10 + 1)}`,
  duration: `${Math.floor(Math.random() * 4 + 1)}小时`,
}));

// 获取用户详情
export const getUserDetail = async (id) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const user = mockUsers.find((u) => u.id === Number(id));
  if (!user) {
    throw new Error("用户不存在");
  }
  return user;
};

// 更新用户信息
export const updateUser = async (id, data) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  const userIndex = mockUsers.findIndex((u) => u.id === Number(id));
  if (userIndex === -1) {
    throw new Error("用户不存在");
  }
  mockUsers[userIndex] = { ...mockUsers[userIndex], ...data };
  return { success: true };
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

// 重置用户密码
export const resetUserPassword = async (id, newPassword) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // 实际应用中这里会调用后端 API
  return { success: true };
};

// 获取用户事件记录
export const getUserEvents = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // 模拟根据用户 ID 筛选事件
  return mockEvents.slice(0, Math.floor(Math.random() * 10 + 1));
};

// 获取用户活动记录
export const getUserActivities = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // 模拟根据用户 ID 筛选活动
  return mockActivities.slice(0, Math.floor(Math.random() * 15 + 1));
};

// 删除用户 (暂时保持模拟实现)
export const deleteUsers = async (userIds) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  console.log("模拟删除用户:", userIds);
  return { success: true };
};
