// 模拟用户数据
const mockUsers = Array.from({ length: 100 }, (_, index) => ({
  id: index + 1,
  username: `用户${index + 1}`,
  role: index === 0 ? "admin" : "user",
  createTime: new Date(
    Date.now() - Math.random() * 10000000000
  ).toLocaleString(),
  eventCount: Math.floor(Math.random() * 20),
  activityCount: Math.floor(Math.random() * 10),
}));

// 模拟活动数据
const mockActivities = Array.from({ length: 50 }, (_, index) => ({
  id: index + 1,
  name: `活动${index + 1}`,
  type: ["线上活动", "线下活动", "混合活动"][Math.floor(Math.random() * 3)],
  joinTime: new Date(Date.now() - Math.random() * 10000000000).toLocaleString(),
  status: Math.random() > 0.5 ? "active" : "ended",
}));

// 模拟事件数据
const mockEvents = Array.from({ length: 30 }, (_, index) => ({
  id: index + 1,
  name: `事件${index + 1}`,
  activityName: `活动${Math.floor(Math.random() * 10 + 1)}`,
  eventTime: new Date(
    Date.now() + Math.random() * 10000000000
  ).toLocaleString(),
}));

// 获取用户列表
export const getUserList = async ({
  page = 1,
  pageSize = 10,
  username = "",
  sortField,
  sortOrder,
}) => {
  // 模拟 API 请求延迟
  await new Promise((resolve) => setTimeout(resolve, 500));

  let filteredUsers = [...mockUsers];

  // 搜索过滤
  if (username) {
    filteredUsers = filteredUsers.filter((user) =>
      user.username.toLowerCase().includes(username.toLowerCase())
    );
  }

  // 排序
  if (sortField && sortOrder) {
    filteredUsers.sort((a, b) => {
      const compareResult = a[sortField] > b[sortField] ? 1 : -1;
      return sortOrder === "ascend" ? compareResult : -compareResult;
    });
  }

  // 分页
  const total = filteredUsers.length;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const data = filteredUsers.slice(start, end);

  return {
    data,
    total,
    page,
    pageSize,
  };
};

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

// 重置用户密码
export const resetUserPassword = async (id, newPassword) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // 实际应用中这里会调用后端 API
  return { success: true };
};

// 获取用户活动历史
export const getUserActivities = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // 模拟根据用户 ID 筛选活动
  return mockActivities.slice(0, Math.floor(Math.random() * 10 + 1));
};

// 获取用户事件列表
export const getUserEvents = async (userId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  // 模拟根据用户 ID 筛选事件
  return mockEvents.slice(0, Math.floor(Math.random() * 15 + 1));
};

// 删除用户
export const deleteUsers = async (userIds) => {
  // 模拟 API 请求延迟
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { success: true };
};
