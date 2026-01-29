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
    resolvePredictionAsWin: (predictionId: string) => number;
    checkDailyReset: () => void;
}

const DAILY_COIN_ALLOWANCE = 500;

// Create dummy past predictions (~78% win rate: 12 wins, 3 losses)
const createDummyPredictions = (): Prediction[] => {
    const dummyGames = mockGames;
    const basePredictions: Omit<Prediction, 'id' | 'createdAt' | 'settledAt'>[] = [
        { marketId: 'm1', optionId: 'o1', userId: 'current-user', coinsWagered: 150, potentialWin: 135, boosted: true, boostMultiplier: 1.5, status: 'won', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o1', label: 'OSU -7.5', odds: -110 } },
        { marketId: 'm2', optionId: 'o2', userId: 'current-user', coinsWagered: 100, potentialWin: 190, boosted: false, boostMultiplier: 1, status: 'won', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o2', label: 'Over 52.5', odds: +105 } },
        { marketId: 'm3', optionId: 'o3', userId: 'current-user', coinsWagered: 200, potentialWin: 360, boosted: true, boostMultiplier: 1.5, status: 'won', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o3', label: 'OSU Moneyline', odds: -150 } },
        { marketId: 'm4', optionId: 'o4', userId: 'current-user', coinsWagered: 75, potentialWin: 150, boosted: false, boostMultiplier: 1, status: 'lost', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o4', label: 'Michigan +7.5', odds: -110 } },
        { marketId: 'm5', optionId: 'o5', userId: 'current-user', coinsWagered: 120, potentialWin: 216, boosted: true, boostMultiplier: 1.5, status: 'won', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o5', label: 'First TD OSU', odds: +140 } },
        { marketId: 'm6', optionId: 'o6', userId: 'current-user', coinsWagered: 100, potentialWin: 90, boosted: false, boostMultiplier: 1, status: 'won', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o6', label: 'Under 48.5', odds: -110 } },
        { marketId: 'm7', optionId: 'o7', userId: 'current-user', coinsWagered: 80, potentialWin: 200, boosted: false, boostMultiplier: 1, status: 'won', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o7', label: 'Henderson 80+ yds', odds: +150 } },
        { marketId: 'm8', optionId: 'o8', userId: 'current-user', coinsWagered: 150, potentialWin: 135, boosted: false, boostMultiplier: 1, status: 'lost', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o8', label: 'Michigan ML', odds: +220 } },
        { marketId: 'm9', optionId: 'o9', userId: 'current-user', coinsWagered: 90, potentialWin: 162, boosted: true, boostMultiplier: 1.5, status: 'won', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o9', label: 'Harrison Jr TD', odds: +125 } },
        { marketId: 'm10', optionId: 'o10', userId: 'current-user', coinsWagered: 100, potentialWin: 90, boosted: false, boostMultiplier: 1, status: 'won', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o10', label: 'OSU 1H -3.5', odds: -110 } },
        { marketId: 'm11', optionId: 'o11', userId: 'current-user', coinsWagered: 125, potentialWin: 250, boosted: true, boostMultiplier: 1.5, status: 'won', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o11', label: 'OSU 28+ pts', odds: +120 } },
        { marketId: 'm12', optionId: 'o12', userId: 'current-user', coinsWagered: 75, potentialWin: 67, boosted: false, boostMultiplier: 1, status: 'lost', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o12', label: 'Mich 1H +4', odds: -110 } },
        { marketId: 'm13', optionId: 'o13', userId: 'current-user', coinsWagered: 100, potentialWin: 180, boosted: true, boostMultiplier: 1.5, status: 'won', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o13', label: 'Total TDs O 6.5', odds: +110 } },
        { marketId: 'm14', optionId: 'o14', userId: 'current-user', coinsWagered: 80, potentialWin: 72, boosted: false, boostMultiplier: 1, status: 'won', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o14', label: 'OSU -3.5 2H', odds: -110 } },
        { marketId: 'm15', optionId: 'o15', userId: 'current-user', coinsWagered: 50, potentialWin: 100, boosted: false, boostMultiplier: 1, status: 'won', game: dummyGames[0], market: mockMarkets[0], selectedOption: { id: 'o15', label: 'Stroud 250+ yds', odds: +150 } },
    ];

    return basePredictions.map((p, i) => ({
        ...p,
        id: `dummy-pred-${i}`,
        createdAt: new Date(Date.now() - (i + 1) * 3600000 * 2).toISOString(), // 2 hours apart
        settledAt: new Date(Date.now() - (i + 1) * 3600000).toISOString(), // 1 hour after placed
    })) as Prediction[];
};

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
                const { userPredictions } = get();
                // Only add dummy predictions if no predictions exist
                const predictions = userPredictions.length === 0 ? createDummyPredictions() : userPredictions;
                set({
                    markets: mockMarkets,
                    games: mockGames,
                    userPredictions: predictions,
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

            resolvePredictionAsWin: (predictionId) => {
                const { userPredictions } = get();
                const prediction = userPredictions.find(p => p.id === predictionId);
                if (!prediction || prediction.status !== 'pending') return 0;

                const winAmount = prediction.coinsWagered + prediction.potentialWin;

                set(state => ({
                    userPredictions: state.userPredictions.map(p =>
                        p.id === predictionId
                            ? { ...p, status: 'won', settledAt: new Date().toISOString() }
                            : p
                    ),
                }));

                return winAmount;
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
