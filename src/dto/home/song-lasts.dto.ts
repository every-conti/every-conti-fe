import { SongTypeTypes } from "src/types/song/song-type.types";
import PraiseTeamDto from "./praise-team.dto";

export default interface SongLastsDto {
  id: string;
  songName: string;
  duration: number;
  songType: SongTypeTypes;
  praiseTeam: PraiseTeamDto;
}
