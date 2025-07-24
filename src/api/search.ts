import { useQuery, UseQueryOptions } from "@tanstack/react-query";
import { apiRequestGet } from "./apiRequestGet";
import { SearchPropertiesDto } from "src/dto/search/search-properties.dto";
import { SongDetailDto } from "src/dto/search/song-detail.dto";
import { SearchSongQueriesDto } from "src/dto/search/request/search-song-queries.dto";

export function useSearchSongQuery(params: SearchSongQueriesDto) {
  const queryString = buildQueryParams(params);

  return useQuery<SongDetailDto[]>({
    queryKey: ["worshipSongs", queryString],
    queryFn: async () => {
      return apiRequestGet(`/song/search?${queryString}`, false);
    },
    enabled: true,
    staleTime: 60 * 1000,
  });
}

export const fetchSearchProperties = async () => {
  const data: SearchPropertiesDto = await apiRequestGet(
    "/song/search/properties",
    true
  );
  return data;
};

export function useSearchPropertiesQuery() {
  return useQuery<SearchPropertiesDto>({
    queryKey: ["searchProperties"],
    queryFn: fetchSearchProperties,
    staleTime: Infinity, // 무조건 fresh로 간주
    cacheTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지 (컴포넌트 언마운트 이후에도)
    refetchOnMount: false, // 마운트될 때 다시 요청 안 함
    refetchOnWindowFocus: false, // 창 포커스해도 재요청 안 함
  } as UseQueryOptions<SearchPropertiesDto>);
}

const buildQueryParams = (params: SearchSongQueriesDto) => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value && value !== "전체") {
      searchParams.set(key, value as string);
    }
  }

  return searchParams.toString();
};
