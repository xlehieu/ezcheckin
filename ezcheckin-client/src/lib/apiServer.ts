import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidateTag } from "next/cache";
import { AUTH_ROUTES } from "@/routes/auth/auth.route";

// tránh gọi refresh nhiều lần
let refreshTokenPromise: Promise<void> | null = null;

// 👉 options custom
interface FetchOptions extends RequestInit {
  tags?: string[];
  revalidate?: number;
  tagRevalidateAfterAction?: string;
  passError?: boolean;
}

// 👉 base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL!;

export async function request<T>(
  url: string,
  options: FetchOptions = {},
): Promise<T> {
  const { tags, revalidate, ...fetchOptions } = options;

  const headers = new Headers(fetchOptions.headers);

  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const isServer = typeof window === "undefined";

  // ✅ SERVER: attach cookie
  if (isServer) {
    const cookieStore = await cookies();
    // console.log("cookieStore",cookieStore)
    const cookieString = cookieStore.toString();
    // console.log("cookieStore",cookieStore)
    if (cookieString) {
      headers.set("Cookie", cookieString);
    }
  }

  const config: RequestInit = {
    ...fetchOptions,
    headers,
    credentials: "include", // client tự gửi cookie
    next: {
      revalidate: revalidate ?? 60,
      tags: tags || [],
    },
  };

  const res = await fetch(`${API_BASE_URL}/api${url}`, config);
  console.log("res", res);
  if (isServer) {
    const setCookies = res.headers.getSetCookie();

    const cookieStore = await cookies();

    for (const cookie of setCookies) {
      const [cookiePart] = cookie.split(";");

      const [name, value] = cookiePart.split("=");

      cookieStore.set(name, value, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        path: "/",
      });
    }
  }
  // 🔥 HANDLE 401
  if (!options.passError) {
    if (res.status === 401) {
      const errorData = await res.json().catch(() => ({}));

      if (errorData?.type === "TOKEN_EXPIRED") {
        return handleTokenRefresh<T>(url, options);
      }
      if (isServer) {
        redirect(AUTH_ROUTES.LOGIN);
      }

      throw new Error("UNAUTHORIZED");
    }

    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
  }
  // 👉 optional revalidate
  if (options?.tagRevalidateAfterAction) {
    revalidateTag(options.tagRevalidateAfterAction, "max");
  }

  return res.json();
}

// 🔁 refresh token
async function handleTokenRefresh<T>(
  url: string,
  options: FetchOptions,
): Promise<T> {
  const isServer = typeof window === "undefined";

  if (!refreshTokenPromise) {
    refreshTokenPromise = (async () => {
      try {
        const headers: HeadersInit = {};

        // server phải attach cookie
        if (isServer) {
          headers["Cookie"] = (await cookies()).toString();
        }

        const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers,
        });

        if (!res.ok) {
          throw new Error("Refresh failed");
        }

        // ❗ backend tự set cookie mới
      } catch (err) {
        console.error("[Refresh Failed]", err);

        if (isServer) {
          redirect(AUTH_ROUTES.LOGIN);
        }

        throw err;
      } finally {
        refreshTokenPromise = null;
      }
    })();
  }

  await refreshTokenPromise;

  // 🔁 retry request
  return request<T>(url, options);
}

// 👉 wrapper
export const apiServer = {
  get<T>(url: string, options?: FetchOptions) {
    return request<T>(url, {
      ...options,
      method: "GET",
    });
  },

  post<T>(url: string, body?: any, options?: FetchOptions) {
    return request<T>(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  put<T>(url: string, body?: any, options?: FetchOptions) {
    return request<T>(url, {
      ...options,
      method: "PUT",
      body: JSON.stringify(body),
    });
  },

  patch<T>(url: string, body?: any, options?: FetchOptions) {
    return request<T>(url, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(body),
    });
  },

  delete<T>(url: string, options?: FetchOptions) {
    return request<T>(url, {
      ...options,
      method: "DELETE",
    });
  },
};
