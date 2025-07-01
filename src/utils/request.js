import axios from "axios";
import { merge } from "lodash";
import { message } from "antd";
import { getToken, isTokenExpired, refreshToken } from "../services/auth";
import {
  API_CONFIG,
  TOKEN_CONFIG,
  RESPONSE_CODES,
  parseApiResponse,
  createErrorResponse,
  getFriendlyErrorMessage,
} from "../config/api";

// 创建 axios 实例
const axiosInstance = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// 请求拦截器 - 自动添加 token
axiosInstance.interceptors.request.use(
  async (config) => {
    // 登录接口不需要添加 token
    if (config.url?.includes("/auth/login")) {
      return config;
    }

    // 获取当前 token
    const token = getToken();

    if (token) {
      // 检查 token 是否过期
      if (isTokenExpired()) {
        // 检查是否有refreshToken可用
        const hasRefreshToken = localStorage.getItem(
          TOKEN_CONFIG.REFRESH_TOKEN_KEY
        );

        if (hasRefreshToken) {
          try {
            // 尝试刷新 token
            console.log("🔄 Token已过期，尝试自动刷新...");
            const newToken = await refreshToken();
            config.headers.Authorization = `${TOKEN_CONFIG.TOKEN_PREFIX} ${newToken}`;
            console.log("✅ Token刷新成功");
          } catch (error) {
            // 刷新失败，不自动登出，只返回错误
            console.warn("❌ Token刷新失败:", error.message);
            return Promise.reject(
              createErrorResponse(
                RESPONSE_CODES.UNAUTHORIZED,
                "Token已过期且刷新失败，请重新登录"
              )
            );
          }
        } else {
          // 没有refreshToken，使用过期的token继续请求，让后端返回401
          console.warn("⚠️ Token已过期但无refreshToken，使用过期token继续请求");
          config.headers.Authorization = `${TOKEN_CONFIG.TOKEN_PREFIX} ${token}`;
        }
      } else {
        // token 有效，直接使用
        config.headers.Authorization = `${TOKEN_CONFIG.TOKEN_PREFIX} ${token}`;
      }
    }

    return config;
  },
  (error) => {
    return Promise.reject(
      createErrorResponse(RESPONSE_CODES.NETWORK_ERROR, "请求配置错误")
    );
  }
);

// 响应拦截器 - 统一处理响应和错误
axiosInstance.interceptors.response.use(
  (response) => {
    // 解析为标准响应格式
    const apiResponse = parseApiResponse(response.data);

    // 检查业务状态码
    if (!apiResponse.isSuccess()) {
      const errorMessage = getFriendlyErrorMessage(
        apiResponse.code,
        apiResponse.message
      );

      // 不再自动登出，只返回错误信息
      // 用户可以根据需要手动重新登录

      return Promise.reject(
        createErrorResponse(apiResponse.code, errorMessage, apiResponse.data)
      );
    }

    return apiResponse;
  },
  async (error) => {
    const originalRequest = error.config;

    // 处理 HTTP 错误
    if (error.response) {
      const { status, data } = error.response;

      // 处理401错误 - 尝试refresh token
      if (status === 401 && !originalRequest._retry) {
        const refreshTokenValue = localStorage.getItem(
          TOKEN_CONFIG.REFRESH_TOKEN_KEY
        );

        if (
          refreshTokenValue &&
          !originalRequest.url?.includes("/auth/login")
        ) {
          originalRequest._retry = true; // 标记避免无限重试

          try {
            console.log("🔄 收到401错误，尝试刷新token...");
            const newToken = await refreshToken();

            // 更新原请求的Authorization header
            originalRequest.headers.Authorization = `${TOKEN_CONFIG.TOKEN_PREFIX} ${newToken}`;

            console.log("✅ Token刷新成功，重试原请求");
            // 使用新token重试原请求
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            console.error("❌ Token刷新失败:", refreshError.message);
            // 刷新失败，清除所有token并提示重新登录
            localStorage.removeItem(TOKEN_CONFIG.ACCESS_TOKEN_KEY);
            localStorage.removeItem(TOKEN_CONFIG.REFRESH_TOKEN_KEY);
            localStorage.removeItem("token");

            return Promise.reject(
              createErrorResponse(
                RESPONSE_CODES.UNAUTHORIZED,
                "登录已过期且无法刷新，请重新登录"
              )
            );
          }
        }
      }

      const errorMessage = data?.message || getFriendlyErrorMessage(status);
      const standardError = createErrorResponse(status, errorMessage, data);

      // 记录错误日志
      console.error(`API请求失败 [${status}]:`, {
        url: error.config?.url,
        method: error.config?.method?.toUpperCase(),
        status,
        message: errorMessage,
        data,
      });

      return Promise.reject(standardError);
    } else if (error.request) {
      // 网络错误
      const networkError = createErrorResponse(
        RESPONSE_CODES.NETWORK_ERROR,
        "网络连接失败，请检查网络设置"
      );

      console.error("网络请求失败:", error.request);
      return Promise.reject(networkError);
    } else {
      // 其他错误
      const otherError = createErrorResponse(
        RESPONSE_CODES.SERVER_ERROR,
        error.message || "请求失败"
      );

      console.error("请求配置错误:", error.message);
      return Promise.reject(otherError);
    }
  }
);

