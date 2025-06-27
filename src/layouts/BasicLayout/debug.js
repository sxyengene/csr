console.log("BasicLayout loaded");

// Token 调试工具
import { getToken, isTokenExpired, getCurrentUser } from "../../services/auth";
import { TOKEN_CONFIG } from "../../config/api";

// 调试 Token 状态
export const debugTokenStatus = () => {
  console.group("🔍 Token 调试信息");

  // 1. 检查所有存储的 token 信息
  console.log("📦 LocalStorage 中的 Token 信息:");
  console.log(
    "  - accessToken:",
    localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)
  );
  console.log("  - token (兼容):", localStorage.getItem("token"));
  console.log(
    "  - refreshToken:",
    localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY)
  );
  console.log(
    "  - tokenType:",
    localStorage.getItem(TOKEN_CONFIG.TOKEN_TYPE_KEY)
  );
  console.log(
    "  - expiresAt:",
    localStorage.getItem(TOKEN_CONFIG.EXPIRES_AT_KEY)
  );

  // 2. 检查 getToken() 函数返回值
  const currentToken = getToken();
  console.log(
    "🔑 getToken() 返回值:",
    currentToken ? `${currentToken.slice(0, 20)}...` : "null"
  );

  // 3. 检查 token 是否过期
  const isExpired = isTokenExpired();
  console.log("⏰ Token 是否过期:", isExpired);

  // 4. 检查当前用户信息
  const user = getCurrentUser();
  console.log("👤 当前用户信息:", user);

  // 5. 检查过期时间
  const expiresAt = localStorage.getItem(TOKEN_CONFIG.EXPIRES_AT_KEY);
  if (expiresAt) {
    const expireTime = new Date(parseInt(expiresAt));
    const now = new Date();
    const remaining = expireTime - now;
    console.log("📅 Token 过期时间:", expireTime.toLocaleString());
    console.log("🕐 当前时间:", now.toLocaleString());
    console.log("⏱️ 剩余时间:", Math.floor(remaining / 1000 / 60), "分钟");
  }

  console.groupEnd();

  return {
    hasToken: !!currentToken,
    isExpired,
    user,
    remainingTime: expiresAt ? new Date(parseInt(expiresAt)) - new Date() : 0,
  };
};

// 调试请求拦截器
export const debugRequestInterceptor = () => {
  console.group("🌐 请求拦截器调试");

  // 创建一个测试请求来查看请求头
  const { axiosInstance } = require("../../utils/request");

  // 临时添加请求拦截器来打印请求信息
  const interceptorId = axiosInstance.interceptors.request.use((config) => {
    console.log("📤 发送请求:", config.method?.toUpperCase(), config.url);
    console.log("📋 请求头:", config.headers);
    if (config.headers.Authorization) {
      console.log(
        "✅ Authorization 头存在:",
        config.headers.Authorization.slice(0, 30) + "..."
      );
    } else {
      console.log("❌ Authorization 头缺失");
    }
    return config;
  });

  console.log("✅ 请求拦截器已添加，ID:", interceptorId);
  console.groupEnd();

  return interceptorId;
};

// 手动测试用户列表请求
export const testUserListRequest = async () => {
  console.group("🧪 测试用户列表请求");

  try {
    const { get } = await import("../../utils/request");
    const { API_ENDPOINTS } = await import("../../config/api");

    console.log("📡 开始请求用户列表...");
    const response = await get(API_ENDPOINTS.USERS.LIST, {
      page: 1,
      pageSize: 5,
    });
    console.log("✅ 请求成功:", response);
    return response;
  } catch (error) {
    console.log("❌ 请求失败:", error);
    console.log("   错误代码:", error.code);
    console.log("   错误信息:", error.message);
    throw error;
  } finally {
    console.groupEnd();
  }
};

// 一键调试所有问题
export const debugAll = async () => {
  console.log("🚀 开始全面调试...");

  // 1. 检查 Token 状态
  const tokenStatus = debugTokenStatus();

  // 2. 添加请求拦截器调试
  const interceptorId = debugRequestInterceptor();

  // 3. 测试实际请求
  try {
    await testUserListRequest();
  } catch (error) {
    console.log("🔧 调试建议:");

    if (!tokenStatus.hasToken) {
      console.log("   1. 没有 Token，请先登录");
    } else if (tokenStatus.isExpired) {
      console.log("   2. Token 已过期，需要刷新或重新登录");
    } else {
      console.log("   3. Token 存在但请求失败，检查网络和 API 服务器");
    }
  }

  return { tokenStatus, interceptorId };
};

// 在全局对象上暴露调试函数
if (typeof window !== "undefined") {
  window.debugToken = debugAll;
  window.debugTokenStatus = debugTokenStatus;
  window.testUserList = testUserListRequest;
}
