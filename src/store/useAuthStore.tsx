import AccessTokenDto from "src/dto/auth/access-token.dto";
import UserDto from "src/dto/user/user.dto";
import { create } from "zustand";
import {fetchLogout, fetchNewAccessToken} from "src/app/api/auth";
import {fetchMyUserInfo} from "src/app/api/user";

interface AuthStore {
  user: UserDto | null;
  loading: boolean;
  accessToken: string | null;

  setUser: (user: UserDto) => void;
  logout: () => void;
  fetchUser: () => Promise<void>;

  setAccessToken: (token: string) => void;
  getAccessToken: () => string | null;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  loading: true,
  accessToken: null,

  setUser: (user) => set({ user }),
  logout: async () => {
    set({ loading: true });

    const accessToken = useAuthStore.getState().accessToken;
    if (!accessToken) {
      set({ user: null, accessToken: null });
      return;
    }
    await fetchLogout();
    set({ user: null, accessToken: null });

    set({ loading: false });
  },

  fetchUser: async () => {
    set({ loading: true });

    let accessToken = useAuthStore.getState().accessToken;

    if (!accessToken) {
      try {
        const data: AccessTokenDto = await fetchNewAccessToken();
        if (!data?.accessToken) {
          set({ user: null, accessToken: null, loading: false });
          return;
        }
        accessToken = data.accessToken;
        set({ accessToken });
      } catch (err) {
        set({ user: null, accessToken: null, loading: false });
        return;
      }
    }

    try {
      const data: UserDto = await fetchMyUserInfo();
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