/**
 * GET 请求
 * @param {string} url - 请求URL
 * @param {object} params - 查询参数
 * @param {object} config - axios配置
 * @returns {Promise<ApiResponse>}
 */
export const get = (url, params = {}, config = {}) => {
  // 使用 lodash merge 进行深度合并配置
  const mergedConfig = merge({}, { params }, config);
  return axiosInstance.get(url, mergedConfig);
};

/**
 * POST 请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求数据
 * @param {object} config - axios配置
 * @returns {Promise<ApiResponse>}
 */
export const post = (url, data = {}, config = {}) => {
  return axiosInstance.post(url, data, config);
};

/**
 * PUT 请求
 * @param {string} url - 请求URL
 * @param {object} data - 请求数据
 * @param {object} config - axios配置
 * @returns {Promise<ApiResponse>}
 */
export const put = (url, data = {}, config = {}) => {
  return axiosInstance.put(url, data, config);
};

/**
 * DELETE 请求
 * @param {string} url - 请求URL
 * @param {object} config - axios配置
 * @returns {Promise<ApiResponse>}
 */
export const del = (url, config = {}) => {
  return axiosInstance.delete(url, config);
};

/**
 * 便捷方法：获取响应数据
 * 直接返回data字段，简化业务代码
 */
export const getData = async (requestPromise) => {
  try {
    const response = await requestPromise;
    return response.getData();
  } catch (error) {
    throw error;
  }
};

/**
 * 便捷方法：处理响应错误
 * 统一的错误处理，返回友好的错误信息
 */
export const handleApiError = (error) => {
  if (error.code !== undefined) {
    // 已经是标准化的API错误
    return error.getErrorMessage();
  }

  // 其他类型的错误
  return error.message || "请求失败";
};

/**
 * 显示标准化的错误消息
 * 根据错误类型显示相应的提示信息
 */
export const showApiError = (error, defaultMessage = "操作失败，请重试") => {
  console.error("API错误:", error);

  // 处理验证错误 (400)
  if (error.code === 400 && error.data && typeof error.data === "object") {
    const validationErrors = error.data;
    const errorMessages = Object.entries(validationErrors).map(
      ([field, msg]) => {
        return `${field}: ${msg}`;
      }
    );
    message.error(`表单验证失败：${errorMessages.join("；")}`);
    return;
  }

  // 处理认证错误 (401)
  if (error.code === 401) {
    message.error("登录已过期，请重新登录");
    return;
  }

  // 处理权限错误 (403)
  if (error.code === 403) {
    message.error("权限不足，无法执行此操作");
    return;
  }

  // 处理资源不存在 (404)
  if (error.code === 404) {
    message.error("请求的资源不存在");
    return;
  }

  // 处理服务器错误 (500+)
  if (error.code >= 500) {
    message.error("服务器内部错误，请稍后重试");
    return;
  }

  // 其他错误，显示具体错误信息或默认消息
  if (error.message) {
    message.error(
      `${defaultMessage.replace("，请重试", "")}：${error.message}`
    );
  } else {
    message.error(defaultMessage);
  }
};

// 导出 axios 实例供高级用法使用
export { axiosInstance };

// 导出配置常量
export { API_CONFIG, RESPONSE_CODES, TOKEN_CONFIG };
