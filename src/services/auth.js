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

    // 提取token信息
    const { accessToken, refreshToken, tokenType, expiresIn } = data.data;

    // 存储token信息到localStorage
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, refreshToken);
    localStorage.setItem(TOKEN_CONFIG.TOKEN_TYPE_KEY, tokenType);
    localStorage.setItem(TOKEN_CONFIG.EXPIRES_IN_KEY, expiresIn.toString());
    localStorage.setItem(
      TOKEN_CONFIG.EXPIRES_AT_KEY,
      (Date.now() + expiresIn * 1000).toString()
    );

    // 返回格式化的响应，适配前端组件期望的格式
    return {
      token: accessToken, // 保持与现有代码兼容
      accessToken,
      refreshToken,
      tokenType,
      expiresIn,
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

// 退出登录
export const logout = () => {
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

// 刷新token的函数 (底层服务，使用独立的axios实例)
export const refreshToken = async () => {
  const refreshTokenValue = localStorage.getItem(
    TOKEN_CONFIG.REFRESH_TOKEN_KEY
  );
  if (!refreshTokenValue) {
    throw new Error("没有可用的刷新token");
  }

  try {
    const response = await authAxios.post(API_ENDPOINTS.AUTH.REFRESH, {
      refreshToken: refreshTokenValue,
    });

    const data = response.data;

    if (data.code !== 200) {
      throw new Error(data.message || "刷新token失败");
    }

    // 更新存储的token信息
    const { accessToken, refreshToken: newRefreshToken, expiresIn } = data.data;
    localStorage.setItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY, accessToken);
    localStorage.setItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY, newRefreshToken);
    localStorage.setItem(
      TOKEN_CONFIG.EXPIRES_AT_KEY,
      (Date.now() + expiresIn * 1000).toString()
    );

    return accessToken;
  } catch (error) {
    // 刷新失败，清除所有token并跳转登录
    logout();

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
