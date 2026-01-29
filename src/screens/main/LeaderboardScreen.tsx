// Leaderboard Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, gradients } from '../../theme';
import { Card, Avatar, CoinBalance } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { mockLeaderboard } from '../../data/mockData';
import { LeaderboardEntry } from '../../types';

interface Props {
    navigation: any;
}

export const LeaderboardScreen: React.FC<Props> = ({ navigation }) => {
    const { user } = useAuthStore();
    const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'alltime'>('weekly');

    // Weekly leaderboard - current mock data
    const weeklyLeaderboard: LeaderboardEntry[] = mockLeaderboard;

    // All-time leaderboard - shuffled order with higher values
    const allTimeLeaderboard: LeaderboardEntry[] = [
        { rank: 1, userId: 'user-12', displayName: 'StadiumWarrior', coins: 156800, winRate: 0.71, streak: 12 },
        { rank: 2, userId: 'user-10', displayName: 'BuckeyeKing', coins: 142500, winRate: 0.69, streak: 6 },
        { rank: 3, userId: 'user-14', displayName: 'GameDayGuru', coins: 127100, winRate: 0.67, streak: 9 },
        { rank: 4, userId: 'user-11', displayName: 'SportsProphet', coins: 118200, winRate: 0.65, streak: 4 },
        { rank: 5, userId: 'user-17', displayName: 'WagerWiz', coins: 103200, winRate: 0.63, streak: 7 },
        { rank: 6, userId: 'user-13', displayName: 'LuckyLisa', coins: 98400, winRate: 0.62, streak: 3 },
        { rank: 7, userId: 'user-19', displayName: 'ScoreSniper', coins: 87500, winRate: 0.60, streak: 5 },
        { rank: 8, userId: 'user-15', displayName: 'PredictorPete', coins: 75900, winRate: 0.58, streak: 2 },
        { rank: 9, userId: 'user-16', displayName: 'CampusChamp', coins: 64500, winRate: 0.56, streak: 1 },
        { rank: 10, userId: 'user-18', displayName: 'VarsityVet', coins: 52800, winRate: 0.54, streak: 0 },
    ];

    // Get base data based on selected period
    const baseLeaderboard = selectedPeriod === 'weekly' ? weeklyLeaderboard : allTimeLeaderboard;

    // Insert current user into leaderboard
    const leaderboardWithUser: LeaderboardEntry[] = [
        ...baseLeaderboard,
        {
            rank: 42,
            userId: user?.id || 'current-user',
            displayName: user?.displayName || 'You',
            coins: selectedPeriod === 'weekly' ? (user?.coins || 0) : (user?.coins || 0) * 5,
            winRate: user?.totalPredictions ? user.totalWins / user.totalPredictions : 0,
            streak: user?.streak || 0,
            isCurrentUser: true,
        },
    ].sort((a, b) => b.coins - a.coins).map((entry, index) => ({
        ...entry,
        rank: index + 1,
    }));

    const currentUserEntry = leaderboardWithUser.find(e => e.isCurrentUser);

    const getRankColor = (rank: number) => {
        if (rank === 1) return colors.rankGold;
        if (rank === 2) return colors.rankSilver;
        if (rank === 3) return colors.rankBronze;
        return colors.textSecondary;
    };

    const getRankEmoji = (rank: number) => {
        if (rank === 1) return '👑';
        if (rank === 2) return '🥈';
        if (rank === 3) return '🥉';
        return null;
    };

    const renderLeaderboardEntry = (entry: LeaderboardEntry) => (
        <View
            key={entry.userId}
            style={[
                styles.entryRow,
                entry.isCurrentUser && styles.currentUserRow,
            ]}
        >
            <View style={styles.rankContainer}>
                {getRankEmoji(entry.rank) ? (
                    <Text style={styles.rankEmoji}>{getRankEmoji(entry.rank)}</Text>
                ) : (
                    <Text style={[styles.rankNumber, { color: getRankColor(entry.rank) }]}>
                        #{entry.rank}
                    </Text>
                )}
            </View>

            <Avatar name={entry.displayName} size={44} rank={entry.rank <= 3 ? entry.rank : undefined} />

            <View style={styles.userInfo}>
                <Text style={[styles.userName, entry.isCurrentUser && styles.currentUserName]}>
                    {entry.displayName}
                    {entry.isCurrentUser && ' (You)'}
                </Text>
                <View style={styles.statsRow}>
                    <Text style={styles.winRate}>
                        {Math.round(entry.winRate * 100)}% win rate
                    </Text>
                    {entry.streak > 0 && (
                        <Text style={styles.streak}>🔥 {entry.streak}</Text>
                    )}
                </View>
            </View>

            <CoinBalance amount={entry.coins} size="sm" />
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={[colors.bgPrimary, colors.bgSecondary]} style={styles.gradient}>
                <View style={styles.header}>
                    <Text style={styles.title}>Leaderboard</Text>
                    <Text style={styles.subtitle}>Top predictors this week</Text>
                </View>

                {/* Period Selector */}
                <View style={styles.periodSelector}>
                    <TouchableOpacity
                        style={[styles.periodButton, selectedPeriod === 'weekly' && styles.periodButtonActive]}
                        onPress={() => setSelectedPeriod('weekly')}
                    >
                        <Text style={[styles.periodText, selectedPeriod === 'weekly' && styles.periodTextActive]}>
                            This Week
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.periodButton, selectedPeriod === 'alltime' && styles.periodButtonActive]}
                        onPress={() => setSelectedPeriod('alltime')}
                    >
                        <Text style={[styles.periodText, selectedPeriod === 'alltime' && styles.periodTextActive]}>
                            All Time
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Top 3 Podium */}
                <View style={styles.podium}>
                    {/* Second Place */}
                    <View style={styles.podiumSpot}>
                        <View style={[styles.podiumAvatar, styles.podiumSecond]}>
                            <Avatar name={leaderboardWithUser[1]?.displayName || '?'} size={56} rank={2} />
                        </View>
                        <Text style={styles.podiumName}>{leaderboardWithUser[1]?.displayName}</Text>
                        <CoinBalance amount={leaderboardWithUser[1]?.coins || 0} size="sm" />
                        <View style={[styles.podiumBar, styles.podiumBarSecond]} />
                    </View>

                    {/* First Place */}
                    <View style={styles.podiumSpot}>
                        <Text style={styles.crownEmoji}>👑</Text>
                        <View style={[styles.podiumAvatar, styles.podiumFirst]}>
                            <Avatar name={leaderboardWithUser[0]?.displayName || '?'} size={72} rank={1} />
                        </View>
                        <Text style={styles.podiumName}>{leaderboardWithUser[0]?.displayName}</Text>
                        <CoinBalance amount={leaderboardWithUser[0]?.coins || 0} size="sm" />
                        <View style={[styles.podiumBar, styles.podiumBarFirst]} />
                    </View>

                    {/* Third Place */}
                    <View style={styles.podiumSpot}>
                        <View style={[styles.podiumAvatar, styles.podiumThird]}>
                            <Avatar name={leaderboardWithUser[2]?.displayName || '?'} size={48} rank={3} />
                        </View>
                        <Text style={styles.podiumName}>{leaderboardWithUser[2]?.displayName}</Text>
                        <CoinBalance amount={leaderboardWithUser[2]?.coins || 0} size="sm" />
                        <View style={[styles.podiumBar, styles.podiumBarThird]} />
                    </View>
                </View>

                {/* Your Position Card */}
                {currentUserEntry && currentUserEntry.rank > 3 && (
                    <Card style={styles.yourPositionCard}>
                        <Text style={styles.yourPositionLabel}>Your Position</Text>
                        {renderLeaderboardEntry(currentUserEntry)}
                    </Card>
                )}

                {/* Full Leaderboard */}
                <ScrollView
                    style={styles.leaderboardList}
                    showsVerticalScrollIndicator={false}
                >
                    {leaderboardWithUser.slice(3).map(renderLeaderboardEntry)}
                    <View style={{ height: spacing.xxl }} />
                </ScrollView>
            </LinearGradient>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgPrimary,
    },
    gradient: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
    },
    title: {
        ...typography.h1,
        color: colors.textPrimary,
    },
    subtitle: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    periodSelector: {
        flexDirection: 'row',
        marginHorizontal: spacing.lg,
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: 4,
        marginBottom: spacing.md,
    },
    periodButton: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderRadius: borderRadius.md,
    },
    periodButtonActive: {
        backgroundColor: colors.primary,
    },
    periodText: {
        ...typography.bodyBold,
        color: colors.textMuted,
    },
    periodTextActive: {
        color: colors.textPrimary,
    },
    podium: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.lg,
        marginBottom: spacing.sm,
    },
    podiumSpot: {
        alignItems: 'center',
        flex: 1,
    },
    crownEmoji: {
        fontSize: 24,
        marginBottom: spacing.xs,
    },
    podiumAvatar: {
        marginBottom: spacing.xs,
    },
    podiumFirst: {
        marginBottom: spacing.sm,
    },
    podiumSecond: {
        marginBottom: spacing.xs,
    },
    podiumThird: {
        marginBottom: spacing.xs,
    },
    podiumName: {
        ...typography.caption,
        color: colors.textPrimary,
        fontWeight: '600',
        marginBottom: 2,
        textAlign: 'center',
    },
    podiumBar: {
        width: '80%',
        borderTopLeftRadius: borderRadius.md,
        borderTopRightRadius: borderRadius.md,
        marginTop: spacing.sm,
    },
    podiumBarFirst: {
        height: 80,
        backgroundColor: colors.rankGold + '40',
    },
    podiumBarSecond: {
        height: 60,
        backgroundColor: colors.rankSilver + '40',
    },
    podiumBarThird: {
        height: 40,
        backgroundColor: colors.rankBronze + '40',
    },
    yourPositionCard: {
        marginHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    yourPositionLabel: {
        ...typography.caption,
        color: colors.textMuted,
        marginBottom: spacing.sm,
    },
    leaderboardList: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    entryRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.cardBorder,
    },
    currentUserRow: {
        backgroundColor: colors.primary + '10',
        marginHorizontal: -spacing.lg,
        paddingHorizontal: spacing.lg,
        borderRadius: borderRadius.md,
        borderBottomWidth: 0,
    },
    rankContainer: {
        width: 40,
        alignItems: 'center',
    },
    rankEmoji: {
        fontSize: 20,
    },
    rankNumber: {
        ...typography.bodyBold,
    },
    userInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    userName: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    currentUserName: {
        color: colors.primary,
    },
    statsRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    winRate: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    streak: {
        ...typography.caption,
        color: colors.boostActive,
    },
});
