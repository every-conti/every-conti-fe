import { SongTypeTypes } from "src/types/song/song-type.types";
import PraiseTeamDto from "../common/praise-team.dto";

export default interface SongLastsDto {
  id: string;
  songName: string;
  duration: string;
  songType: SongTypeTypes;
  praiseTeam: PraiseTeamDto;
  thumbnail: string;
}
