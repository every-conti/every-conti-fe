export type CreateSongDto = {
    songName: string;
    lyrics?: string;
    youtubeVId: string;
    songType: string;
    creatorId: string;
    praiseTeamId: string;
    thumbnail: string;
    themeIds?: string[];
    tempo?: string;
    seasonId?: string;
    key?: string;
    duration?: number;
    bibleId?: string;
    bibleChapterId?: string;
    bibleVerseId?: string;
};