import axios, {
  AxiosInstance,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig,
  CancelTokenSource,
  AxiosRequestConfig,
} from "axios";
import { ref } from "vue";
import { getHttpStatusMessage } from "./helper/getHttpStatusMessage";
import { ElMessage } from "element-plus";

// 创建 Axios 实例
const instance: AxiosInstance = axios.create({
  // 设置基础 URL(自动根据环境配置不同的 BASE_URL)
  // baseURL: import.meta.env.VITE_APP_API_BASE_URL,
  baseURL: "/api",
  // 设置超时时间
  timeout: 5000,
});

// 定义请求计数器和取消令牌集合
let requestCount = 0;
let cancelTokens: CancelTokenSource[] = [];

// 请求拦截器
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 在发送请求之前做一些处理
    const token = localStorage.getItem("token") || null;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    // 生成取消令牌
    const cancelToken = axios.CancelToken.source();
    config.cancelToken = cancelToken.token;

    // 添加取消令牌到集合
    cancelTokens.push(cancelToken);

    // 请求计数器增加
    requestCount++;

    return config;
  },
  (error: AxiosError) => {
    // 请求错误处理
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    if (response.data.code != 200) {
      return ElMessage.error(response.data.msg);
    }
    // 对响应数据做一些处理
    return response.data;
  },
  (error: any) => {
    // 响应错误处理
    if (axios.isCancel(error)) {
      // 如果是取消请求的错误，直接抛出错误
      throw error;
    }

    if (error && error.response) {
      // 响应已接收，但状态码不在 2xx 范围内
      const { status, data } = error.response;
      const errorMessage =
        data && data.message ? data.message : getHttpStatusMessage(status);
      ElMessage.error(`错误代码：${status}，错误信息：${errorMessage}`);
    } else if (error.request) {
      // 请求已发出，但未收到响应
      ElMessage.error("请求失败，请检查网络连接");
    } else {
      // 其他错误
      ElMessage.error("请求出错");
    }

    return Promise.reject(error);
  }
);

const useHttp = () => {
  const loading = ref(false);

  const request = async <T = any>(config: AxiosRequestConfig): Promise<T> => {
    try {
      // 开始请求时设置加载状态为 true
      loading.value = true;
      const response = await instance.request<T>(config);
      return response as T;
    } catch (error) {
      throw error;
    } finally {
      // 请求结束后设置加载状态为 false
      loading.value = false;
    }
  };

  const cancel = (message?: string): void => {
    // 取消最新的请求
    if (requestCount > 0) {
      cancelTokens[requestCount - 1].cancel(message);
      cancelTokens.pop();
      requestCount--;
    }
  };

  const cancelAll = (message?: string): void => {
    // 取消所有未完成的请求
    cancelTokens.forEach((cancelToken) => {
      cancelToken.cancel(message);
    });
    cancelTokens = [];
    requestCount = 0;
  };

  return {
    request,
    cancel,
    cancelAll,
    loading,
  };
};

export default useHttp;
