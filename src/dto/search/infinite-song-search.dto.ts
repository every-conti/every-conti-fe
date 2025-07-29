import { SongDetailDto } from "./song-detail.dto";

export interface InfiniteSongSearchDto {
  items: SongDetailDto[];
  nextOffset: number | null;
}
