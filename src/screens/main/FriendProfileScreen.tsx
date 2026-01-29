// Friend Profile Screen
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, gradients, shadows } from '../../theme';
import { Card, Button, Badge } from '../../components/common';
import { Friend } from '../../store/friendsStore';

interface Props {
    navigation: any;
    route?: { params?: { friend?: Friend } };
}

const DEFAULT_FRIEND: Friend = {
    id: 'unknown',
    name: 'Friend',
    avatar: '👤',
    universityId: 'osu',
    university: 'Ohio State',
    coins: 0,
    totalWins: 0,
    winRate: 0,
    streak: 0,
    isAtStadium: false,
    isOnline: false,
    lastActivity: '',
    status: 'offline',
};

export const FriendProfileScreen: React.FC<Props> = ({ navigation, route }) => {
    const friend = route?.params?.friend ?? DEFAULT_FRIEND;

    const handleChallenge = () => {
        navigation.navigate('SpeedChallenge', { friend });
    };

    const handleMessage = () => {
        navigation.navigate('DirectMessage', { friend });
    };

    // Mock stats for the friend
    const stats = {
        predictions: Math.floor(Math.random() * 200) + 50,
        wins: Math.floor(Math.random() * 100) + 20,
        gamesAttended: Math.floor(Math.random() * 30) + 5,
        level: Math.floor(Math.random() * 20) + 5,
    };
    const winRate = Math.round((stats.wins / stats.predictions) * 100);

    // Mock achievements
    const achievements = [
        { emoji: '🏟️', name: 'Stadium Regular', desc: '10+ games attended' },
        { emoji: '🔥', name: 'Hot Streak', desc: '5 wins in a row' },
        { emoji: '🎯', name: 'Sharpshooter', desc: '60%+ win rate' },
        { emoji: '🌟', name: 'Rising Star', desc: 'Top 100 weekly' },
    ];

    // Mock recent predictions
    const recentPredictions = [
        { game: 'OSU vs MICH', pick: 'OSU -7.5', result: 'won', coins: '+250' },
        { game: 'IU vs UD', pick: 'Over 145.5', result: 'lost', coins: '-100' },
        { game: 'USC vs OSU', pick: 'USC ML', result: 'pending', coins: '150' },
    ];

    return (
        <View style={styles.container}>
            <LinearGradient colors={gradients.dark} style={styles.gradient}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.backText}>← Back</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Profile Hero */}
                        <View style={styles.heroSection}>
                            <View style={styles.avatarLarge}>
                                <Text style={styles.avatarEmoji}>{friend.avatar}</Text>
                                {friend.isOnline && <View style={styles.onlineIndicator} />}
                            </View>
                            <Text style={styles.name}>{friend.name}</Text>
                            <Text style={styles.university}>{friend.university}</Text>

                            <View style={styles.statusRow}>
                                {friend.isAtStadium && (
                                    <Badge text="🏟️ At Stadium Now" variant="boost" />
                                )}
                                {friend.isOnline && !friend.isAtStadium && (
                                    <Badge text="Online" variant="success" />
                                )}
                            </View>

                            <View style={styles.levelBadge}>
                                <Text style={styles.levelText}>Level {stats.level}</Text>
                            </View>
                        </View>

                        {/* Action Buttons */}
                        <View style={styles.actionRow}>
                            <Button
                                title="🎯 Challenge"
                                onPress={handleChallenge}
                                variant="primary"
                                size="md"
                                style={styles.actionButton}
                            />
                            <Button
                                title="💬 Message"
                                onPress={handleMessage}
                                variant="outline"
                                size="md"
                                style={styles.actionButton}
                            />
                        </View>

                        {/* Stats */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Stats</Text>
                            <View style={styles.statsGrid}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{stats.predictions}</Text>
                                    <Text style={styles.statLabel}>Predictions</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{winRate}%</Text>
                                    <Text style={styles.statLabel}>Win Rate</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{friend.streak}🔥</Text>
                                    <Text style={styles.statLabel}>Streak</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{stats.gamesAttended}</Text>
                                    <Text style={styles.statLabel}>Games</Text>
                                </View>
                            </View>
                        </View>

                        {/* Achievements */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Achievements</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                <View style={styles.achievementsRow}>
                                    {achievements.map((ach, i) => (
                                        <View key={i} style={styles.achievementCard}>
                                            <Text style={styles.achievementEmoji}>{ach.emoji}</Text>
                                            <Text style={styles.achievementName}>{ach.name}</Text>
                                            <Text style={styles.achievementDesc}>{ach.desc}</Text>
                                        </View>
                                    ))}
                                </View>
                            </ScrollView>
                        </View>

                        {/* Recent Predictions */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Recent Predictions</Text>
                            {recentPredictions.map((pred, i) => (
                                <Card key={i} style={styles.predictionCard}>
                                    <View style={styles.predictionRow}>
                                        <View style={styles.predictionInfo}>
                                            <Text style={styles.predictionGame}>{pred.game}</Text>
                                            <Text style={styles.predictionPick}>{pred.pick}</Text>
                                        </View>
                                        <View style={styles.predictionResult}>
                                            <Badge
                                                text={pred.result.toUpperCase()}
                                                variant={pred.result === 'won' ? 'success' : pred.result === 'lost' ? 'error' : 'warning'}
                                            />
                                            <Text style={[
                                                styles.predictionCoins,
                                                pred.result === 'won' ? styles.coinsWon : pred.result === 'lost' ? styles.coinsLost : {}
                                            ]}>
                                                {pred.coins}
                                            </Text>
                                        </View>
                                    </View>
                                </Card>
                            ))}
                        </View>

                        <View style={{ height: 100 }} />
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        </View>
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
    safeArea: {
        flex: 1,
    },
    header: {
        paddingHorizontal: spacing.lg,
    },
    backButton: {
        paddingVertical: spacing.sm,
    },
    backText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    heroSection: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    avatarLarge: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatarEmoji: {
        fontSize: 80,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 5,
        right: 5,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: colors.success,
        borderWidth: 3,
        borderColor: colors.bgPrimary,
    },
    name: {
        ...typography.h1,
        color: colors.textPrimary,
    },
    university: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    statusRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    levelBadge: {
        backgroundColor: colors.primary + '30',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    levelText: {
        ...typography.bodyBold,
        color: colors.primary,
    },
    actionRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        gap: spacing.md,
        marginBottom: spacing.xl,
    },
    actionButton: {
        flex: 1,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    statsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    statBox: {
        flex: 1,
        minWidth: '45%',
        backgroundColor: colors.bgCard,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    statValue: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    statLabel: {
        ...typography.small,
        color: colors.textMuted,
    },
    achievementsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    achievementCard: {
        width: 100,
        backgroundColor: colors.bgCard,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    achievementEmoji: {
        fontSize: 28,
        marginBottom: spacing.xs,
    },
    achievementName: {
        ...typography.small,
        color: colors.textPrimary,
        fontWeight: '600',
        textAlign: 'center',
    },
    achievementDesc: {
        ...typography.micro,
        color: colors.textMuted,
        textAlign: 'center',
    },
    predictionCard: {
        marginBottom: spacing.sm,
    },
    predictionRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    predictionInfo: {
        flex: 1,
    },
    predictionGame: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    predictionPick: {
        ...typography.small,
        color: colors.textSecondary,
    },
    predictionResult: {
        alignItems: 'flex-end',
        gap: spacing.xs,
    },
    predictionCoins: {
        ...typography.bodyBold,
        color: colors.textSecondary,
    },
    coinsWon: {
        color: colors.success,
    },
    coinsLost: {
        color: colors.error,
    },
});
