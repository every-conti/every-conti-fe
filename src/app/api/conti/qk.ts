export const qk = {
  conti: (id: string | number) => ["conti", id] as const,
  searchContis: (paramsStr: string) => ["searchContis", paramsStr] as const,
  myContis: (memberId?: string) => ["myContis", memberId ?? ""] as const,
};
