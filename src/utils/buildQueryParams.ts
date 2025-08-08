export default function buildQueryParams(params: Object) {
    const searchParams = new URLSearchParams();

    for (const [key, value] of Object.entries(params)) {
        if (
            value !== undefined &&
            value !== null &&
            value !== "" &&
            value !== "전체"
        ) {
            searchParams.set(key, value.toString());
        }
    }

    return searchParams.toString();
};