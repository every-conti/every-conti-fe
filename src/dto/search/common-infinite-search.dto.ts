export interface CommonInfiniteSearchDto<T> {
    items: T[];
    nextOffset: number | null;
}
