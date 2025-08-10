import {
  useInfiniteQuery,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { SearchPropertiesDto } from "src/dto/search/search-properties.dto";
import { SearchSongQueriesDto } from "src/dto/search/request/search-song-queries.dto";
import BibleChapterDto from "src/dto/common/bible-chapter.dto";
import BibleVerseDto from "src/dto/common/bible-verse.dto";
import { InfiniteSongSearchDto } from "src/dto/search/infinite-song-search.dto";
import CommonResponseDto from "src/dto/common/common-response.dto";
import {SongDetailDto} from "src/dto/common/song-detail.dto";
import {REVALIDATE_TIME_ONE_HOUR} from "src/constant/numbers.constant";
import {CoUsedSongDto} from "src/dto/song/CoUsedSongDto";
import buildQueryParams from "src/utils/buildQueryParams";
import ApiOptions from "src/app/api/ApiOptions";
import {apiRequestWithRefresh} from "src/app/api/apiRequestWithRefresh";
import {CreateSongDto} from "src/dto/song/CreateSongDto";

export const fetchSongCreate = async (createSongDto :CreateSongDto) => {
  const apiOptions: ApiOptions = {
    method: "POST",
    data: createSongDto,
    requiresAuth: true,
  }
  const data: SongDetailDto = await apiRequestWithRefresh(
      "/song",
      apiOptions
  );
  return data;
}

export const useInfiniteSearchSongQuery = (
  params: SearchSongQueriesDto,
  options = {}
) => {
  const apiOptions: ApiOptions = {
    useCache: true,
  }

  const { data, isLoading, ...rest } = useInfiniteQuery<InfiniteSongSearchDto>({
    queryKey: ["searchSongs", params],
    queryFn: async ({ pageParam = 0 }) => {
      const offset = pageParam as number;
      const fullParams: SearchSongQueriesDto = { ...params, offset }; // ✅ offset 추가
      const res: InfiniteSongSearchDto = await apiRequestWithRefresh(
          `/song/search?${buildQueryParams(fullParams)}`,
          apiOptions
      );
      return res;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextOffset ?? undefined,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return {
    data,
    isLoading,
    ...rest,
  };
};

export const fetchSongProperties = async () => {
  const apiOptions: ApiOptions = {
    useCache: true,
  }
  const data: SearchPropertiesDto = await apiRequestWithRefresh(
    "/song/properties",
    apiOptions
  );
  return data;
};

export function useSongPropertiesQuery() {
  return useQuery<SearchPropertiesDto>({
    queryKey: ["searchProperties"],
    queryFn: fetchSongProperties,
    staleTime: Infinity, // 무조건 fresh로 간주
    cacheTime: REVALIDATE_TIME_ONE_HOUR, // 1시간 동안 캐시 유지 (컴포넌트 언마운트 이후에도)
    refetchOnMount: false, // 마운트될 때 다시 요청 안 함
    refetchOnWindowFocus: false, // 창 포커스해도 재요청 안 함
  } as UseQueryOptions<SearchPropertiesDto>);
}

export const fetchBibleChapter = async (bibleId: string) => {
  const apiOptions: ApiOptions = {
    useCache: true,
  }
  const data: BibleChapterDto[] = await apiRequestWithRefresh(
    `/bible/${bibleId}/chapters`, apiOptions
  );
  return data;
};

export const fetchBibleVerse = async (bibleChapterId: string) => {
  const apiOptions: ApiOptions = {
    useCache: true,
  }
  const data: BibleVerseDto[] = await apiRequestWithRefresh(
    `/bible/${bibleChapterId}/verses`, apiOptions
  );
  return data;
};

export const fetchYoutubeVIdCheck = async (youtubeVId: string) => {
  const apiOptions: ApiOptions = {
    useCache: true,
  }
  const data: CommonResponseDto<boolean> = await apiRequestWithRefresh(
      `/song/youtube-v-id/check/${youtubeVId}`,
      apiOptions
  );
  return data;
};


export function useYoutubeVIdCheck(youtubeVId: string | null) {
  return useQuery<CommonResponseDto<boolean>>({
    queryKey: ["isYoutubeVIdExist", youtubeVId],
    queryFn: () => fetchYoutubeVIdCheck(youtubeVId!),
    enabled: !!youtubeVId, // youtubeVId가 존재할 때만 fetch
  } as UseQueryOptions<CommonResponseDto<boolean>>);
}

export const fetchSongDetail = async (songId: string) => {
  const apiOptions: ApiOptions = {
    useCache: true,
  }
  const data: SongDetailDto = await apiRequestWithRefresh(
      `/song/detail/${songId}`, apiOptions
  );
  return data;
}

export function useSongDetailQuery(songId: string) {
  return useQuery<SongDetailDto>({
    queryKey: ["song", songId],
    queryFn: () => fetchSongDetail(songId),
    staleTime: Infinity, // 무조건 fresh로 간주
    cacheTime: REVALIDATE_TIME_ONE_HOUR, // 1시간 동안 캐시 유지 (컴포넌트 언마운트 이후에도)
    refetchOnMount: false, // 마운트될 때 다시 요청 안 함
    refetchOnWindowFocus: false, // 창 포커스해도 재요청 안 함
  } as UseQueryOptions<SongDetailDto>);
}

export const fetchCoUsedSongs = async (songId: string) => {
  const apiOptions: ApiOptions = {
    useCache: true,
  }
  const data: CoUsedSongDto[] = await apiRequestWithRefresh(
      `/recommendation/co-used-songs/${songId}`, apiOptions
  );
  return data;
}

export function useCoUsedSongsQuery(songId: string) {
  return useQuery<CoUsedSongDto[]>({
    queryKey: ["coUsedSongs", songId],
    queryFn: () => fetchCoUsedSongs(songId),
    staleTime: Infinity, // 무조건 fresh로 간주
    cacheTime: REVALIDATE_TIME_ONE_HOUR, // 1시간 동안 캐시 유지 (컴포넌트 언마운트 이후에도)
    refetchOnMount: false, // 마운트될 때 다시 요청 안 함
    refetchOnWindowFocus: false, // 창 포커스해도 재요청 안 함
  } as UseQueryOptions<CoUsedSongDto[]>);
}