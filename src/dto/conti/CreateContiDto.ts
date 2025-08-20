export type CreateContiDto = {
    title: string;
    description?: string;
    date: Date
    songIds?: string[];
    memberId: string;
};