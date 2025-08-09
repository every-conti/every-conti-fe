import { create } from "zustand";
import {MinimumSongToPlayDto} from "src/dto/common/minimum-song-to-play.dto";

interface PlayerStore {
  isPlaying: boolean;
  setIsPlaying: (isPlaying: boolean) => void;
  playlist: MinimumSongToPlayDto[]
  setPlayList: (playlist: MinimumSongToPlayDto[]) => void;
  currentSongIndex: number | null;
  setCurrentSongIndex: (currentSongIndex: number | null) => void;
  enqueueAndPlay: (songs: MinimumSongToPlayDto[]) => void;
  playOne: (song: MinimumSongToPlayDto) => void;
}

export const usePlayerStore = create<PlayerStore>((set) => ({
  isPlaying: false,
  setIsPlaying: (isPlaying) => set({ isPlaying }),
  playlist: [],
  setPlayList: (playlist) => set({ playlist }),
  currentSongIndex: null,
  setCurrentSongIndex: (currentSongIndex: number | null) => set({ currentSongIndex }),

  // enqueue 후 그 곡으로 바로 재생
  enqueueAndPlay: (songs: MinimumSongToPlayDto[]) => {
    set((s) => {
      const list = [...s.playlist, ...songs];
      return {
        playlist: list,
        currentSongIndex: list.length - 1,
        isPlaying: true,
      };
    });
  },

  // 하나만 재생(큐 교체)
  playOne: (song: MinimumSongToPlayDto) => {
    set({
      playlist: [song],
      currentSongIndex: 0,
      isPlaying: true,
    });
  },
}));