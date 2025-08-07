import { create } from "zustand";
import {MinimumSongToPlayDto} from "src/dto/common/minimum-song-to-play.dto";

interface PlayerStore {
  currentSong: MinimumSongToPlayDto | null;
  setCurrentSong : (currentSong: MinimumSongToPlayDto | null) => void;
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  currentSong: null,
  setCurrentSong: (currentSong) => set({ currentSong }),
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
}));