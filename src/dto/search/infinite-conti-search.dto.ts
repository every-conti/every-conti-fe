import FamousContiDto from "src/dto/home/famous-conti.dto";

export interface InfiniteContiSearchDto {
  items: FamousContiDto[];
  nextOffset: number | null;
}
