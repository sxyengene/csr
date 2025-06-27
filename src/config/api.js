/**
 * URL 参数替换工具 - 使用 lodash 模板引擎优化
 */
import { template } from "lodash";

/**
 * API 基础配置和标准化处理
 */

// API 基础配置
export const API_CONFIG = {
  BASE_URL: "http://8.133.240.77:8080",
  TIMEOUT: 10000,
  RETRY_COUNT: 3,
  RETRY_DELAY: 1000,
};

// 标准响应码
export const RESPONSE_CODES = {
  SUCCESS: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  SERVER_ERROR: 500,
  NETWORK_ERROR: 0,
};

// 响应消息映射
export const RESPONSE_MESSAGES = {
  [RESPONSE_CODES.SUCCESS]: "操作成功",
  [RESPONSE_CODES.BAD_REQUEST]: "请求参数错误",
  [RESPONSE_CODES.UNAUTHORIZED]: "未认证或登录已过期",
  [RESPONSE_CODES.FORBIDDEN]: "权限不足",
  [RESPONSE_CODES.NOT_FOUND]: "请求的资源不存在",
  [RESPONSE_CODES.SERVER_ERROR]: "服务器内部错误",
  [RESPONSE_CODES.NETWORK_ERROR]: "网络连接失败",
};

// 默认请求头
export const DEFAULT_HEADERS = {
  "Content-Type": "application/json",
  Accept: "application/json",
};

// Token 相关配置
export const TOKEN_CONFIG = {
  ACCESS_TOKEN_KEY: "accessToken",
  REFRESH_TOKEN_KEY: "refreshToken",
  TOKEN_TYPE_KEY: "tokenType",
  EXPIRES_IN_KEY: "tokenExpiresIn",
  EXPIRES_AT_KEY: "tokenExpiresAt",
  TOKEN_PREFIX: "Bearer",
};

/**
 * 标准响应格式类型定义
 */
export class ApiResponse {
  constructor(code, message, data = null) {
    this.code = code;
    this.message = message;
    this.data = data;
  }

  /**
   * 检查响应是否成功
   */
  isSuccess() {
    return this.code === RESPONSE_CODES.SUCCESS;
  }

  /**
   * 获取响应数据
   */
  getData() {
    return this.data;
  }

  /**
   * 获取错误信息
   */
  getErrorMessage() {
    return this.isSuccess() ? null : this.message;
  }
}

/**
 * 创建成功响应
 */
export const createSuccessResponse = (data, message = "操作成功") => {
  return new ApiResponse(RESPONSE_CODES.SUCCESS, message, data);
};

/**
 * 创建错误响应
 */
export const createErrorResponse = (code, message, data = null) => {
  return new ApiResponse(code, message, data);
};

/**
 * 解析 API 响应
 */
export const parseApiResponse = (response) => {
  // 如果已经是 ApiResponse 实例，直接返回
  if (response instanceof ApiResponse) {
    return response;
  }

  // 如果是标准格式，创建 ApiResponse 实例
  if (response && typeof response === "object" && "code" in response) {
    return new ApiResponse(response.code, response.message, response.data);
  }

  // 如果不是标准格式，包装为成功响应
  return createSuccessResponse(response);
};

/**
 * 获取友好的错误信息
 */
export const getFriendlyErrorMessage = (code, originalMessage) => {
  // 优先使用服务器返回的错误信息
  if (originalMessage && originalMessage !== "Success") {
    return originalMessage;
  }

  // 使用预定义的错误信息
  return RESPONSE_MESSAGES[code] || "未知错误";
};

/**
 * 检查是否需要重新登录
 */
export const shouldReLogin = (code) => {
  return code === RESPONSE_CODES.UNAUTHORIZED;
};

/**
 * 检查是否为网络错误
 */
export const isNetworkError = (error) => {
  return (
    error.name === "TypeError" ||
    error.message.includes("fetch") ||
    error.message.includes("network") ||
    error.message.includes("timeout")
  );
};

/**
 * API 端点常量
 */
export const API_ENDPOINTS = {
  // 认证相关
  AUTH: {
    LOGIN: "/api/auth/login",
    LOGOUT: "/api/auth/logout",
    REFRESH: "/api/auth/refresh",
    VALIDATE: "/api/auth/validate",
  },

  // 用户管理
  USERS: {
    LIST: "/api/users",
    DETAIL: "/api/users/{id}",
    CREATE: "/api/users",
    UPDATE: "/api/users/{id}",
    DELETE: "/api/users/{id}",
    BATCH_DELETE: "/api/users/batch-delete",
    UPDATE_REVIEWER: "/api/users/{id}/reviewer",
    RESET_PASSWORD: "/api/users/{id}/reset-password",
    EVENTS: "/api/users/{id}/events",
    ACTIVITIES: "/api/users/{id}/activities",
  },

  // 事件管理
  EVENTS: {
    LIST: "/api/events",
    DETAIL: "/api/events/{id}",
    CREATE: "/api/events",
    UPDATE: "/api/events/{id}",
    DELETE: "/api/events/{id}",
    UPDATE_DISPLAY: "/api/events/{id}/display",
  },

  // 活动管理
  ACTIVITIES: {
    LIST: "/api/activities",
    DETAIL: "/api/activities/{id}",
    CREATE: "/api/activities",
    UPDATE: "/api/activities/{id}",
    DELETE: "/api/activities/{id}",
  },
};

export const buildUrl = (endpoint, params = {}) => {
  // 使用 lodash 模板引擎，更强大且安全
  const compiledUrl = template(endpoint, {
    interpolate: /\{(.+?)\}/g,
  });
  return compiledUrl(params);
};

/**
 * 请求重试配置
 */
export const RETRY_CONFIG = {
  retryCount: API_CONFIG.RETRY_COUNT,
  retryDelay: API_CONFIG.RETRY_DELAY,
  retryCondition: (error, attempt) => {
    // 网络错误或 5xx 错误才重试
    return (
      (isNetworkError(error) || (error.code >= 500 && error.code < 600)) &&
      attempt < API_CONFIG.RETRY_COUNT
    );
  },
};
