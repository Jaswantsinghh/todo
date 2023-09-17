import { create } from "zustand";
import { devtools, persist } from "zustand/middleware"

type User = {
    userId: string,
    username: string,
    email: string,
    image: string,
    accessToken: string | "",
};

type UserStore = {
    user: User;
    createUser: (user: User) => void;
    updateUser: (user: Partial<User>) => void;
    logoutUser: () => void;
};

export const useUserStore = create<UserStore>()(
    devtools(
        persist(
            (set) => ({
                user: {
                    userId: '',
                    username: '',
                    email: '',
                    image: '',
                    accessToken: ''
                },
                createUser: (user) => set({ user }),
                updateUser: (user) => set((state) => ({ ...state, user: { ...state.user, ...user } })),
                logoutUser: () => set({ user: { userId: '', username: '', email: '', image: '', accessToken: '' } }),
            }),
            { name: 'userStore'}
        )
    )
);

