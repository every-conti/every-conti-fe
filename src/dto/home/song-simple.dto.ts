import { MinimumSongToPlayDto } from "src/dto/common/minimum-song-to-play.dto";

export default interface SongSimpleDto {
  song: MinimumSongToPlayDto;
  idx: number;
}
