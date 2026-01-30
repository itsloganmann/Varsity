// Account Screen - Profile, Stats, Sign Out
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Animated,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, gradients, shadows } from '../../theme';
import { CoinBalance } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { useFriendsStore } from '../../store/friendsStore';

interface Props {
    navigation: any;
}

// Animated stat counter
const AnimatedStat: React.FC<{ value: number; label: string; prefix?: string; suffix?: string }> = ({
    value,
    label,
    prefix = '',
    suffix = '',
}) => {
    const animatedValue = useRef(new Animated.Value(0)).current;
    const displayValue = useRef(0);

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: value,
            duration: 1500,
            useNativeDriver: false,
        }).start();
    }, [value]);

    return (
        <View style={styles.statItem}>
            <Text style={styles.statValue}>
                {prefix}{value.toLocaleString()}{suffix}
            </Text>
            <Text style={styles.statLabel}>{label}</Text>
        </View>
    );
};

export const AccountScreen: React.FC<Props> = ({ navigation }) => {
    const { user, logout } = useAuthStore();
    const { friends, loadFriends } = useFriendsStore();

    useEffect(() => {
        loadFriends();
    }, []);

    const winRate = user && user.totalPredictions > 0
        ? Math.round((user.totalWins / user.totalPredictions) * 100)
        : 0;

    const handleSignOut = () => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => logout()
                },
            ]
        );
    };

    const achievements = [
        { emoji: '🔥', label: 'Hot Streak', earned: (user?.streak || 0) >= 5 },
        { emoji: '🎯', label: 'Sharpshooter', earned: winRate >= 60 },
        { emoji: '🏟️', label: 'Stadium Regular', earned: true },
        { emoji: '💎', label: 'Diamond Hands', earned: (user?.coins || 0) >= 5000 },
        { emoji: '🏆', label: 'Top 10', earned: false },
        { emoji: '👑', label: 'Champion', earned: false },
    ];

    const friendsAtStadium = friends.filter(f => f.isAtStadium).length;

    return (
        <View style={styles.container}>
            <LinearGradient colors={gradients.dark} style={styles.gradient}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Profile Hero */}
                        <View style={styles.heroSection}>
                            <LinearGradient
                                colors={gradients.boost}
                                style={styles.heroBg}
                            />

                            {/* Settings button */}
                            <TouchableOpacity
                                style={styles.settingsButton}
                                onPress={() => navigation.navigate('Settings')}
                            >
                                <Text style={styles.settingsIcon}>⚙️</Text>
                            </TouchableOpacity>

                            {/* Avatar */}
                            <View style={styles.avatarContainer}>
                                <LinearGradient
                                    colors={gradients.primary}
                                    style={styles.avatarRing}
                                >
                                    <View style={styles.avatar}>
                                        <Text style={styles.avatarEmoji}>
                                            {user?.displayName?.charAt(0).toUpperCase() || '👤'}
                                        </Text>
                                    </View>
                                </LinearGradient>
                                <View style={styles.levelBadge}>
                                    <Text style={styles.levelText}>LVL 12</Text>
                                </View>
                            </View>

                            <Text style={styles.displayName}>{user?.displayName || 'User'}</Text>
                            <Text style={styles.university}>{user?.universityName || 'Ohio State'}</Text>

                            {/* Coin Balance Hero */}
                            <View style={styles.coinHero}>
                                <CoinBalance amount={user?.coins || 0} size="lg" showLabel />
                            </View>
                        </View>

                        {/* Stats Grid */}
                        <View style={styles.statsGrid}>
                            <View style={styles.statsRow}>
                                <AnimatedStat value={user?.totalPredictions || 0} label="Predictions" />
                                <View style={styles.statDivider} />
                                <AnimatedStat value={user?.totalWins || 0} label="Wins" />
                                <View style={styles.statDivider} />
                                <AnimatedStat value={winRate} label="Win Rate" suffix="%" />
                            </View>
                        </View>

                        {/* Streak Card */}
                        <View style={styles.section}>
                            <View style={styles.streakCard}>
                                <LinearGradient
                                    colors={['rgba(255, 107, 53, 0.15)', 'rgba(255, 107, 53, 0.05)']}
                                    style={styles.streakBg}
                                />
                                <View style={styles.streakContent}>
                                    <Text style={styles.streakEmoji}>🔥</Text>
                                    <View style={styles.streakInfo}>
                                        <Text style={styles.streakValue}>{user?.streak || 0} Day Streak</Text>
                                        <Text style={styles.streakLabel}>Keep it going!</Text>
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Friends Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Friends</Text>
                            <View style={styles.friendsCard}>
                                <View style={styles.friendsStat}>
                                    <Text style={styles.friendsCount}>{friends.length}</Text>
                                    <Text style={styles.friendsLabel}>Total Friends</Text>
                                </View>
                                <View style={styles.friendsDivider} />
                                <View style={styles.friendsStat}>
                                    <Text style={[styles.friendsCount, { color: colors.boostActive }]}>
                                        {friendsAtStadium}
                                    </Text>
                                    <Text style={styles.friendsLabel}>At Stadium</Text>
                                </View>
                            </View>

                            {/* Friend Avatars */}
                            <View style={styles.friendAvatars}>
                                {(friends || []).slice(0, 5).map((friend, index) => (
                                    <View
                                        key={friend.id}
                                        style={[
                                            styles.friendAvatar,
                                            { marginLeft: index > 0 ? -12 : 0, zIndex: 5 - index },
                                            friend.isAtStadium && styles.friendAtStadium,
                                        ]}
                                    >
                                        <Text style={styles.friendAvatarText}>{friend.avatar}</Text>
                                    </View>
                                ))}
                                {friends.length > 5 && (
                                    <View style={[styles.friendAvatar, { marginLeft: -12 }]}>
                                        <Text style={styles.friendAvatarMore}>+{friends.length - 5}</Text>
                                    </View>
                                )}
                            </View>
                        </View>

                        {/* Achievements */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Achievements</Text>
                            <View style={styles.achievementsGrid}>
                                {achievements.map((achievement, index) => (
                                    <View
                                        key={index}
                                        style={[
                                            styles.achievementItem,
                                            !achievement.earned && styles.achievementLocked,
                                        ]}
                                    >
                                        <Text style={styles.achievementEmoji}>{achievement.emoji}</Text>
                                        <Text style={styles.achievementLabel}>{achievement.label}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>

                        {/* Sign Out Button */}
                        <View style={styles.section}>
                            <TouchableOpacity style={styles.signOutButton} onPress={handleSignOut}>
                                <Text style={styles.signOutText}>Sign Out</Text>
                            </TouchableOpacity>
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
    heroSection: {
        alignItems: 'center',
        paddingTop: spacing.xl,
        paddingBottom: spacing.xl,
        position: 'relative',
        overflow: 'hidden',
    },
    heroBg: {
        ...StyleSheet.absoluteFillObject,
        opacity: 0.5,
    },
    settingsButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.lg,
        padding: spacing.sm,
    },
    settingsIcon: {
        fontSize: 24,
    },
    avatarContainer: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatarRing: {
        width: 110,
        height: 110,
        borderRadius: 55,
        padding: 4,
    },
    avatar: {
        flex: 1,
        backgroundColor: colors.bgCard,
        borderRadius: 55,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarEmoji: {
        fontSize: 48,
    },
    levelBadge: {
        position: 'absolute',
        bottom: 0,
        right: -5,
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xxs,
        borderRadius: borderRadius.full,
        ...shadows.glow,
    },
    levelText: {
        ...typography.micro,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    displayName: {
        ...typography.h1,
        color: colors.textPrimary,
        marginBottom: spacing.xxs,
    },
    university: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    coinHero: {
        alignItems: 'center',
    },
    coinIcon: {
        fontSize: 32,
        marginBottom: spacing.xs,
    },
    coinAmount: {
        fontSize: 32,
        fontWeight: '700',
        color: 'white',
        letterSpacing: -1,
    },
    coinLabel: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    statsGrid: {
        paddingHorizontal: spacing.lg,
        marginTop: -spacing.md,
    },
    statsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statValue: {
        ...typography.h2,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    statLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 4,
    },
    statDivider: {
        width: 1,
        height: 30,
        backgroundColor: colors.border,
    },
    section: {
        marginTop: spacing.xl,
        paddingHorizontal: spacing.lg,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    // Streak
    streakCard: {
        borderRadius: borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: colors.gold,
        position: 'relative',
    },
    streakBg: {
        ...StyleSheet.absoluteFillObject,
    },
    streakContent: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        gap: spacing.md,
    },
    streakEmoji: {
        fontSize: 32,
    },
    streakInfo: {
        flex: 1,
    },
    streakValue: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    streakLabel: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    // Friends
    friendsCard: {
        flexDirection: 'row',
        backgroundColor: colors.bgSecondary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
        marginBottom: spacing.md,
    },
    friendsStat: {
        flex: 1,
        alignItems: 'center',
    },
    friendsCount: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    friendsLabel: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    friendsDivider: {
        width: 1,
        backgroundColor: colors.border,
    },
    friendAvatars: {
        flexDirection: 'row',
        marginLeft: 12,
        height: 40,
    },
    friendAvatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.bgElevated,
        borderWidth: 2,
        borderColor: colors.bgPrimary,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadows.sm,
    },
    friendAtStadium: {
        borderColor: colors.gold,
    },
    friendAvatarText: {
        fontSize: 16,
    },
    friendAvatarMore: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    // Achievements
    achievementsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    achievementItem: {
        width: '31%',
        aspectRatio: 1,
        backgroundColor: colors.bgSecondary,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xs,
        borderWidth: 1,
        borderColor: colors.border,
    },
    achievementLocked: {
        opacity: 0.3,
        backgroundColor: colors.bgPrimary,
        borderStyle: 'dashed',
    },
    achievementEmoji: {
        fontSize: 24,
        marginBottom: spacing.xs,
    },
    achievementLabel: {
        ...typography.micro,
        textAlign: 'center',
        color: colors.textSecondary,
    },
    signOutButton: {
        backgroundColor: colors.bgSecondary,
        borderWidth: 1,
        borderColor: colors.error,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        alignItems: 'center',
    },
    signOutText: {
        ...typography.bodyBold,
        color: colors.error,
    },
});
