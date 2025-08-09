import {
    useInfiniteQuery,
} from "@tanstack/react-query";
import buildQueryParams from "src/utils/buildQueryParams";
import {InfiniteContiSearchDto} from "src/dto/search/infinite-conti-search.dto";
import {SearchContiQueriesDto} from "src/dto/search/request/search-conti-queries.dto";
import CommonResponseDto from "src/dto/common/common-response.dto";
import {apiRequestWithRefresh} from "src/app/api/apiRequestWithRefresh";
import ApiOptions from "src/app/api/ApiOptions";

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
                `/conti/search/famous?${buildQueryParams(fullParams)}`,
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

export const fetchContiCopyProperties = async (contiId: string) => {
    const apiOptions: ApiOptions = {
        method: "POST",
    }

    const res: CommonResponseDto<string> = await apiRequestWithRefresh(
        `/conti/copy/${contiId}`,
        apiOptions
    );
    return res;
};