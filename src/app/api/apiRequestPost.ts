import { revalidateTime } from "src/constant/numbers.constant";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface FetchOptions {
  method: "POST";
  headers: {
    "Content-Type": string;
    Authorization?: string;
  };
  body: string;
  credentials: any;
  signal: any;
  cache?: any;
  next?: any;
}

export const apiRequestPost = async (
  path: string,
  data: any,
  useCache: boolean,
  accessToken?: string | null,
  isSSG?: boolean
) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 20000); // 20초 타임아웃 설정

  const fetchOptions: FetchOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
    },
    body: JSON.stringify(data),
    credentials: "include", // withCredentials에 해당하는 부분
    signal: controller.signal, // 타임아웃 제어를 위한 AbortController
  };

  if (isSSG) {
    fetchOptions.next = { revalidate: revalidateTime };
  } else {
    fetchOptions.cache = useCache ? "force-cache" : "no-cache";
  }

  try {
    const response = await fetch(`${BASE_URL}${path}`, fetchOptions);

    clearTimeout(timeoutId); // 요청이 완료되면 타임아웃 클리어

    if (response.ok) {
      // 200-299 상태일 때만 처리
      const data = await response.json();
      return data;
    } else {
      const errorBody = await response.json().catch(() => null); // JSON 파싱 실패 대비
      const error: any = new Error("API 요청 실패");
      error.status = response.status;
      error.statusText = response.statusText;
      error.body = errorBody;
      throw error;
    }
  } catch (error: any) {
    if (error.name === "AbortError") {
      console.error(`[GET] Request timed out for ${path}`);
    } else {
      console.error(`[GET] Error fetching data from ${path}:`, error);
    }
    throw error;
  }
};
