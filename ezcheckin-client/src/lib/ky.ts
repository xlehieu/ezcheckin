import ky from 'ky';
let refreshTokenPromise: Promise<void> | null = null;
const api = ky.create({
  baseUrl:process.env.NEXT_PUBLIC_API_URL,
  prefix: "api",
  timeout: 10000,
  credentials: 'include', 
  hooks: {
    // cấu hình thừ usage thư viện
   afterResponse: [
    
			({response}) => {
				// You could do something with the response, for example, logging.
				console.log(response)

				// Or return a `Response` instance to overwrite the response.
				return new Response('A different response', {status: 200});
			},

			// Or retry with a fresh token on a 401 error
			async ({request, response, retryCount}) => {
				if (response.status === 401 && (response as any).type==="TOKEN_EXPIRED" && retryCount === 0) {
          // Nếu chưa có request refresh nào đang chạy, thì tạo mới
          if (!refreshTokenPromise) {
            refreshTokenPromise = (async () => {
              try {
                await ky.post(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/refresh`, {
                  credentials: 'include',
                });
              } finally {
                // Refresh xong (dù thành công hay thất bại) thì xóa promise để lượt sau có thể refresh tiếp
                refreshTokenPromise = null;
              }
            })();
          }

          // Đợi cho đến khi quá trình refresh kết thúc
          await refreshTokenPromise;
					return ky.retry({
						request: new Request(request)
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
			({options, response, retryCount}) => {
				if (response.status >= 500 && response.status <= 599) {
					if (retryCount === options.retry.limit) {
						// showNotification('Request failed after all retries');
					}
				}
			}
		]
  },
});

export default api;