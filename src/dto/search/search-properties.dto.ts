import { SongTypeTypes } from "src/types/song/song-type.types";
import PraiseTeamDto from "../common/praise-team.dto";
import { SongTempoTypes } from "src/types/song/song-tempo.types";
import SongThemeDto from "../common/song-theme.dto";
import BibleDto from "../common/bible.dto";
import SongSeasonDto from "../common/song-season.dto";
import { SongKeyTypes } from "src/types/song/song-key.types";

export interface SearchPropertiesDto {
  praiseTeams: PraiseTeamDto[];
  seasons: SongSeasonDto[];
  songThemes: SongThemeDto[];
  songTypes: SongTypeTypes[];
  songTempos: SongTempoTypes[];
  songKeys: SongKeyTypes[];
  bibles: BibleDto[];
}
