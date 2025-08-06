import {SongWithPraiseTeamSimpleDto} from "src/dto/song/SongWithPraiseTeamSimpleDto";

export type CoUsedSongDto = {
    song: SongWithPraiseTeamSimpleDto,
    usageCount: number
};