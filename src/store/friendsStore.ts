// Friends store with real-time simulation
import { create } from 'zustand';

export interface Friend {
    id: string;
    name: string;
    avatar: string;
    universityId: string;
    coins: number;
    totalWins: number;
    winRate: number;
    isAtStadium: boolean;
    stadiumSection?: string;
    stadiumPosition?: { x: number; y: number }; // 0-100 normalized
    lastActivity: string;
    lastPrediction?: {
        market: string;
        pick: string;
        time: string;
    };
    status: 'online' | 'at_stadium' | 'watching' | 'offline';
}

export interface FriendMessage {
    id: string;
    friendId: string;
    friendName: string;
    friendAvatar: string;
    type: 'prediction' | 'arrived' | 'won' | 'message';
    content: string;
    timestamp: Date;
}

interface FriendsState {
    friends: Friend[];
    messages: FriendMessage[];
    isSimulating: boolean;

    loadFriends: () => void;
    updateFriendPosition: (friendId: string, position: { x: number; y: number }) => void;
    updateFriendStatus: (friendId: string, status: Friend['status']) => void;
    addMessage: (message: Omit<FriendMessage, 'id' | 'timestamp'>) => void;
    startSimulation: () => void;
    stopSimulation: () => void;
}

// Mock friends data - diverse and realistic
const mockFriends: Friend[] = [
    {
        id: 'friend-1',
        name: 'Jake Morrison',
        avatar: '😎',
        universityId: 'osu',
        coins: 3420,
        totalWins: 89,
        winRate: 0.72,
        isAtStadium: true,
        stadiumSection: 'Block O',
        stadiumPosition: { x: 35, y: 45 },
        lastActivity: '2 min ago',
        lastPrediction: { market: 'OSU vs Michigan - Spread', pick: 'OSU -7', time: '5 min ago' },
        status: 'at_stadium',
    },
    {
        id: 'friend-2',
        name: 'Sarah Chen',
        avatar: '🔥',
        universityId: 'osu',
        coins: 5890,
        totalWins: 142,
        winRate: 0.68,
        isAtStadium: true,
        stadiumSection: 'Section 12A',
        stadiumPosition: { x: 62, y: 38 },
        lastActivity: 'Just now',
        status: 'at_stadium',
    },
    {
        id: 'friend-3',
        name: 'Marcus Williams',
        avatar: '🏈',
        universityId: 'osu',
        coins: 2150,
        totalWins: 67,
        winRate: 0.61,
        isAtStadium: false,
        lastActivity: '10 min ago',
        lastPrediction: { market: 'First TD Scorer', pick: 'Marvin Harrison Jr', time: '12 min ago' },
        status: 'watching',
    },
    {
        id: 'friend-4',
        name: 'Emma Rodriguez',
        avatar: '⭐',
        universityId: 'osu',
        coins: 8920,
        totalWins: 203,
        winRate: 0.74,
        isAtStadium: true,
        stadiumSection: 'Block O',
        stadiumPosition: { x: 42, y: 52 },
        lastActivity: '1 min ago',
        status: 'at_stadium',
    },
    {
        id: 'friend-5',
        name: 'Tyler Jackson',
        avatar: '🎯',
        universityId: 'osu',
        coins: 1890,
        totalWins: 45,
        winRate: 0.58,
        isAtStadium: false,
        lastActivity: '25 min ago',
        status: 'online',
    },
    {
        id: 'friend-6',
        name: 'Olivia Park',
        avatar: '💎',
        universityId: 'osu',
        coins: 6340,
        totalWins: 156,
        winRate: 0.71,
        isAtStadium: true,
        stadiumSection: 'Section 8B',
        stadiumPosition: { x: 78, y: 42 },
        lastActivity: '3 min ago',
        lastPrediction: { market: 'Total Points O/U', pick: 'Over 52.5', time: '8 min ago' },
        status: 'at_stadium',
    },
    {
        id: 'friend-7',
        name: 'Chris Davis',
        avatar: '🏆',
        universityId: 'osu',
        coins: 4560,
        totalWins: 98,
        winRate: 0.65,
        isAtStadium: false,
        lastActivity: '45 min ago',
        status: 'offline',
    },
    {
        id: 'friend-8',
        name: 'Mia Thompson',
        avatar: '✨',
        universityId: 'osu',
        coins: 7210,
        totalWins: 178,
        winRate: 0.69,
        isAtStadium: true,
        stadiumSection: 'Section 15C',
        stadiumPosition: { x: 25, y: 65 },
        lastActivity: 'Just now',
        status: 'at_stadium',
    },
];

let simulationInterval: ReturnType<typeof setInterval> | null = null;

export const useFriendsStore = create<FriendsState>()((set, get) => ({
    friends: [],
    messages: [],
    isSimulating: false,

    loadFriends: () => {
        set({ friends: mockFriends });
    },

    updateFriendPosition: (friendId, position) => {
        set(state => ({
            friends: state.friends.map(f =>
                f.id === friendId ? { ...f, stadiumPosition: position } : f
            ),
        }));
    },

    updateFriendStatus: (friendId, status) => {
        set(state => ({
            friends: state.friends.map(f =>
                f.id === friendId ? { ...f, status, isAtStadium: status === 'at_stadium' } : f
            ),
        }));
    },

    addMessage: (message) => {
        const newMessage: FriendMessage = {
            ...message,
            id: `msg-${Date.now()}`,
            timestamp: new Date(),
        };
        set(state => ({
            messages: [newMessage, ...state.messages].slice(0, 50), // Keep last 50
        }));
    },

    startSimulation: () => {
        if (get().isSimulating) return;
        set({ isSimulating: true });

        // Simulate friend activity every 8-15 seconds
        simulationInterval = setInterval(() => {
            const { friends, addMessage } = get();
            const atStadium = friends.filter(f => f.isAtStadium);

            if (atStadium.length > 0) {
                // Random friend moves
                const movingFriend = atStadium[Math.floor(Math.random() * atStadium.length)];
                const currentPos = movingFriend.stadiumPosition || { x: 50, y: 50 };
                const newPos = {
                    x: Math.max(10, Math.min(90, currentPos.x + (Math.random() - 0.5) * 15)),
                    y: Math.max(10, Math.min(90, currentPos.y + (Math.random() - 0.5) * 15)),
                };
                get().updateFriendPosition(movingFriend.id, newPos);
            }

            // Random activity messages
            if (Math.random() > 0.6) {
                const randomFriend = friends[Math.floor(Math.random() * friends.length)];
                const activities = [
                    { type: 'prediction' as const, content: `just predicted OSU -7! 🎯` },
                    { type: 'prediction' as const, content: `wagered 250 coins on Over 52.5 💰` },
                    { type: 'won' as const, content: `won their last prediction! +380 coins 🔥` },
                    { type: 'arrived' as const, content: `just checked in at the stadium! 🏟️` },
                ];
                const activity = activities[Math.floor(Math.random() * activities.length)];
                addMessage({
                    friendId: randomFriend.id,
                    friendName: randomFriend.name,
                    friendAvatar: randomFriend.avatar,
                    type: activity.type,
                    content: activity.content,
                });
            }
        }, 8000 + Math.random() * 7000);
    },

    stopSimulation: () => {
        if (simulationInterval) {
            clearInterval(simulationInterval);
            simulationInterval = null;
        }
        set({ isSimulating: false });
    },
}));
