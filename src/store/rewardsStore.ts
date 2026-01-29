// Rewards store
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Reward, RewardRedemption } from '../types';
import { mockRewards } from '../data/mockData';

interface RewardsState {
    rewards: Reward[];
    redemptions: RewardRedemption[];

    // Actions
    loadRewards: () => void;
    redeemReward: (reward: Reward, userCoins: number, onCoinsUpdate: (amount: number) => void) => boolean;
}

export const useRewardsStore = create<RewardsState>()(
    persist(
        (set, get) => ({
            rewards: [],
            redemptions: [],

            loadRewards: () => {
                set({ rewards: mockRewards });
            },

            redeemReward: (reward, userCoins, onCoinsUpdate) => {
                if (reward.coinCost > userCoins) {
                    return false;
                }

                if (!reward.available) {
                    return false;
                }

                const redemption: RewardRedemption = {
                    id: `redemption-${Date.now()}`,
                    rewardId: reward.id,
                    userId: 'current-user',
                    status: 'fulfilled',
                    redeemedAt: new Date().toISOString(),
                    code: `VARSITY-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
                };

                set(state => ({
                    redemptions: [redemption, ...state.redemptions],
                    rewards: state.rewards.map(r =>
                        r.id === reward.id && r.stock
                            ? { ...r, stock: r.stock - 1, available: r.stock > 1 }
                            : r
                    ),
                }));

                onCoinsUpdate(-reward.coinCost);
                return true;
            },
        }),
        {
            name: 'varsity-rewards-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
