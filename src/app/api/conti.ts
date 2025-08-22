import {
    useInfiniteQuery, useQuery, UseQueryOptions,
} from "@tanstack/react-query";
import buildQueryParams from "src/utils/buildQueryParams";
import {SearchContiQueriesDto} from "src/dto/search/request/search-conti-queries.dto";
import CommonResponseDto from "src/dto/common/common-response.dto";
import {apiRequestWithRefresh} from "src/app/api/apiRequestWithRefresh";
import ApiOptions from "src/app/api/ApiOptions";
import {REVALIDATE_TIME_ONE_HOUR} from "src/constant/numbers.constant";
import {SearchContiPropertiesDto} from "src/dto/conti/search-conti-properties.dto";
import ContiWithSongDto from "src/dto/common/conti-with-song.dto";
import {CommonInfiniteSearchDto} from "src/dto/search/common-infinite-search.dto";
import ContiSimpleDto from "src/dto/home/conti-simple.dto";
import {CreateContiDto} from "src/dto/conti/CreateContiDto";
import {CopyContiDto} from "src/dto/conti/CopyContiDto";
import {UpdateContiDto} from "src/dto/conti/UpdateContiDto";

export const useInfiniteSearchContiQuery = (
    params: SearchContiQueriesDto,
    options = {}
) => {
    const apiOptions: ApiOptions = {
        useCache: true,
    }

    const { data, isLoading, ...rest } = useInfiniteQuery<CommonInfiniteSearchDto<ContiWithSongDto>>({
        queryKey: ["searchContis", params],
        queryFn: async ({ pageParam = 0 }) => {
            const offset = pageParam as number;
            const fullParams: SearchContiQueriesDto = { ...params, offset }; // ✅ offset 추가
            const res: CommonInfiniteSearchDto<ContiWithSongDto> = await apiRequestWithRefresh(
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

export const fetchContiCreate = async (createContiDto :CreateContiDto) => {
    const apiOptions: ApiOptions = {
        method: "POST",
        data: createContiDto,
        requiresAuth: true,
    }
    const data: ContiSimpleDto = await apiRequestWithRefresh(
        "/conti",
        apiOptions
    );
    return data;
}

export const fetchContiUpdate = async (contiId: string, updateContiDto: UpdateContiDto) => {
    const apiOptions: ApiOptions = {
        method: "PUT",
        data: updateContiDto,
        requiresAuth: true,
    }
    const data: ContiSimpleDto = await apiRequestWithRefresh(
        `/conti/${contiId}`,
        apiOptions
    );
    return data;
}
// export const fetchContiDelete = async () => {
//
// }

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
        queryKey: ["searchContiProperties"],
        queryFn: fetchContiProperties,
        staleTime: Infinity, // 무조건 fresh로 간주
        cacheTime: REVALIDATE_TIME_ONE_HOUR, // 1시간 동안 캐시 유지 (컴포넌트 언마운트 이후에도)
        refetchOnMount: false, // 마운트될 때 다시 요청 안 함
        refetchOnWindowFocus: false, // 창 포커스해도 재요청 안 함
    } as UseQueryOptions<SearchContiPropertiesDto>);
}

export const useInfiniteContiQuery = (
    params: { memberId: string, enabled: boolean },
    options = {}
) => {
    const apiOptions: ApiOptions = {
        requiresAuth: true
    }
    const { data, isLoading, ...rest } = useInfiniteQuery<CommonInfiniteSearchDto<ContiWithSongDto>>({
        queryKey: ["myContis", params],
        queryFn: async ({ pageParam = 0 }) => {
            const offset = pageParam as number;
            const res: CommonInfiniteSearchDto<ContiWithSongDto> = await apiRequestWithRefresh(
                `/conti/${params.memberId}/mine?offset=${offset}`,
                apiOptions
            );
            return res;
        },
        initialPageParam: 0,
        enabled: params.enabled ?? true,
        getNextPageParam: (lastPage) => lastPage?.nextOffset ?? undefined,
        // staleTime: 5 * 60 * 1000,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    });
    return {
        data,
        isLoading,
        ...rest,
    };
};

export const fetchContiCopy = async (copyContiDto: CopyContiDto) => {
    const apiOptions: ApiOptions = {
        method: "POST",
        data: copyContiDto,
        requiresAuth: true
    }

    const res: CommonResponseDto<string> = await apiRequestWithRefresh(
        `/conti/copy`,
        apiOptions
    );
    return res;
};