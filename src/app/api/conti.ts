import {
    useInfiniteQuery, useQuery, UseQueryOptions,
} from "@tanstack/react-query";
import buildQueryParams from "src/utils/buildQueryParams";
import {InfiniteContiSearchDto} from "src/dto/search/infinite-conti-search.dto";
import {SearchContiQueriesDto} from "src/dto/search/request/search-conti-queries.dto";
import CommonResponseDto from "src/dto/common/common-response.dto";
import {apiRequestWithRefresh} from "src/app/api/apiRequestWithRefresh";
import ApiOptions from "src/app/api/ApiOptions";
import {REVALIDATE_TIME_ONE_HOUR} from "src/constant/numbers.constant";
import {SearchContiPropertiesDto} from "src/dto/conti/search-conti-properties.dto";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";

export const useInfiniteSearchContiQuery = (
    params: SearchContiQueriesDto,
    options = {}
) => {
    const apiOptions: ApiOptions = {
        useCache: true,
    }

    const { data, isLoading, ...rest } = useInfiniteQuery<InfiniteContiSearchDto>({
        queryKey: ["searchContis", params],
        queryFn: async ({ pageParam = 0 }) => {
            const offset = pageParam as number;
            const fullParams: SearchContiQueriesDto = { ...params, offset }; // ✅ offset 추가
            const res: InfiniteContiSearchDto = await apiRequestWithRefresh(
                `/conti/search?${buildQueryParams(fullParams)}`,
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

export const fetchContiDetail = async (contiId: string) => {
    const apiOptions: ApiOptions = {
        useCache: true,
    }
    const data: ContiWithSongDto = await apiRequestWithRefresh(
        `/conti/${contiId}`,
        apiOptions
    );
    return data;
}

export const useContiDetailQuery = (contiId: string) => {
    return useQuery<ContiWithSongDto>({
        queryKey: ["conti", contiId],
        queryFn: () => fetchContiDetail(contiId),
        staleTime: Infinity, // 무조건 fresh로 간주
        cacheTime: REVALIDATE_TIME_ONE_HOUR, // 1시간 동안 캐시 유지 (컴포넌트 언마운트 이후에도)
        refetchOnMount: false, // 마운트될 때 다시 요청 안 함
        refetchOnWindowFocus: false, // 창 포커스해도 재요청 안 함
    } as UseQueryOptions<ContiWithSongDto>);
}

export const fetchContiProperties = async () => {
    const apiOptions: ApiOptions = {
        useCache: true,
    }
    const data: SearchContiPropertiesDto = await apiRequestWithRefresh(
        "/conti/properties",
        apiOptions
    );
    return data;
};

export function useContiPropertiesQuery() {
    return useQuery<SearchContiPropertiesDto>({
        queryKey: ["searchProperties"],
        queryFn: fetchContiProperties,
        staleTime: Infinity, // 무조건 fresh로 간주
        cacheTime: REVALIDATE_TIME_ONE_HOUR, // 1시간 동안 캐시 유지 (컴포넌트 언마운트 이후에도)
        refetchOnMount: false, // 마운트될 때 다시 요청 안 함
        refetchOnWindowFocus: false, // 창 포커스해도 재요청 안 함
    } as UseQueryOptions<SearchContiPropertiesDto>);
}

export const fetchContiCopy = async (contiId: string) => {
    const apiOptions: ApiOptions = {
        method: "POST",
    }

    const res: CommonResponseDto<string> = await apiRequestWithRefresh(
        `/conti/copy/${contiId}`,
        apiOptions
    );
    return res;
};