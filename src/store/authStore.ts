// Authentication store using Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { User, University } from '../types';
import { universities } from '../data/mockData';

interface AuthState {
    user: User | null;
    selectedUniversity: University | null;
    isOnboarded: boolean;
    isLoading: boolean;
    simulatedWins: number;

    // Actions
    setUser: (user: User | null) => void;
    selectUniversity: (universityId: string) => void;
    completeOnboarding: () => void;
    login: (email: string) => Promise<void>;
    logout: () => void;
    updateCoins: (amount: number) => void;
    incrementWins: () => void;
    incrementPredictions: () => void;
    simulateWin: (coinAmount: number) => void;
    getWinRate: () => number;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,
            selectedUniversity: null,
            isOnboarded: false,
            isLoading: false,
            simulatedWins: 0,

            setUser: (user) => set({ user }),

            selectUniversity: (universityId) => {
                const university = universities.find(u => u.id === universityId);
                set({ selectedUniversity: university || null });
            },

            completeOnboarding: () => set({ isOnboarded: true }),

            login: async (email: string) => {
                set({ isLoading: true });

                // Simulate API call
                await new Promise(resolve => setTimeout(resolve, 1000));

                const { selectedUniversity } = get();

                const newUser: User = {
                    id: `user-${Date.now()}`,
                    email,
                    displayName: email.split('@')[0],
                    universityId: selectedUniversity?.id || '',
                    universityName: selectedUniversity?.name || '',
                    coins: 1000, // Starting coins
                    totalWins: 12, // Start with some wins for 78% rate
                    totalPredictions: 15, // ~78% win rate
                    streak: 5, // Start with 5 day streak
                    rank: 0,
                    createdAt: new Date().toISOString(),
                };

                set({ user: newUser, isLoading: false, simulatedWins: 0 });
            },

            logout: () => set({
                user: null,
                selectedUniversity: null,
                isOnboarded: false,
                simulatedWins: 0,
            }),

            updateCoins: (amount) => set(state => ({
                user: state.user
                    ? { ...state.user, coins: Math.max(0, state.user.coins + amount) }
                    : null
            })),

            incrementWins: () => set(state => ({
                user: state.user
                    ? {
                        ...state.user,
                        totalWins: state.user.totalWins + 1,
                        streak: state.user.streak + 1,
                    }
                    : null
            })),

            incrementPredictions: () => set(state => ({
                user: state.user
                    ? { ...state.user, totalPredictions: state.user.totalPredictions + 1 }
                    : null
            })),

            simulateWin: (coinAmount: number) => set(state => ({
                user: state.user
                    ? {
                        ...state.user,
                        coins: state.user.coins + coinAmount,
                        totalWins: state.user.totalWins + 1,
                        totalPredictions: state.user.totalPredictions + 1,
                        streak: state.user.streak + 1,
                    }
                    : null,
                simulatedWins: state.simulatedWins + 1,
            })),

            getWinRate: () => {
                const { user, simulatedWins } = get();
                if (!user || user.totalPredictions === 0) return 0.78;
                // Base 78% + 0.5% per simulated win, capped at 95%
                const baseRate = user.totalWins / user.totalPredictions;
                return Math.min(0.95, baseRate);
            },
        }),
        {
            name: 'varsity-auth-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
