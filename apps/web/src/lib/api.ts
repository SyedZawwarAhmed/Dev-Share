import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";

// Type definitions for better TypeScript support
interface ApiResponse<T = unknown> {
  data: T;
  status: number;
  statusText: string;
}

interface ApiError extends Error {
  status?: number;
  response?: AxiosResponse;
}

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = import.meta.env.VITE_API_URL || "") {
    this.baseURL = baseURL;

    // Create axios instance with default config
    this.api = axios.create({
      baseURL: this.baseURL,
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Request interceptor
    this.api.interceptors.request.use(
      (config) => {
        // The HttpOnly cookie will be automatically included
        // No manual token handling needed
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        console.log("\n\n ---> apps/web/src/lib/api.ts:51 -> error: ", error);
        if (error.response?.status === 401) {
          // Handle unauthorized access
          // You might want to redirect to login page
          window.location.href = "/login";
        }
        return Promise.reject(this.handleError(error));
      }
    );
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = new Error(
      error.response?.data?.message || "An unexpected error occurred"
    );
    apiError.status = error.response?.status;
    apiError.response = error.response;
    return apiError;
  }

  /**
   * Generic request method
   */
  private async request<T>(
    config: AxiosRequestConfig
  ): Promise<ApiResponse<T>> {
    const response = await this.api.request<T>(config);
    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
    };
  }

  /**
   * GET request
   */
  async get<T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: "GET",
      url: endpoint,
    });
  }

  /**
   * POST request
   */
  async post<T>(
    endpoint: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: "POST",
      url: endpoint,
      data,
    });
  }

  /**
   * PUT request
   */
  async put<T>(
    endpoint: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: "PUT",
      url: endpoint,
      data,
    });
  }

  /**
   * DELETE request
   */
  async delete<T>(
    endpoint: string,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: "DELETE",
      url: endpoint,
    });
  }

  /**
   * PATCH request
   */
  async patch<T>(
    endpoint: string,
    data?: unknown,
    config: AxiosRequestConfig = {}
  ): Promise<ApiResponse<T>> {
    return this.request<T>({
      ...config,
      method: "PATCH",
      url: endpoint,
      data,
    });
  }

  /**
   * Check authentication status
   */
  async checkAuth(): Promise<boolean> {
    try {
      await this.get("/auth/verify");
      return true;
    } catch (error) {
      return false;
    }
  }
}

// Create and export singleton instance
const apiService = new ApiService();
export default apiService;
