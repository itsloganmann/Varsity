// Enhanced Home Screen with 3D Stadium and Friends Feed
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, gradients, shadows } from '../../theme';
import { Card, CoinBalance, Badge, SectionHeader } from '../../components/common';
import { StadiumView } from '../../components/stadium';
import { useAuthStore } from '../../store/authStore';
import { usePredictionStore } from '../../store/predictionStore';
import { useLocationStore } from '../../store/locationStore';
import { useFriendsStore, FriendMessage } from '../../store/friendsStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface Props {
    navigation: any;
}

// Toast notification for friend activity
const ActivityToast: React.FC<{ message: FriendMessage; onDismiss: () => void }> = ({
    message,
    onDismiss,
}) => {
    const slideAnim = React.useRef(new Animated.Value(-100)).current;

    useEffect(() => {
        Animated.sequence([
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 50,
            }),
            Animated.delay(3000),
            Animated.timing(slideAnim, {
                toValue: -100,
                duration: 300,
                useNativeDriver: true,
            }),
        ]).start(() => onDismiss());
    }, []);

    return (
        <Animated.View style={[styles.toast, { transform: [{ translateY: slideAnim }] }]}>
            <Text style={styles.toastAvatar}>{message.friendAvatar}</Text>
            <View style={styles.toastContent}>
                <Text style={styles.toastName}>{message.friendName}</Text>
                <Text style={styles.toastText}>{message.content}</Text>
            </View>
        </Animated.View>
    );
};

