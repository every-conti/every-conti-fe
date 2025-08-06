import PraiseTeamDto from "src/dto/common/praise-team.dto";

export type SongWithPraiseTeamSimpleDto = {
    id: string,
    songName: string,
    songType: string,
    praiseTeam: PraiseTeamDto,
    thumbnail: string,
    duration: number
};