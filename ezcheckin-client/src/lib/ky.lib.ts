import { APIResponse } from "@/@types/response.type";
import ky from "ky";
let refreshTokenPromise: Promise<void> | null = null;
const api = ky.create({
  baseUrl: process.env.NEXT_PUBLIC_API_URL,
  prefix: "api",
  timeout: 10000,
  credentials: "include",
  hooks: {
    // cấu hình thừ usage thư viện
    afterResponse: [
      async ({ response }) => {
        console.log("[API]", response.status, response.url);

        if (response.status === 204) return; // No content

        const clonedResponse = response.clone();
        const json = await clonedResponse.json();

        // Return response với .json() đã được cache
        return new Response(JSON.stringify(json), {
          status: response.status,
          headers: response.headers,
        });
      },

      // Or retry with a fresh token on a 401 error
      async ({ request, response, retryCount }) => {
        if (
          response.status === 401 &&
          (response as any).type === "TOKEN_EXPIRED" &&
          retryCount === 0
        ) {
          // Nếu chưa có request refresh nào đang chạy, thì tạo mới
          if (!refreshTokenPromise) {
            refreshTokenPromise = (async () => {
              try {
                await ky.post(
                  `${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`,
                  {
                    credentials: "include",
                  },
                );
              } finally {
                // Refresh xong (dù thành công hay thất bại) thì xóa promise để lượt sau có thể refresh tiếp
                refreshTokenPromise = null;
              }
            })();
          }

          // Đợi cho đến khi quá trình refresh kết thúc
          await refreshTokenPromise;
          return ky.retry({
            request: new Request(request),
          });
        }
      },

      // // Or force retry based on response body content
      // async ({response}) => {
      // 	if (response.status === 200) {
      // 		const data = await response.json();
      // 		if (data.error?.code === 'RATE_LIMIT') {
      // 			// Retry with custom delay from API response
      // 			return ky.retry({
      // 				delay: data.error.retryAfter * 1000,
      // 				code: 'RATE_LIMIT'
      // 			});
      // 		}
      // 	}
      // },

      // Or show a notification only on the last retry for 5xx errors
      ({ options, response, retryCount }) => {
        if (response.status >= 500 && response.status <= 599) {
          if (retryCount === options.retry.limit) {
            // showNotification('Request failed after all retries');
          }
        }
      },
    ],
  },
});

const apiClient = {
  get: <T>(url: string) => api.get(url).json<APIResponse<T>>(),

  post: <T>(url: string, body: any) =>
    api.post(url, { json: body }).json<APIResponse<T>>(),

  put: <T>(url: string, body: any) =>
    api.put(url, { json: body }).json<APIResponse<T>>(),
  patch: <T>(url: string, body: any) =>
    api.patch(url, { json: body }).json<APIResponse<T>>(),
  delete: <T>(url: string) => api.delete(url).json<APIResponse<T>>(),
};
export default apiClient;
