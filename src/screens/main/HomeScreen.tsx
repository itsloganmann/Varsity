// Home Screen
import React, { useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, gradients } from '../../theme';
import { Card, CoinBalance, Badge, SectionHeader } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { usePredictionStore } from '../../store/predictionStore';
import { useLocationStore } from '../../store/locationStore';
import { Game, PredictionMarket } from '../../types';

interface Props {
    navigation: any;
}

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { user, selectedUniversity } = useAuthStore();
    const { games, markets, loadMarkets, userPredictions } = usePredictionStore();
    const { isAtStadium, boostMultiplier, simulateStadiumPresence } = useLocationStore();
    const [refreshing, setRefreshing] = React.useState(false);

    useEffect(() => {
        loadMarkets();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        loadMarkets();
        setTimeout(() => setRefreshing(false), 1000);
    };

    const liveGames = games.filter(g => g.status === 'live');
    const upcomingGames = games.filter(g => g.status === 'upcoming');
    const hotMarkets = markets.filter(m => m.status === 'open').slice(0, 3);

    const formatTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    };

    const renderGameCard = (game: Game) => (
        <Card
            key={game.id}
            style={styles.gameCard}
            onPress={() => navigation.navigate('Predictions', { gameId: game.id })}
        >
            <View style={styles.gameHeader}>
                <Badge
                    text={game.status === 'live' ? '🔴 LIVE' : formatTime(game.startTime)}
                    variant={game.status === 'live' ? 'error' : 'info'}
                />
                <Text style={styles.sportBadge}>{game.sport === 'football' ? '🏈' : '🏀'}</Text>
            </View>
            <View style={styles.teamsContainer}>
                <View style={styles.team}>
                    <Text style={styles.teamInitial}>{game.awayTeam.shortName}</Text>
                    {game.status === 'live' && (
                        <Text style={styles.score}>{game.awayScore}</Text>
                    )}
                </View>
                <Text style={styles.vs}>@</Text>
                <View style={styles.team}>
                    <Text style={styles.teamInitial}>{game.homeTeam.shortName}</Text>
                    {game.status === 'live' && (
                        <Text style={styles.score}>{game.homeScore}</Text>
                    )}
                </View>
            </View>
            <Text style={styles.venue}>{game.venue}</Text>
        </Card>
    );

    const renderMarketCard = (market: PredictionMarket) => {
        const game = games.find(g => g.id === market.gameId);
        return (
            <Card
                key={market.id}
                style={styles.marketCard}
                onPress={() => navigation.navigate('Predictions', { marketId: market.id })}
            >
                <View style={styles.marketHeader}>
                    {market.isStadiumExclusive && (
                        <Badge text="🏟️ Stadium Only" variant="boost" />
                    )}
                    {market.boostMultiplier > 1 && (
                        <Badge text={`${market.boostMultiplier}x Boost`} variant="warning" />
                    )}
                </View>
                <Text style={styles.marketTitle}>{market.title}</Text>
                {game && (
                    <Text style={styles.marketGame}>
                        {game.awayTeam.shortName} @ {game.homeTeam.shortName}
                    </Text>
                )}
                <View style={styles.oddsRow}>
                    {market.options.map(opt => (
                        <View key={opt.id} style={styles.oddsOption}>
                            <Text style={styles.oddsLabel}>{opt.label}</Text>
                            <Text style={[styles.oddsValue, opt.odds > 0 ? styles.oddsPositive : styles.oddsNegative]}>
                                {opt.odds > 0 ? '+' : ''}{opt.odds}
                            </Text>
                        </View>
                    ))}
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={[colors.bgPrimary, colors.bgSecondary]} style={styles.gradient}>
                <ScrollView
                    showsVerticalScrollIndicator={false}
                    refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={colors.primary} />}
                >
                    {/* Header */}
                    <View style={styles.header}>
                        <View>
                            <Text style={styles.greeting}>Hey, {user?.displayName || 'Fan'}! 👋</Text>
                            <Text style={styles.university}>{selectedUniversity?.name || 'Your University'}</Text>
                        </View>
                        <TouchableOpacity style={styles.coinBox}>
                            <CoinBalance amount={user?.coins || 0} size="md" />
                        </TouchableOpacity>
                    </View>

                    {/* Stadium Boost Banner */}
                    <TouchableOpacity
                        style={styles.boostBanner}
                        onPress={() => simulateStadiumPresence(!isAtStadium)}
                    >
                        <LinearGradient
                            colors={isAtStadium ? gradients.boost : [colors.bgCard, colors.bgElevated]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={styles.boostGradient}
                        >
                            <Text style={styles.boostIcon}>{isAtStadium ? '🔥' : '🏟️'}</Text>
                            <View style={styles.boostInfo}>
                                <Text style={styles.boostTitle}>
                                    {isAtStadium ? `Stadium Boost Active!` : 'Stadium Boost'}
                                </Text>
                                <Text style={styles.boostSubtitle}>
                                    {isAtStadium
                                        ? `${boostMultiplier}x multiplier on all predictions`
                                        : 'Tap to simulate being at the stadium'}
                                </Text>
                            </View>
                            <Text style={styles.boostMultiplier}>
                                {boostMultiplier}x
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Live Games */}
                    {liveGames.length > 0 && (
                        <View style={styles.section}>
                            <SectionHeader title="🔴 Live Now" />
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {liveGames.map(renderGameCard)}
                            </ScrollView>
                        </View>
                    )}

                    {/* Hot Markets */}
                    <View style={styles.section}>
                        <SectionHeader
                            title="🔥 Hot Predictions"
                            action="See All"
                            onAction={() => navigation.navigate('Predictions')}
                        />
                        {hotMarkets.map(renderMarketCard)}
                    </View>

                    {/* Upcoming Games */}
                    <View style={styles.section}>
                        <SectionHeader title="📅 Upcoming Games" />
                        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                            {upcomingGames.map(renderGameCard)}
                        </ScrollView>
                    </View>

                    {/* Quick Stats */}
                    <View style={styles.statsRow}>
                        <Card style={styles.statCard}>
                            <Text style={styles.statValue}>{user?.totalPredictions || 0}</Text>
                            <Text style={styles.statLabel}>Predictions</Text>
                        </Card>
                        <Card style={styles.statCard}>
                            <Text style={styles.statValue}>{user?.totalWins || 0}</Text>
                            <Text style={styles.statLabel}>Wins</Text>
                        </Card>
                        <Card style={styles.statCard}>
                            <Text style={styles.statValue}>{user?.streak || 0}</Text>
                            <Text style={styles.statLabel}>Streak 🔥</Text>
                        </Card>
                    </View>

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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.lg,
    },
    greeting: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    university: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    coinBox: {
        backgroundColor: colors.bgCard,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
    },
    boostBanner: {
        marginHorizontal: spacing.lg,
        marginBottom: spacing.lg,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
    },
    boostGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    boostIcon: {
        fontSize: 32,
        marginRight: spacing.md,
    },
    boostInfo: {
        flex: 1,
    },
    boostTitle: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    boostSubtitle: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    boostMultiplier: {
        ...typography.h1,
        color: colors.coinGold,
    },
    section: {
        marginBottom: spacing.lg,
        paddingHorizontal: spacing.lg,
    },
    gameCard: {
        width: 200,
        marginRight: spacing.md,
    },
    gameHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    sportBadge: {
        fontSize: 18,
    },
    teamsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    team: {
        alignItems: 'center',
    },
    teamInitial: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    score: {
        ...typography.h2,
        color: colors.primary,
        marginTop: 4,
    },
    vs: {
        ...typography.body,
        color: colors.textMuted,
        marginHorizontal: spacing.md,
    },
    venue: {
        ...typography.small,
        color: colors.textMuted,
        textAlign: 'center',
    },
    marketCard: {
        marginBottom: spacing.sm,
    },
    marketHeader: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    marketTitle: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    marketGame: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    oddsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    oddsOption: {
        flex: 1,
        backgroundColor: colors.bgElevated,
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    oddsLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    oddsValue: {
        ...typography.odds,
        color: colors.textPrimary,
    },
    oddsPositive: {
        color: colors.success,
    },
    oddsNegative: {
        color: colors.secondary,
    },
    statsRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
        marginTop: spacing.md,
    },
    statCard: {
        flex: 1,
        alignItems: 'center',
    },
    statValue: {
        ...typography.h2,
        color: colors.primary,
    },
    statLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
});
