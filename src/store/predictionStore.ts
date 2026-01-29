// Predictions store using Zustand
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Prediction, PredictionMarket, PredictionOption, Game } from '../types';
import { mockMarkets, mockGames } from '../data/mockData';

interface PredictionState {
    markets: PredictionMarket[];
    games: Game[];
    userPredictions: Prediction[];
    activeBetSlip: {
        marketId: string;
        optionId: string;
        amount: number;
    } | null;
    dailyCoinsRemaining: number;
    lastCoinReset: string;

    // Actions
    loadMarkets: () => void;
    placePrediction: (
        market: PredictionMarket,
        option: PredictionOption,
        amount: number,
        isBosted: boolean,
        boostMultiplier: number,
        userCoins: number,
        onCoinsUpdate: (amount: number) => void
    ) => boolean;
    setBetSlip: (marketId: string, optionId: string, amount: number) => void;
    clearBetSlip: () => void;
    settlePrediction: (predictionId: string, won: boolean) => void;
    checkDailyReset: () => void;
}

const DAILY_COIN_ALLOWANCE = 500;

export const usePredictionStore = create<PredictionState>()(
    persist(
        (set, get) => ({
            markets: [],
            games: [],
            userPredictions: [],
            activeBetSlip: null,
            dailyCoinsRemaining: DAILY_COIN_ALLOWANCE,
            lastCoinReset: new Date().toDateString(),

            loadMarkets: () => {
                set({
                    markets: mockMarkets,
                    games: mockGames,
                });
            },

            placePrediction: (market, option, amount, isBoosted, boostMultiplier, userCoins, onCoinsUpdate) => {
                if (amount > userCoins) {
                    return false;
                }

                const game = mockGames.find(g => g.id === market.gameId);
                if (!game) return false;

                // Calculate potential win based on American odds
                const odds = option.odds;
                let potentialWin: number;
                if (odds > 0) {
                    potentialWin = (amount * odds) / 100;
                } else {
                    potentialWin = (amount * 100) / Math.abs(odds);
                }

                // Apply boost multiplier
                potentialWin = Math.round(potentialWin * boostMultiplier);

                const prediction: Prediction = {
                    id: `pred-${Date.now()}`,
                    marketId: market.id,
                    optionId: option.id,
                    userId: 'current-user',
                    coinsWagered: amount,
                    potentialWin,
                    boosted: isBoosted,
                    boostMultiplier,
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    game,
                    market,
                    selectedOption: option,
                };

                set(state => ({
                    userPredictions: [prediction, ...state.userPredictions],
                    activeBetSlip: null,
                }));

                onCoinsUpdate(-amount);
                return true;
            },

            setBetSlip: (marketId, optionId, amount) => {
                set({ activeBetSlip: { marketId, optionId, amount } });
            },

            clearBetSlip: () => set({ activeBetSlip: null }),

            settlePrediction: (predictionId, won) => {
                set(state => ({
                    userPredictions: state.userPredictions.map(p =>
                        p.id === predictionId
                            ? { ...p, status: won ? 'won' : 'lost', settledAt: new Date().toISOString() }
                            : p
                    ),
                }));
            },

            checkDailyReset: () => {
                const today = new Date().toDateString();
                const { lastCoinReset } = get();

                if (lastCoinReset !== today) {
                    set({
                        dailyCoinsRemaining: DAILY_COIN_ALLOWANCE,
                        lastCoinReset: today,
                    });
                }
            },
        }),
        {
            name: 'varsity-predictions-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
