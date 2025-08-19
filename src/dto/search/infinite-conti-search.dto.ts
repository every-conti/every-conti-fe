import ContiWithSongDto from "src/dto/common/conti-with-song.dto";

export interface InfiniteContiSearchDto {
  items: ContiWithSongDto[];
  nextOffset: number | null;
}
