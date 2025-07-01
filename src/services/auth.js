import axios from "axios";
import { API_CONFIG, TOKEN_CONFIG, API_ENDPOINTS } from "../config/api";

// 创建专门用于认证的 axios 实例（避免循环依赖）
const authAxios = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
  },
});

// 用户登录 API (底层服务，使用独立的axios实例)
export const login = async (username, password) => {
  try {
    const response = await authAxios.post(API_ENDPOINTS.AUTH.LOGIN, {
      username,
      password,
    });

    const data = response.data;

    // 检查业务状态码
    if (data.code !== 200) {
      throw new Error(data.message || "登录失败");
    }

    // 打印后端返回的完整数据，用于调试
    console.log("🔍 后端登录响应数据:", data.data);

    // 提取token信息
    const { accessToken, refreshToken, tokenType, expiresIn } = data.data;

    // 检查关键字段是否存在
    console.log("🔑 Token信息检查:", {
      accessToken: accessToken ? "✅ 存在" : "❌ 缺失",
      refreshToken: refreshToken ? "✅ 存在" : "❌ 缺失",
      tokenType: tokenType ? "✅ 存在" : "❌ 缺失",
      expiresIn: expiresIn ? `✅ ${expiresIn}秒` : "❌ 缺失",
    });

    // 使用配置的7天失效时间，而不是后端返回的短期时间
    const actualExpiresIn = TOKEN_CONFIG.DEFAULT_EXPIRES_IN; // 强制使用7天

    // 记录日志显示时间调整
    if (expiresIn !== actualExpiresIn) {
      console.log(
        `🕒 Token失效时间已调整: ${expiresIn}秒 → ${actualExpiresIn}秒 (7天)`
      );
    }

    // 存储token信息到localStorage
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem("token", accessToken); // 保持向后兼容性

    // 只有当refreshToken存在时才存储
    if (refreshToken) {
      localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
      console.log(
        `💾 已存储 refreshToken 到 ${TOKEN_CONFIG.REFRESH_TOKEN_KEY}`
      );
    } else {
      console.warn("⚠️ 后端未返回 refreshToken，无法启用自动刷新功能");
    }

    localStorage.setItem(TOKEN_CONFIG.TOKEN_TYPE_KEY, tokenType);
    localStorage.setItem(
      TOKEN_CONFIG.EXPIRES_IN_KEY,
      actualExpiresIn.toString()
    );
    localStorage.setItem(
      TOKEN_CONFIG.EXPIRES_AT_KEY,
      (Date.now() + actualExpiresIn * 1000).toString()
    );

    // 返回格式化的响应，适配前端组件期望的格式
    return {
      token: accessToken, // 保持与现有代码兼容
      accessToken,
      refreshToken,
      tokenType,
      expiresIn: actualExpiresIn, // 返回调整后的失效时间
      user: {
        id: 1, // 临时ID，后续可以从其他接口获取用户信息
        username: username,
        name: username, // 临时使用username作为显示名称
      },
    };
  } catch (error) {
    // 处理 axios 错误
    if (error.response) {
      // 服务器响应了错误状态码
      const message = error.response.data?.message || "登录失败";
      throw new Error(message);
    } else if (error.request) {
      // 网络错误
      throw new Error("网络连接失败，请检查网络设置");
    } else {
      // 其他错误
      throw new Error(error.message || "登录失败");
    }
  }
};

// 退出登录 (调用后端API使refresh token失效)
export const logout = async (isUserInitiated = false) => {
  // 如果不是用户主动发起的登出，则记录警告但不执行
  if (!isUserInitiated) {
    console.warn("⚠️ 检测到非用户主动的登出尝试，已阻止自动登出");
    console.warn("如需登出，请使用用户界面的登出按钮");
    return;
  }

  console.log("🚪 用户主动登出...");

  const refreshTokenValue = localStorage.getItem(
    TOKEN_CONFIG.REFRESH_TOKEN_KEY
  );
  const accessToken = getToken();

  // 如果有refresh token，尝试调用后端API使其失效
  if (refreshTokenValue && accessToken) {
    try {
      await authAxios.post(
        API_ENDPOINTS.AUTH.LOGOUT,
        {
          refreshToken: refreshTokenValue,
        },
        {
          headers: {
            Authorization: `${TOKEN_CONFIG.TOKEN_PREFIX} ${accessToken}`,
          },
        }
      );
    } catch (error) {
      // 即使后端调用失败也要清除本地存储
      console.warn("登出API调用失败，但会继续清除本地存储:", error.message);
    }
  }

  // 清除所有token相关信息
  localStorage.removeItem("token"); // 保持兼容性
  localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
  localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
  localStorage.removeItem(TOKEN_CONFIG.TOKEN_TYPE_KEY);
  localStorage.removeItem(TOKEN_CONFIG.EXPIRES_IN_KEY);
  localStorage.removeItem(TOKEN_CONFIG.EXPIRES_AT_KEY);

  // 跳转到登录页
  window.location.href = "/login";
};

