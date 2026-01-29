// Core types for the Varsity app

export interface User {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
    universityId: string;
    universityName: string;
    coins: number;
    totalWins: number;
    totalPredictions: number;
    streak: number;
    rank: number;
    createdAt: string;
}

export interface University {
    id: string;
    name: string;
    shortName: string;
    mascot: string;
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    stadiumCoords: {
        latitude: number;
        longitude: number;
        radius: number; // in meters
    };
}

export interface Game {
    id: string;
    homeTeam: Team;
    awayTeam: Team;
    sport: Sport;
    startTime: string;
    status: 'upcoming' | 'live' | 'final';
    venue: string;
    homeScore?: number;
    awayScore?: number;
    quarter?: string;
    timeRemaining?: string;
}

export interface Team {
    id: string;
    name: string;
    shortName: string;
    logo: string;       // Emoji for display
    logoUrl: string;    // URL for actual logo image
    record: string;
}

export type Sport = 'football' | 'basketball' | 'baseball' | 'soccer' | 'hockey';

export interface PredictionMarket {
    id: string;
    gameId: string;
    type: MarketType;
    title: string;
    description?: string;
    options: PredictionOption[];
    status: 'open' | 'locked' | 'settled';
    closesAt: string;
    isStadiumExclusive: boolean;
    boostMultiplier: number; // 1.0 for normal, 2.0-5.0 for stadium
}

export type MarketType =
    | 'moneyline'
    | 'spread'
    | 'total'
    | 'prop'
    | 'first_scorer'
    | 'halftime_leader'
    | 'flash_prop'; // Stadium-only live props

export interface PredictionOption {
    id: string;
    label: string;
    odds: number; // American odds format
    isWinner?: boolean;
}

export interface Prediction {
    id: string;
    marketId: string;
    optionId: string;
    userId: string;
    coinsWagered: number;
    potentialWin: number;
    boosted: boolean;
    boostMultiplier: number;
    status: 'pending' | 'won' | 'lost' | 'push';
    createdAt: string;
    settledAt?: string;
    game: Game;
    market: PredictionMarket;
    selectedOption: PredictionOption;
}

export interface Reward {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    coinCost: number;
    category: RewardCategory;
    tier: 1 | 2 | 3;
    available: boolean;
    stock?: number;
    expiresAt?: string;
}

export type RewardCategory = 'digital' | 'university' | 'sponsor';

export interface RewardRedemption {
    id: string;
    rewardId: string;
    userId: string;
    status: 'pending' | 'fulfilled' | 'expired';
    redeemedAt: string;
    code?: string;
}

export interface Ticket {
    id: string;
    gameId: string;
    sellerId: string;
    sellerName: string;
    section: string;
    row: string;
    seat: string;
    price: number; // in coins or USD (TBD)
    status: 'available' | 'pending' | 'sold';
    createdAt: string;
    game: Game;
}

export interface LeaderboardEntry {
    rank: number;
    userId: string;
    displayName: string;
    avatarUrl?: string;
    coins: number;
    winRate: number;
    streak: number;
    isCurrentUser?: boolean;
}

export interface LocationState {
    isAtStadium: boolean;
    stadiumName?: string;
    boostMultiplier: number;
    lastChecked?: string;
}
