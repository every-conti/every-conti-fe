import {MinimumSongToPlayDto} from "src/dto/common/minimum-song-to-play.dto";

export type CoUsedSongDto = {
    song: MinimumSongToPlayDto,
    usageCount: number
};