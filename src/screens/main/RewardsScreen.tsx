// Rewards Screen
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, gradients } from '../../theme';
import { Card, Button, CoinBalance, Badge } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { useRewardsStore } from '../../store/rewardsStore';
import { Reward, RewardCategory } from '../../types';

interface Props {
    navigation: any;
}

const CATEGORIES: { key: RewardCategory | 'all'; label: string; emoji: string }[] = [
    { key: 'all', label: 'All', emoji: '🎁' },
    { key: 'digital', label: 'Digital', emoji: '🎮' },
    { key: 'university', label: 'University', emoji: '🏫' },
    { key: 'sponsor', label: 'Sponsors', emoji: '🎟️' },
];

export const RewardsScreen: React.FC<Props> = ({ navigation }) => {
    const { user, updateCoins } = useAuthStore();
    const { rewards, redemptions, loadRewards, redeemReward } = useRewardsStore();
    const [selectedCategory, setSelectedCategory] = useState<RewardCategory | 'all'>('all');
    const [selectedReward, setSelectedReward] = useState<Reward | null>(null);
    const [showRedeemModal, setShowRedeemModal] = useState(false);

    useEffect(() => {
        loadRewards();
    }, []);

    const filteredRewards = selectedCategory === 'all'
        ? rewards
        : rewards.filter(r => r.category === selectedCategory);

    const handleRedeem = () => {
        if (!selectedReward || !user) return;

        if (selectedReward.coinCost > user.coins) {
            Alert.alert('Insufficient Coins', 'You don\'t have enough coins for this reward');
            return;
        }

        const success = redeemReward(selectedReward, user.coins, updateCoins);

        if (success) {
            setShowRedeemModal(false);
            Alert.alert(
                'Reward Redeemed! 🎉',
                `You've successfully redeemed "${selectedReward.title}". Check your email for details!`
            );
        }
    };

    const getTierLabel = (tier: number) => {
        if (tier === 1) return '⭐';
        if (tier === 2) return '⭐⭐';
        return '⭐⭐⭐';
    };

    const renderRewardCard = (reward: Reward) => {
        const canAfford = (user?.coins || 0) >= reward.coinCost;

        return (
            <TouchableOpacity
                key={reward.id}
                style={[styles.rewardCard, !reward.available && styles.rewardUnavailable]}
                onPress={() => {
                    setSelectedReward(reward);
                    setShowRedeemModal(true);
                }}
                disabled={!reward.available}
            >
                <View style={styles.rewardImage}>
                    <Text style={styles.rewardEmoji}>{reward.imageUrl}</Text>
                </View>
                <View style={styles.rewardInfo}>
                    <View style={styles.rewardHeader}>
                        <Text style={styles.rewardTier}>{getTierLabel(reward.tier)}</Text>
                        {reward.stock !== undefined && (
                            <Text style={styles.rewardStock}>{reward.stock} left</Text>
                        )}
                    </View>
                    <Text style={styles.rewardTitle} numberOfLines={2}>{reward.title}</Text>
                    <View style={styles.rewardCost}>
                        <CoinBalance amount={reward.coinCost} size="sm" />
                        {!canAfford && <Text style={styles.needMore}>Need more</Text>}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={[colors.bgPrimary, colors.bgSecondary]} style={styles.gradient}>
                {/* Header */}
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>Rewards</Text>
                        <Text style={styles.subtitle}>Redeem your coins for prizes</Text>
                    </View>
                    <CoinBalance amount={user?.coins || 0} size="md" showLabel />
                </View>

                {/* Category Tabs */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.categoriesScroll}
                    contentContainerStyle={styles.categories}
                >
                    {CATEGORIES.map(cat => (
                        <TouchableOpacity
                            key={cat.key}
                            style={[
                                styles.categoryTab,
                                selectedCategory === cat.key && styles.categoryTabActive,
                            ]}
                            onPress={() => setSelectedCategory(cat.key)}
                        >
                            <Text style={styles.categoryEmoji}>{cat.emoji}</Text>
                            <Text style={[
                                styles.categoryLabel,
                                selectedCategory === cat.key && styles.categoryLabelActive,
                            ]}>
                                {cat.label}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Rewards Grid */}
                <ScrollView
                    style={styles.rewardsList}
                    contentContainerStyle={styles.rewardsGrid}
                    showsVerticalScrollIndicator={false}
                >
                    {filteredRewards.map(renderRewardCard)}
                </ScrollView>

                {/* Redeem History Link */}
                {redemptions.length > 0 && (
                    <TouchableOpacity style={styles.historyLink}>
                        <Text style={styles.historyText}>
                            📜 View Redemption History ({redemptions.length})
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Redeem Modal */}
                <Modal
                    visible={showRedeemModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowRedeemModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setShowRedeemModal(false)}
                            >
                                <Text style={styles.modalClose}>✕</Text>
                            </TouchableOpacity>

                            {selectedReward && (
                                <>
                                    <View style={styles.modalRewardImage}>
                                        <Text style={styles.modalRewardEmoji}>{selectedReward.imageUrl}</Text>
                                    </View>

                                    <Text style={styles.modalRewardTitle}>{selectedReward.title}</Text>
                                    <Text style={styles.modalRewardDesc}>{selectedReward.description}</Text>

                                    <View style={styles.modalCostRow}>
                                        <Text style={styles.modalCostLabel}>Cost:</Text>
                                        <CoinBalance amount={selectedReward.coinCost} size="lg" />
                                    </View>

                                    <View style={styles.modalBalanceRow}>
                                        <Text style={styles.modalBalanceLabel}>Your Balance:</Text>
                                        <CoinBalance amount={user?.coins || 0} size="md" />
                                    </View>

                                    {(user?.coins || 0) >= selectedReward.coinCost ? (
                                        <View style={styles.modalAfterRow}>
                                            <Text style={styles.modalAfterLabel}>After Redemption:</Text>
                                            <CoinBalance
                                                amount={(user?.coins || 0) - selectedReward.coinCost}
                                                size="md"
                                            />
                                        </View>
                                    ) : (
                                        <View style={styles.modalShortfall}>
                                            <Text style={styles.modalShortfallText}>
                                                You need {selectedReward.coinCost - (user?.coins || 0)} more coins
                                            </Text>
                                        </View>
                                    )}

                                    <Button
                                        title="Redeem Reward"
                                        onPress={handleRedeem}
                                        disabled={(user?.coins || 0) < selectedReward.coinCost}
                                        size="lg"
                                    />
                                </>
                            )}
                        </View>
                    </View>
                </Modal>
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
    categoriesScroll: {
        maxHeight: 60,
        marginBottom: spacing.md,
    },
    categories: {
        paddingHorizontal: spacing.lg,
        gap: spacing.sm,
    },
    categoryTab: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bgCard,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        gap: spacing.xs,
    },
    categoryTabActive: {
        backgroundColor: colors.primary,
    },
    categoryEmoji: {
        fontSize: 16,
    },
    categoryLabel: {
        ...typography.caption,
        color: colors.textSecondary,
        fontWeight: '600',
    },
    categoryLabelActive: {
        color: colors.textPrimary,
    },
    rewardsList: {
        flex: 1,
    },
    rewardsGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        paddingHorizontal: spacing.md,
        gap: spacing.sm,
        paddingBottom: spacing.xxl,
    },
    rewardCard: {
        width: '48%',
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: spacing.sm,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    rewardUnavailable: {
        opacity: 0.5,
    },
    rewardImage: {
        height: 80,
        backgroundColor: colors.bgElevated,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },
    rewardEmoji: {
        fontSize: 40,
    },
    rewardInfo: {
        flex: 1,
    },
    rewardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 4,
    },
    rewardTier: {
        fontSize: 10,
    },
    rewardStock: {
        ...typography.small,
        color: colors.warning,
    },
    rewardTitle: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        fontSize: 14,
        marginBottom: spacing.xs,
    },
    rewardCost: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    needMore: {
        ...typography.small,
        color: colors.error,
    },
    historyLink: {
        padding: spacing.md,
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.cardBorder,
    },
    historyText: {
        ...typography.body,
        color: colors.primary,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    modalContent: {
        backgroundColor: colors.bgSecondary,
        borderRadius: borderRadius.xl,
        padding: spacing.lg,
    },
    modalCloseButton: {
        position: 'absolute',
        top: spacing.md,
        right: spacing.md,
        zIndex: 1,
    },
    modalClose: {
        fontSize: 24,
        color: colors.textMuted,
    },
    modalRewardImage: {
        height: 100,
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.md,
    },
    modalRewardEmoji: {
        fontSize: 56,
    },
    modalRewardTitle: {
        ...typography.h2,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    modalRewardDesc: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },
    modalCostRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.cardBorder,
    },
    modalCostLabel: {
        ...typography.body,
        color: colors.textSecondary,
    },
    modalBalanceRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
    },
    modalBalanceLabel: {
        ...typography.body,
        color: colors.textSecondary,
    },
    modalAfterRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: spacing.sm,
        marginBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.cardBorder,
    },
    modalAfterLabel: {
        ...typography.body,
        color: colors.textSecondary,
    },
    modalShortfall: {
        backgroundColor: colors.error + '20',
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    modalShortfallText: {
        ...typography.body,
        color: colors.error,
        textAlign: 'center',
    },
});
