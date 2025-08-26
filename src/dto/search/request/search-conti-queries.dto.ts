import { SongTypeTypes } from "src/types/song/song-type.types";

export interface SearchContiQueriesDto {
  offset?: number | null;

  text?: string;
  songIds?: string[];
  praiseTeamId?: string;
  isFamous?: boolean;
  songType?: SongTypeTypes;
  minTotalDuration?: number;
  maxTotalDuration?: number;
  includePersonalConti: boolean;
}
