import {
  useInfiniteQuery,
  useQuery,
  UseQueryOptions,
} from "@tanstack/react-query";
import { apiRequestGet } from "./apiRequestGet";
import { SearchPropertiesDto } from "src/dto/search/search-properties.dto";
import { SearchSongQueriesDto } from "src/dto/search/request/search-song-queries.dto";
import BibleChapterDto from "src/dto/common/bible-chapter.dto";
import BibleVerseDto from "src/dto/common/bible-verse.dto";
import { InfiniteSongSearchDto } from "src/dto/search/infinite-song-search.dto";
import CommonResponseDto from "src/dto/common/common-response.dto";
import type { NextApiRequest, NextApiResponse } from 'next';


export const useInfiniteSearchSongQuery = (
  params: SearchSongQueriesDto,
  options = {}
) => {
  const { data, isLoading, ...rest } = useInfiniteQuery<InfiniteSongSearchDto>({
    queryKey: ["searchSongs", params],
    queryFn: async () => {
      const res: InfiniteSongSearchDto = await apiRequestGet(
        `/song/search?${buildQueryParams({ ...params })}`,
        true
      );
      return res;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage) => lastPage?.nextOffset ?? undefined,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return {
    data,
    isLoading,
    ...rest,
  };
};

const buildQueryParams = (params: SearchSongQueriesDto) => {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value && value !== "전체") {
      searchParams.set(key, value as string);
    }
  }

  return searchParams.toString();
};

export const fetchSongProperties = async () => {
  const data: SearchPropertiesDto = await apiRequestGet(
    "/song/properties",
    true
  );
  return data;
};

export function useSongPropertiesQuery() {
  return useQuery<SearchPropertiesDto>({
    queryKey: ["searchProperties"],
    queryFn: fetchSongProperties,
    staleTime: Infinity, // 무조건 fresh로 간주
    cacheTime: 1000 * 60 * 60, // 1시간 동안 캐시 유지 (컴포넌트 언마운트 이후에도)
    refetchOnMount: false, // 마운트될 때 다시 요청 안 함
    refetchOnWindowFocus: false, // 창 포커스해도 재요청 안 함
  } as UseQueryOptions<SearchPropertiesDto>);
}

export const fetchBibleChapter = async (bibleId: string) => {
  const data: BibleChapterDto[] = await apiRequestGet(
    `/bible/${bibleId}/chapters`,
    true
  );
  return data;
};

export const fetchBibleVerse = async (bibleChapterId: string) => {
  const data: BibleVerseDto[] = await apiRequestGet(
    `/bible/${bibleChapterId}/verses`,
    true
  );
  return data;
};

export const fetchYoutubeVIdCheck = async (youtubeVId: string) => {
  const data: CommonResponseDto<boolean> = await apiRequestGet(
      `/song/youtube-v-id/check/${youtubeVId}`,
      true
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

// export async function fetchYoutubeVideoInfo(req: NextApiRequest, res: NextApiResponse) {
//   const videoId = req.query.v as string;
//
//   if (!videoId) {
//     return res.status(400).json({ error: "Missing video ID" });
//   }
//
//   const apiKey = process.env.YOUTUBE_API_KEY;
//
//   const response = await fetch(
//       `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails&id=${videoId}&key=${apiKey}`
//   );
//
//   const data = await response.json();
//
//   return res.status(200).json(data);
// }

//
// export function useYoutubeVideoInfo(youtubeVId: string | null, enabled: boolean) {
//   return useQuery({
//     queryKey: ["youtubeVideoInfo", youtubeVId],
//     queryFn: () => fetchYoutubeVideoInfo(youtubeVId!),
//     enabled: !!youtubeVId && enabled,
//     staleTime: 1000 * 60 * 5,
//     retry: 1,
//   });
// }