import {
    useInfiniteQuery,
} from "@tanstack/react-query";
import { apiRequestGet } from "./apiRequestGet";
import {InfiniteSongSearchDto} from "src/dto/search/infinite-song-search.dto";
import buildQueryParams from "src/utils/buildQueryParams";
import {InfiniteContiSearchDto} from "src/dto/search/infinite-conti-search.dto";
import {SearchContiQueriesDto} from "src/dto/search/request/search-conti-queries.dto";

export const useInfiniteSearchContiQuery = (
    params: SearchContiQueriesDto,
    options = {}
) => {
    const { data, isLoading, ...rest } = useInfiniteQuery<InfiniteContiSearchDto>({
        queryKey: ["searchContis", params],
        queryFn: async ({ pageParam = 0 }) => {
            const offset = pageParam as number;
            const fullParams: SearchContiQueriesDto = { ...params, offset }; // ✅ offset 추가
            const res: InfiniteContiSearchDto = await apiRequestGet(
                `/conti/search/famous?${buildQueryParams(fullParams)}`,
                true
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