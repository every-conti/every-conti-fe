import { SongDetailDto } from "../common/song-detail.dto";

export interface InfiniteSongSearchDto {
  items: SongDetailDto[];
  nextOffset: number | null;
}