// 获取当前token
export const getToken = () => {
  return (
    localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY) ||
    localStorage.getItem("token")
  );
};

// 检查token是否过期
export const isTokenExpired = () => {
  const expiresAt = localStorage.getItem(TOKEN_CONFIG.EXPIRES_AT_KEY);
  if (!expiresAt) return true;
  return Date.now() > parseInt(expiresAt);
};

// 获取当前用户信息
export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;

  try {
    // 简单解析JWT token获取用户信息 (仅获取username)
    const payload = JSON.parse(atob(token.split(".")[1]));
    return {
      id: 1, // 临时ID
      username: payload.sub || "unknown",
      name: payload.sub || "unknown",
    };
  } catch (error) {
    console.warn("无法解析token获取用户信息:", error);
    return {
      id: 1,
      username: "unknown",
      name: "用户",
    };
  }
};

// 检查是否已登录
export const isAuthenticated = () => {
  const token = getToken();
  return token && !isTokenExpired();
};

// 获取token剩余时间（秒）
export const getTokenRemainingTime = () => {
  const expiresAt = localStorage.getItem(TOKEN_CONFIG.EXPIRES_AT_KEY);
  if (!expiresAt) return 0;

  const remaining = Math.max(0, parseInt(expiresAt) - Date.now());
  return Math.floor(remaining / 1000); // 转换为秒
};

// 获取友好的token剩余时间显示
export const getTokenRemainingTimeDisplay = () => {
  const remainingSeconds = getTokenRemainingTime();

  if (remainingSeconds <= 0) return "已过期";

  const days = Math.floor(remainingSeconds / (24 * 60 * 60));
  const hours = Math.floor((remainingSeconds % (24 * 60 * 60)) / (60 * 60));
  const minutes = Math.floor((remainingSeconds % (60 * 60)) / 60);

  if (days > 0) return `${days}天${hours}小时`;
  if (hours > 0) return `${hours}小时${minutes}分钟`;
  return `${minutes}分钟`;
};

// 刷新token的函数 (底层服务，使用独立的axios实例)
export const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem(
    TOKEN_CONFIG.REFRESH_TOKEN_KEY
  );

  // 调试信息：检查refreshToken存储情况
  console.log("🔄 准备刷新Token:", {
    storageKey: TOKEN_CONFIG.REFRESH_TOKEN_KEY,
    refreshToken: refreshTokenValue ? "✅ 已找到" : "❌ 未找到",
    value: refreshTokenValue || "undefined",
  });

  // 检查localStorage中的所有token相关数据
  console.log("📱 当前localStorage状态:", {
    accessToken: localStorage.getItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY)
      ? "✅"
      : "❌",
    refreshToken: localStorage.getItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY)
      ? "✅"
      : "❌",
    tokenType: localStorage.getItem(TOKEN_CONFIG.TOKEN_TYPE_KEY) ? "✅" : "❌",
    expiresAt: localStorage.getItem(TOKEN_CONFIG.EXPIRES_AT_KEY) ? "✅" : "❌",
  });

  if (!refreshTokenValue) {
    throw new Error("没有可用的刷新token");
  }

  try {
    console.log("🔄 发送刷新请求到:", API_ENDPOINTS.AUTH.REFRESH);
    const response = await authAxios.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken: refreshTokenValue,
    });

    const data = response.data;

    if (data.code !== 200) {
      throw new Error(data.message || "刷新token失败");
    }

    // 更新存储的token信息
    const { accessToken, refreshToken: newRefreshToken, expiresIn } = data.data;

    // 刷新时也使用配置的7天失效时间
    const actualExpiresIn = TOKEN_CONFIG.DEFAULT_EXPIRES_IN;

    // 记录日志显示时间调整
    if (expiresIn !== actualExpiresIn) {
      console.log(
        `🔄 Token刷新时间已调整: ${expiresIn}秒 → ${actualExpiresIn}秒 (7天)`
      );
    }

    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem("token", accessToken); // 保持向后兼容性
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, newRefreshToken);
    localStorage.setItem(
      TOKEN_CONFIG.EXPIRES_IN_KEY,
      actualExpiresIn.toString()
    );
    localStorage.setItem(
      TOKEN_CONFIG.EXPIRES_AT_KEY,
      (Date.now() + actualExpiresIn * 1000).toString()
    );

    return accessToken;
  } catch (error) {
    // 刷新失败，不自动登出，只抛出错误
    console.warn("⚠️ Token刷新失败，请手动重新登录:", error.message);

    // 处理 axios 错误
    if (error.response) {
      const message = error.response.data?.message || "刷新token失败";
      throw new Error(message);
    } else if (error.request) {
      throw new Error("网络连接失败，请检查网络设置");
    } else {
      throw new Error(error.message || "刷新token失败");
    }
  }
};
