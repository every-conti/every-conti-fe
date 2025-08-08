import { SongKeyTypes } from "src/types/song/song-key.types";

export default interface SongSimpleDto {
  id: string;
  songName: string;
  songKey: SongKeyTypes;
  duration: number;
  thumbnail: string;
  idx: number;
}
