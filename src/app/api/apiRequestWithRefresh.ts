import {
  REVALIDATE_TIME_THREE_HOUR
} from "src/constant/numbers.constant";
import { useAuthStore } from "src/store/useAuthStore";
import AccessTokenDto from "src/dto/auth/access-token.dto";
import ApiOptions from "src/app/api/ApiOptions";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

async function fetchWithTimeout(url: string, options: RequestInit, timeout = 20000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  const res = await fetch(url, { ...options, signal: controller.signal });
  clearTimeout(id);
  return res;
}

export async function apiRequestWithRefresh(
  path: string,
  { method = "GET", data, useCache = false, isSSG = false, requiresAuth = false }: ApiOptions = {}
) {
  const authStore = useAuthStore.getState();
  let accessToken = authStore.accessToken;

  // 요청 옵션 기본값
  const fetchOptions: RequestInit & { next?: any; cache?: any } = {
    method,
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  };

  if (requiresAuth && accessToken) {
    (fetchOptions.headers as Record<string, string>).Authorization = `Bearer ${accessToken}`;
  }
  if (data) {
    fetchOptions.body = JSON.stringify(data);
  }
  if (isSSG) {
    (fetchOptions as any).next = { revalidate: REVALIDATE_TIME_THREE_HOUR };
  } else {
    fetchOptions.cache = useCache ? "force-cache" : "no-cache";
  }

  const requestUrl = `${BASE_URL}${path}`;

  const doFetch = async (tokenOverride?: string) => {
    if (requiresAuth && tokenOverride) {
      (fetchOptions.headers as Record<string, string>).Authorization = `Bearer ${tokenOverride}`;
    }
    return await fetchWithTimeout(requestUrl, fetchOptions);
  };

  let response = await doFetch();

  // 401 → 토큰 재발급 시도
  if (requiresAuth && response.status === 401) {
    try {
      const tokenRes = await fetchWithTimeout(`${BASE_URL}/auth/token`, {
        method: "GET",
        credentials: "include",
        cache: "no-cache",
      });
      if (!tokenRes.ok) throw new Error("토큰 재발급 실패");

      const tokenData: AccessTokenDto = await tokenRes.json();
      if (!tokenData?.accessToken) throw new Error("토큰 재발급 실패");

      // 전역 상태 갱신
      useAuthStore.getState().setAccessToken(tokenData.accessToken);
      accessToken = tokenData.accessToken;

      // 재시도
      response = await doFetch(accessToken);
    } catch (err) {
      // 재발급 실패 → 로그아웃
      authStore.logout();
      throw err;
    }
  }

  if (response.ok) {
    try {
      return await response.json();
    } catch {
      return null;
    }
  } else {
    const errorBody = await response.json().catch(() => null);

    const errorMessage = errorBody?.message || `Request failed with status ${response.status}`;

    const error: any = new Error(errorMessage);
    error.status = response.status;
    error.body = errorBody;
    throw error;
  }
}
