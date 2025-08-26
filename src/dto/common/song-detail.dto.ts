import { SongTempoTypes } from "src/types/song/song-tempo.types";
import PraiseTeamDto from "./praise-team.dto";
import SongThemeDto from "./song-theme.dto";
import BibleDto from "./bible.dto";
import { SongKeyTypes } from "src/types/song/song-key.types";
import SongSeasonDto from "src/dto/common/song-season.dto";
import { SongTypeTypes } from "src/types/song/song-type.types";
import { MinimumSongToPlayDto } from "src/dto/common/minimum-song-to-play.dto";

export interface SongDetailDto extends MinimumSongToPlayDto {
  creatorNickname: {
    nickname: string;
  };
  songThemes: SongThemeDto[];
  tempo: SongTempoTypes | null;
  season: SongSeasonDto | null;
  bible: BibleDto | null;
  bibleChapter: string | null;
  bibleVerse: string | null;
  createdAt: string;
}
