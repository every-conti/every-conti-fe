import { SongTempoTypes } from "src/types/song/song-tempo.types";
import PraiseTeamDto from "./praise-team.dto";
import SongThemeDto from "./song-theme.dto";
import BibleDto from "./bible.dto";
import { SongKeyTypes } from "src/types/song/song-key.types";
import SongSeasonDto from "src/dto/common/song-season.dto";
import {SongTypeTypes} from "src/types/song/song-type.types";

export interface SongDetailDto {
  id: string;
  songName: string;
  lyrics: string;
  youtubeVId: string;
  songType: SongTypeTypes;
  praiseTeam: PraiseTeamDto;
  thumbnail: string;
  creatorNickname: {
    nickname: string;
  };
  songThemes: SongThemeDto[];
  tempo: SongTempoTypes | null;
  season: SongSeasonDto | null;
  songKey: SongKeyTypes | null;
  duration: number;
  bible: BibleDto | null;
  bibleChapter: string | null;
  bibleVerse: string | null;
  createdAt: string;
}
