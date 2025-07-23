import { apiRequestGet } from "src/api/apiRequestGet";
import UserDto from "src/dto/user/user.dto";
import { create } from "zustand";

interface AuthStore {
  user: UserDto | null;
  loading: boolean;
  accessToken: string | null;

  setUser: (user: UserDto) => void;
  clearUser: () => void;
  fetchUser: () => Promise<void>;

  setAccessToken: (token: string) => void;
  getAccessToken: () => string | null;
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  accessToken: null,

  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null, accessToken: null }),

  fetchUser: async () => {
    set({ loading: true });
    if (!useAuthStore.getState().accessToken) return;

    try {
      const data: UserDto = await apiRequestGet(
        "/member/me",
        useAuthStore.getState().accessToken,
        false
      );
      console.log(data);
      set({ user: data });
    } catch (err) {
      set({ user: null });
    } finally {
      set({ loading: false });
    }
  },

  setAccessToken: (token) => set({ accessToken: token }),
  getAccessToken: (): string | null => useAuthStore.getState().accessToken,
}));
