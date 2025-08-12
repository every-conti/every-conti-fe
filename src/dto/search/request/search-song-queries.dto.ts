import { SongKeyTypes } from "src/types/song/song-key.types";
import { SongTempoTypes } from "src/types/song/song-tempo.types";
import { SongTypeTypes } from "src/types/song/song-type.types";

export interface SearchSongQueriesDto {
  text?: string;
  songType?: SongTypeTypes;
  praiseTeamId?: string;
  themeIds?: string[];
  tempo?: SongTempoTypes;
  seasonId?: string;
  songKey?: SongKeyTypes;
  minDuration?: number;
  maxDuration?: number;
  bibleId?: string;
  bibleChapterId?: string;
  bibleVerseId?: string;
  offset?: number | null;
  enabled?: boolean;
}
