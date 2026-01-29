// Enhanced Home Screen with Polymarket-style Design
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
import { colors, spacing, borderRadius, typography, gradients, shadows, commonStyles } from '../../theme';
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

// Helper to convert American odds to probability %
const getProbability = (odds: number): number => {
    if (odds > 0) {
        return Math.round((100 / (odds + 100)) * 100);
    } else {
        return Math.round((Math.abs(odds) / (Math.abs(odds) + 100)) * 100);
    }
};

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
    const hotMarkets = markets.filter(m => m.status === 'open').slice(0, 3);
    const friendsAtStadium = friends.filter(f => f.isAtStadium);

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                {/* Toast Notification */}
                {currentToast && (
                    <ActivityToast
                        message={currentToast}
                        onDismiss={() => setCurrentToast(null)}
                    />
                )}

                {/* Polymarket-style Header */}
                <View style={styles.header}>
                    <Text style={styles.headerTitle}>Markets</Text>
                    <View style={styles.headerRight}>
                        <TouchableOpacity
                            style={[styles.locationBadge, isAtStadium && styles.locationBadgeActive]}
                            onPress={() => simulateStadiumPresence(!isAtStadium)}
                        >
                            <Text style={styles.locationIcon}>{isAtStadium ? '🔥' : '🏟️'}</Text>
                            <Text style={styles.locationText}>
                                {isAtStadium ? `${boostMultiplier}x Boost` : 'Simulate'}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.coinContainer}>
                            <Text style={styles.coinText}>{user?.coins?.toLocaleString()}</Text>
                            <Text style={styles.coinSymbol}>₵</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

                    {/* Internship Challenge Banner (New Phase 3) */}
                    <TouchableOpacity
                        style={styles.promoBanner}
                        onPress={() => navigation.navigate('PromotionalChallenge')}
                    >
                        <LinearGradient
                            colors={['#161B22', '#0D1117']}
                            style={styles.promoContent}
                        >
                            <View style={styles.promoLeft}>
                                <Text style={styles.promoBadge}>EXPERIENCE</Text>
                                <Text style={styles.promoTitle}>Win a Sports Analytics Internship</Text>
                                <Text style={styles.promoSubtitle}>Predict 4 weeks of games perfectly.</Text>
                            </View>
                            <Text style={styles.promoIcon}>🏆</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    {/* Featured / Live Banner */}
                    {liveGames.length > 0 && (
                        <View style={styles.featuredContainer}>
                            {liveGames.map(game => (
                                <View key={game.id} style={styles.liveGameRow}>
                                    <View style={styles.liveIndicator}>
                                        <View style={styles.redDot} />
                                        <Text style={styles.liveText}>LIVE</Text>
                                    </View>
                                    <Text style={styles.liveGameText}>
                                        {game.awayTeam.shortName} {game.awayScore} - {game.homeTeam.shortName} {game.homeScore}
                                    </Text>
                                    <Text style={styles.liveGameTime}>{game.quarter}</Text>
                                </View>
                            ))}
                        </View>
                    )}

                    {/* Trending Markets - List View */}
                    <View style={styles.section}>
                        <Text style={styles.sectionTitle}>Trending</Text>
                        {hotMarkets.map(market => (
                            <TouchableOpacity
                                key={market.id}
                                style={styles.marketRow}
                                onPress={() => navigation.navigate('Predict')}
                            >
                                <View style={styles.marketInfo}>
                                    <View style={styles.marketHeaderRow}>
                                        {market.isStadiumExclusive && (
                                            <Text style={styles.stadiumTag}>🏟️ STADIUM ONLY</Text>
                                        )}
                                        <Text style={styles.marketTitle} numberOfLines={2}>{market.title}</Text>
                                    </View>
                                </View>

                                <View style={styles.outcomesContainer}>
                                    {market.options.slice(0, 2).map((opt, index) => {
                                        const probability = getProbability(opt.odds);
                                        const isYes = index === 0; // Simplified assumption for demo
                                        const barColor = isYes ? colors.yes : colors.no;

                                        return (
                                            <View key={opt.id} style={styles.outcomeButton}>
                                                <View style={[
                                                    StyleSheet.absoluteFill,
                                                    { backgroundColor: barColor, opacity: 0.15, width: `${probability}%` }
                                                ]} />
                                                <Text style={[styles.outcomeName, { color: barColor }]}>
                                                    {opt.label}
                                                </Text>
                                                <Text style={[styles.outcomeProb, { color: colors.textPrimary }]}>
                                                    {probability}%
                                                </Text>
                                            </View>
                                        );
                                    })}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Interactive Stadium Preview (Smaller, integrated) */}
                    <View style={styles.section}>
                        <View style={styles.sectionHeaderRow}>
                            <Text style={styles.sectionTitle}>Stadium Activity</Text>
                            <Text style={styles.sectionAction}>{friendsAtStadium.length} Friends Here</Text>
                        </View>
                        <View style={styles.stadiumWrapper}>
                            <StadiumView
                                friends={friends}
                                isUserAtStadium={isAtStadium}
                                userPosition={isAtStadium ? { x: 50, y: 55 } : undefined}
                            />
                            {isAtStadium && (
                                <TouchableOpacity
                                    style={styles.chatOverlayButton}
                                    onPress={() => navigation.navigate('Chatroom')}
                                >
                                    <Text style={styles.chatButtonText}>Join Chat</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>

                    {/* Recent Activity (Text based, dense) */}
                    {messages.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Feed</Text>
                            {messages.slice(0, 4).map((msg) => (
                                <View key={msg.id} style={styles.feedItem}>
                                    <Text style={styles.feedAvatar}>{msg.friendAvatar}</Text>
                                    <View style={styles.feedContent}>
                                        <Text style={styles.feedText}>
                                            <Text style={styles.feedName}>{msg.friendName}</Text> {msg.content}
                                        </Text>
                                        <Text style={styles.feedTime}>2m ago</Text>
                                    </View>
                                </View>
                            ))}
                        </View>
                    )}

                    <View style={{ height: 100 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgPrimary,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.bgPrimary,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: colors.textPrimary,
        letterSpacing: -0.5,
    },
    headerRight: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bgSecondary,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    coinText: {
        ...typography.mono,
        color: colors.gold,
        fontWeight: '700',
        fontSize: 14,
    },
    coinSymbol: {
        color: colors.gold,
        marginLeft: spacing.xs,
        fontSize: 14,
    },
    locationBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.sm,
        backgroundColor: colors.bgSecondary,
        borderWidth: 1,
        borderColor: colors.border,
        gap: 4,
    },
    locationBadgeActive: {
        borderColor: colors.boostActive, // Using alias
        backgroundColor: 'rgba(210, 153, 34, 0.1)',
    },
    locationIcon: {
        fontSize: 12,
    },
    locationText: {
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    // Promo Banner
    promoBanner: {
        marginHorizontal: spacing.lg,
        marginTop: spacing.lg,
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.gold,
    },
    promoContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
    },
    promoLeft: {
        flex: 1,
    },
    promoBadge: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.gold,
        marginBottom: 4,
        letterSpacing: 1,
    },
    promoTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: 2,
    },
    promoSubtitle: {
        fontSize: 12,
        color: colors.textSecondary,
    },
    promoIcon: {
        fontSize: 32,
    },

    // Featured
    featuredContainer: {
        padding: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    liveGameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: colors.bgSecondary,
        padding: spacing.sm,
        borderRadius: borderRadius.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    redDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.error,
    },
    liveText: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.error,
    },
    liveGameText: {
        ...typography.bodyBold,
        fontSize: 13,
    },
    liveGameTime: {
        ...typography.mono,
        fontSize: 12,
        color: colors.textSecondary,
    },

    // Sections
    section: {
        marginTop: spacing.xl,
        paddingHorizontal: spacing.lg,
    },
    sectionHeaderRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    sectionAction: {
        fontSize: 12,
        color: colors.primary,
        fontWeight: '600',
    },

    // Market Rows (Polymarket Style)
    marketRow: {
        backgroundColor: colors.bgSecondary,
        borderRadius: borderRadius.md, // sharper
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 1,
        borderColor: colors.border,
    },
    marketInfo: {
        marginBottom: spacing.md,
    },
    marketHeaderRow: {
        flexDirection: 'column',
        gap: 4,
    },
    stadiumTag: {
        fontSize: 10,
        fontWeight: '700',
        color: colors.gold,
        marginBottom: 2,
    },
    marketTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: colors.textPrimary,
        lineHeight: 22,
    },
    outcomesContainer: {
        flexDirection: 'column',
        gap: 6,
    },
    outcomeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: 36,
        borderRadius: borderRadius.sm,
        paddingHorizontal: spacing.md,
        position: 'relative',
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border, // Very subtle border
    },
    outcomeName: {
        fontSize: 13,
        fontWeight: '600',
        position: 'relative',
        zIndex: 1,
    },
    outcomeProb: {
        fontSize: 13,
        fontWeight: '600',
        position: 'relative',
        zIndex: 1,
    },

    // Stadium
    stadiumWrapper: {
        height: 200,
        borderRadius: borderRadius.lg, // slightly rounder for the view
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.border,
        position: 'relative',
    },
    chatOverlayButton: {
        position: 'absolute',
        bottom: spacing.md,
        right: spacing.md,
        backgroundColor: colors.bgElevated,
        paddingHorizontal: spacing.md,
        paddingVertical: 6,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.border,
    },
    chatButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textPrimary,
    },

    // Activity Feed (Dense)
    feedItem: {
        flexDirection: 'row',
        paddingVertical: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    feedAvatar: {
        fontSize: 18,
        marginRight: spacing.md,
    },
    feedContent: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
    },
    feedText: {
        fontSize: 13,
        color: colors.textSecondary,
        flex: 1,
        marginRight: spacing.sm,
        lineHeight: 18,
    },
    feedName: {
        color: colors.textPrimary,
        fontWeight: '600',
    },
    feedTime: {
        fontSize: 11,
        color: colors.textTertiary,
    },

    // Toast
    toast: {
        position: 'absolute',
        top: 60,
        left: spacing.lg,
        right: spacing.lg,
        backgroundColor: colors.bgElevated,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.primary,
        zIndex: 100,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    toastAvatar: {
        fontSize: 20,
        marginRight: spacing.md,
    },
    toastContent: {
        flex: 1,
    },
    toastName: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textPrimary,
    },
    toastText: {
        fontSize: 12,
        color: colors.textSecondary,
    },
});
