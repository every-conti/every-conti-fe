type HttpMethod = "GET" | "POST" | "DELETE" | "PATCH" | "PUT";

export default interface ApiOptions {
    method?: HttpMethod;
    data?: any;
    useCache?: boolean;
    isSSG?: boolean;
    requiresAuth?: boolean;
}