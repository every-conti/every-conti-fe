import SongSimpleDto from "src/dto/home/song-simple.dto";
import UserSimpleDto from "src/dto/user/user-simple.dto";

export default interface ContiWithSongDto {
    id: string;
    title: string;
    description: string;
    date: string;
    songs: SongSimpleDto[];
    creator: UserSimpleDto;
    createdAt: Date;
}
