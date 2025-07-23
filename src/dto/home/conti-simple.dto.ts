import SongSimpleDto from "./song-simple.dto";

export default interface ContiSimpleDto {
  id: string;
  title: string;
  date: string;
  songs: SongSimpleDto[];
  creatorId: string;
  createdAt: Date;
}
