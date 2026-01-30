// Friends store with real-time simulation
import { create } from 'zustand';

export interface Friend {
    id: string;
    name: string;
    avatar: string;
    universityId: string;
    university: string; // Display name
    coins: number;
    totalWins: number;
    winRate: number;
    streak: number;
    isAtStadium: boolean;
    isOnline: boolean;
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
        university: 'Ohio State',
        coins: 3420,
        totalWins: 89,
        winRate: 0.72,
        streak: 5,
        isAtStadium: true,
        isOnline: true,
        stadiumSection: 'Block O',
        stadiumPosition: { x: 45, y: 10 }, // North End
        lastActivity: '2 min ago',
        lastPrediction: { market: 'OSU vs Michigan - Spread', pick: 'OSU -7', time: '5 min ago' },
        status: 'at_stadium',
    },
    {
        id: 'friend-2',
        name: 'Sarah Chen',
        avatar: '🔥',
        universityId: 'osu',
        university: 'Ohio State',
        coins: 5890,
        totalWins: 142,
        winRate: 0.68,
        streak: 8,
        isAtStadium: true,
        isOnline: true,
        stadiumSection: 'Section 12A',
        stadiumPosition: { x: 92, y: 30 }, // East Side
        lastActivity: 'Just now',
        status: 'at_stadium',
    },
    {
        id: 'friend-3',
        name: 'Marcus Williams',
        avatar: '🏈',
        universityId: 'osu',
        university: 'Ohio State',
        coins: 2150,
        totalWins: 67,
        winRate: 0.61,
        streak: 2,
        isAtStadium: false,
        isOnline: true,
        lastActivity: '10 min ago',
        lastPrediction: { market: 'First TD Scorer', pick: 'Marvin Harrison Jr', time: '12 min ago' },
        status: 'watching',
    },
    {
        id: 'friend-4',
        name: 'Emma Rodriguez',
        avatar: '⭐',
        universityId: 'osu',
        university: 'Ohio State',
        coins: 8920,
        totalWins: 203,
        winRate: 0.74,
        streak: 12,
        isAtStadium: true,
        isOnline: true,
        stadiumSection: 'Block O',
        stadiumPosition: { x: 55, y: 8 }, // North End
        lastActivity: '1 min ago',
        status: 'at_stadium',
    },
    {
        id: 'friend-5',
        name: 'Tyler Jackson',
        avatar: '🎯',
        universityId: 'osu',
        university: 'Ohio State',
        coins: 1890,
        totalWins: 45,
        winRate: 0.58,
        streak: 1,
        isAtStadium: false,
        isOnline: true,
        lastActivity: '25 min ago',
        status: 'online',
    },
    {
        id: 'friend-6',
        name: 'Olivia Park',
        avatar: '💎',
        universityId: 'osu',
        university: 'Ohio State',
        coins: 6340,
        totalWins: 156,
        winRate: 0.71,
        streak: 6,
        isAtStadium: true,
        isOnline: true,
        stadiumSection: 'Section 8B',
        stadiumPosition: { x: 8, y: 60 }, // West Side
        lastActivity: '3 min ago',
        lastPrediction: { market: 'Total Points O/U', pick: 'Over 52.5', time: '8 min ago' },
        status: 'at_stadium',
    },
    {
        id: 'friend-7',
        name: 'Chris Davis',
        avatar: '🏆',
        universityId: 'osu',
        university: 'Ohio State',
        coins: 4560,
        totalWins: 98,
        winRate: 0.65,
        streak: 0,
        isAtStadium: false,
        isOnline: false,
        lastActivity: '45 min ago',
        status: 'offline',
    },
    {
        id: 'friend-8',
        name: 'Mia Thompson',
        avatar: '✨',
        universityId: 'osu',
        university: 'Ohio State',
        coins: 7210,
        totalWins: 178,
        winRate: 0.69,
        streak: 4,
        isAtStadium: true,
        isOnline: true,
        stadiumSection: 'Section 15C',
        stadiumPosition: { x: 50, y: 92 }, // South End
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
                // Random friend moves to a random section (Stands only)
                const movingFriend = atStadium[Math.floor(Math.random() * atStadium.length)];

                // Define stand definitions (simplified from StadiumView)
                const sections = [
                    { xMin: 25, xMax: 75, yMin: 2, yMax: 12 },   // North
                    { xMin: 25, xMax: 75, yMin: 88, yMax: 98 },  // South
                    { xMin: 2, xMax: 12, yMin: 15, yMax: 85 },   // West
                    { xMin: 88, xMax: 98, yMin: 15, yMax: 85 },  // East
                    { xMin: 2, xMax: 20, yMin: 2, yMax: 12 },    // NW Corner
                    { xMin: 80, xMax: 98, yMin: 2, yMax: 12 },   // NE Corner
                    { xMin: 2, xMax: 20, yMin: 88, yMax: 98 },   // SW Corner
                    { xMin: 80, xMax: 98, yMin: 88, yMax: 98 },  // SE Corner
                ];

                const randomSection = sections[Math.floor(Math.random() * sections.length)];
                const newPos = {
                    x: randomSection.xMin + Math.random() * (randomSection.xMax - randomSection.xMin),
                    y: randomSection.yMin + Math.random() * (randomSection.yMax - randomSection.yMin),
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
                    { type: 'arrived' as const, content: `found a seat in the stands! 🏟️` },
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
        }, 2000 + Math.random() * 3000); // Faster simulation (2-5s)
    },

    stopSimulation: () => {
        if (simulationInterval) {
            clearInterval(simulationInterval);
            simulationInterval = null;
        }
        set({ isSimulating: false });
    },
}));
