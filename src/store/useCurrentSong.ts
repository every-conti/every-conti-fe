import { usePlayerStore } from "./usePlayerStore";
import { MinimumSongToPlayDto } from "src/dto/common/minimum-song-to-play.dto";

export const useCurrentSong = (): MinimumSongToPlayDto | null => {
  return usePlayerStore((state) => {
    if (state.currentSongIndex == null) return null;
    return state.playlist[state.currentSongIndex] ?? null;
  });
};
