import { SongTempoTypes } from "src/types/song/song-tempo.types";
import PraiseTeamDto from "../common/praise-team.dto";
import SongThemeDto from "../common/song-theme.dto";
import BibleDto from "../common/bible.dto";
import { SongKeyTypes } from "src/types/song/song-key.types";

export interface SongDetailDto {
  id: string;
  songName: string;
  lyrics: string;
  reference: string;
  songType: string;
  praiseTeam: PraiseTeamDto;
  thumbnail: string;
  creatorNickname: {
    nickname: string;
  };
  songThemes: SongThemeDto[];
  tempo: SongTempoTypes;
  season: string | null;
  songKey: SongKeyTypes;
  duration: number;
  bible: BibleDto | null;
  bibleChapter: string | null;
  bibleVerse: string | null;
}