export const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { user } = useAuthStore();
    const { games, markets, loadMarkets } = usePredictionStore();
    const { isAtStadium, boostMultiplier, simulateStadiumPresence } = useLocationStore();
    const {
        friends,
        messages,
        loadFriends,
        startSimulation,
        stopSimulation
    } = useFriendsStore();

    const [currentToast, setCurrentToast] = useState<FriendMessage | null>(null);

    useEffect(() => {
        loadMarkets();
        loadFriends();
        startSimulation();
        return () => stopSimulation();
    }, []);

    // Show latest message as toast
    useEffect(() => {
        if (messages.length > 0 && messages[0] !== currentToast) {
            setCurrentToast(messages[0]);
        }
    }, [messages]);

    const liveGames = games.filter(g => g.status === 'live');
    const upcomingGames = games.filter(g => g.status === 'upcoming').slice(0, 3);
    const hotMarkets = markets.filter(m => m.status === 'open').slice(0, 2);
    const friendsAtStadium = friends.filter(f => f.isAtStadium);

    return (
        <View style={styles.container}>
            <LinearGradient colors={gradients.dark} style={styles.gradient}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    {/* Toast Notification */}
                    {currentToast && (
                        <ActivityToast
                            message={currentToast}
                            onDismiss={() => setCurrentToast(null)}
                        />
                    )}

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View style={styles.header}>
                            <View>
                                <Text style={styles.greeting}>
                                    {getGreeting()}, {user?.displayName?.split(' ')[0] || 'Fan'}
                                </Text>
                                <Text style={styles.subtitle}>
                                    {isAtStadium ? '🏟️ You\'re at the game!' : 'Ready to predict?'}
                                </Text>
                            </View>
                            <TouchableOpacity style={styles.coinContainer}>
                                <CoinBalance amount={user?.coins || 0} size="md" />
                            </TouchableOpacity>
                        </View>

                        {/* Stadium Boost Toggle (Demo) */}
                        <View style={styles.boostSection}>
                            <TouchableOpacity
                                style={[styles.boostToggle, isAtStadium && styles.boostToggleActive]}
                                onPress={() => simulateStadiumPresence(!isAtStadium)}
                            >
                                <LinearGradient
                                    colors={isAtStadium ? gradients.boost : ['transparent', 'transparent']}
                                    style={styles.boostGradient}
                                >
                                    <Text style={styles.boostIcon}>{isAtStadium ? '🔥' : '🏟️'}</Text>
                                    <View style={styles.boostText}>
                                        <Text style={styles.boostTitle}>
                                            {isAtStadium ? `Stadium Boost Active` : 'Simulate Stadium'}
                                        </Text>
                                        <Text style={styles.boostSubtitle}>
                                            {isAtStadium ? `${boostMultiplier}x multiplier on wins` : 'Tap to test booth mode'}
                                        </Text>
                                    </View>
                                    {isAtStadium && (
                                        <View style={styles.boostBadge}>
                                            <Text style={styles.boostBadgeText}>{boostMultiplier}x</Text>
                                        </View>
                                    )}
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                        {/* 3D Stadium View */}
                        <View style={styles.section}>
                            <SectionHeader
                                title="Live at Stadium"
                                action={`${friendsAtStadium.length} friends`}
                            />
                            <StadiumView
                                friends={friends}
                                isUserAtStadium={isAtStadium}
                                userPosition={isAtStadium ? { x: 50, y: 55 } : undefined}
                            />
                        </View>

                        {/* Friend Activity Feed */}
                        {messages.length > 0 && (
                            <View style={styles.section}>
                                <SectionHeader title="Friend Activity" />
                                <ScrollView
                                    horizontal
                                    showsHorizontalScrollIndicator={false}
                                    contentContainerStyle={styles.activityFeed}
                                >
                                    {messages.slice(0, 5).map((msg) => (
                                        <View key={msg.id} style={styles.activityCard}>
                                            <Text style={styles.activityAvatar}>{msg.friendAvatar}</Text>
                                            <Text style={styles.activityName}>{msg.friendName.split(' ')[0]}</Text>
                                            <Text style={styles.activityText} numberOfLines={2}>
                                                {msg.content}
                                            </Text>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        {/* Live Games */}
                        {liveGames.length > 0 && (
                            <View style={styles.section}>
                                <SectionHeader
                                    title="🔴 Live Now"
                                    action="See All"
                                    onAction={() => navigation.navigate('Predictions')}
                                />
                                {liveGames.map(game => (
                                    <Card key={game.id} style={styles.gameCard}>
                                        <View style={styles.gameHeader}>
                                            <Badge text="LIVE" variant="error" />
                                            <Text style={styles.gameTime}>Q2 • 8:42</Text>
                                        </View>
                                        <View style={styles.gameTeams}>
                                            <View style={styles.team}>
                                                <Text style={styles.teamLogo}>{game.awayTeam.logo}</Text>
                                                <Text style={styles.teamName}>{game.awayTeam.shortName}</Text>
                                                <Text style={styles.teamScore}>21</Text>
                                            </View>
                                            <Text style={styles.vs}>@</Text>
                                            <View style={styles.team}>
                                                <Text style={styles.teamLogo}>{game.homeTeam.logo}</Text>
                                                <Text style={styles.teamName}>{game.homeTeam.shortName}</Text>
                                                <Text style={styles.teamScore}>28</Text>
                                            </View>
                                        </View>
                                    </Card>
                                ))}
                            </View>
                        )}

                        {/* Hot Markets */}
                        <View style={styles.section}>
                            <SectionHeader
                                title="🔥 Hot Predictions"
                                action="View All"
                                onAction={() => navigation.navigate('Predictions')}
                            />
                            {hotMarkets.map(market => (
                                <TouchableOpacity
                                    key={market.id}
                                    onPress={() => navigation.navigate('Predictions')}
                                >
                                    <Card style={styles.marketCard}>
                                        <View style={styles.marketHeader}>
                                            {market.isStadiumExclusive && (
                                                <Badge text="🏟️ Stadium" variant="boost" />
                                            )}
                                            {market.type === 'flash_prop' && (
                                                <Badge text="⚡ Flash" variant="warning" />
                                            )}
                                        </View>
                                        <Text style={styles.marketTitle}>{market.title}</Text>
                                        <View style={styles.marketOptions}>
                                            {market.options.slice(0, 2).map(opt => (
                                                <View key={opt.id} style={styles.marketOption}>
                                                    <Text style={styles.optionLabel}>{opt.label}</Text>
                                                    <Text style={[
                                                        styles.optionOdds,
                                                        opt.odds > 0 ? styles.oddsGreen : styles.oddsRed,
                                                    ]}>
                                                        {opt.odds > 0 ? '+' : ''}{opt.odds}
                                                    </Text>
                                                </View>
                                            ))}
                                        </View>
                                    </Card>
                                </TouchableOpacity>
                            ))}
                        </View>

                        {/* Quick Stats */}
                        <View style={styles.section}>
                            <View style={styles.statsRow}>
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{user?.totalPredictions || 0}</Text>
                                    <Text style={styles.statLabel}>Predictions</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{user?.totalWins || 0}</Text>
                                    <Text style={styles.statLabel}>Wins</Text>
                                </View>
                                <View style={styles.statBox}>
                                    <Text style={styles.statValue}>{user?.streak || 0}🔥</Text>
                                    <Text style={styles.statLabel}>Streak</Text>
                                </View>
                            </View>
                        </View>

                        <View style={{ height: 100 }} />
                    </ScrollView>
                </SafeAreaView>
            </LinearGradient>
        </View>
    );
};

const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
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
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingTop: spacing.md,
        paddingBottom: spacing.md,
    },
    greeting: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    subtitle: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    coinContainer: {
        backgroundColor: colors.bgCard,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    boostSection: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    boostToggle: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    boostToggleActive: {
        borderColor: colors.boostActive,
        ...shadows.glowOrange,
    },
    boostGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
    },
    boostIcon: {
        fontSize: 28,
        marginRight: spacing.md,
    },
    boostText: {
        flex: 1,
    },
    boostTitle: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    boostSubtitle: {
        ...typography.small,
        color: colors.textSecondary,
    },
    boostBadge: {
        backgroundColor: colors.boostActive,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xxs,
        borderRadius: borderRadius.full,
    },
    boostBadgeText: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginTop: spacing.lg,
    },
    toast: {
        position: 'absolute',
        top: 100,
        left: spacing.lg,
        right: spacing.lg,
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
        zIndex: 100,
        ...shadows.lg,
    },
    toastAvatar: {
        fontSize: 24,
        marginRight: spacing.sm,
    },
    toastContent: {
        flex: 1,
    },
    toastName: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    toastText: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    activityFeed: {
        paddingRight: spacing.lg,
        gap: spacing.sm,
    },
    activityCard: {
        width: 100,
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    activityAvatar: {
        fontSize: 24,
        marginBottom: spacing.xxs,
    },
    activityName: {
        ...typography.small,
        color: colors.textPrimary,
        fontWeight: '600',
    },
    activityText: {
        ...typography.micro,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: 2,
    },
    gameCard: {
        marginBottom: spacing.sm,
    },
    gameHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    gameTime: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    gameTeams: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: spacing.lg,
    },
    team: {
        alignItems: 'center',
        flex: 1,
    },
    teamLogo: {
        fontSize: 32,
        marginBottom: spacing.xs,
    },
    teamName: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    teamScore: {
        ...typography.stat,
        color: colors.textPrimary,
    },
    vs: {
        ...typography.body,
        color: colors.textMuted,
    },
    marketCard: {
        marginBottom: spacing.sm,
    },
    marketHeader: {
        flexDirection: 'row',
        gap: spacing.xs,
        marginBottom: spacing.sm,
    },
    marketTitle: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    marketOptions: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    marketOption: {
        flex: 1,
        backgroundColor: colors.bgElevated,
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    optionLabel: {
        ...typography.small,
        color: colors.textSecondary,
        marginBottom: 2,
    },
    optionOdds: {
        ...typography.bodyBold,
    },
    oddsGreen: {
        color: colors.success,
    },
    oddsRed: {
        color: colors.secondary,
    },
    statsRow: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    statBox: {
        flex: 1,
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
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
});
