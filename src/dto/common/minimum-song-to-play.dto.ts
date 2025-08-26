import PraiseTeamDto from "./praise-team.dto";
import { SongKeyTypes } from "src/types/song/song-key.types";
import { SongTypeTypes } from "src/types/song/song-type.types";

export interface MinimumSongToPlayDto {
  id: string;
  songName: string;
  youtubeVId: string;
  songType: SongTypeTypes;
  praiseTeam: PraiseTeamDto;
  thumbnail: string;
  songKey: SongKeyTypes | null;
  duration: number;
  lyrics: string | null;
}
