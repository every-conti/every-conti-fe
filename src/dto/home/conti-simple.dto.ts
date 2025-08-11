import SongSimpleDto from "src/dto/home/song-simple.dto";

export default interface ContiSimpleDto {
  id: string;
  title: string;
  description: string;
  date: string;
  songs: SongSimpleDto[];
  creatorId: string;
  createdAt: Date;
}
