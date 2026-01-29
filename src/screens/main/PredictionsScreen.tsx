// Predictions Screen
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    TextInput,
    Modal,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, gradients } from '../../theme';
import { Card, Button, CoinBalance, Badge } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { usePredictionStore } from '../../store/predictionStore';
import { useLocationStore } from '../../store/locationStore';
import { PredictionMarket, PredictionOption, Prediction } from '../../types';

interface Props {
    navigation: any;
    route: any;
}

export const PredictionsScreen: React.FC<Props> = ({ navigation, route }) => {
    const { user, updateCoins, incrementPredictions } = useAuthStore();
    const { markets, games, placePrediction, userPredictions, loadMarkets } = usePredictionStore();
    const { isAtStadium, boostMultiplier } = useLocationStore();

    const [selectedTab, setSelectedTab] = useState<'open' | 'my'>('open');
    const [showBetModal, setShowBetModal] = useState(false);
    const [selectedMarket, setSelectedMarket] = useState<PredictionMarket | null>(null);
    const [selectedOption, setSelectedOption] = useState<PredictionOption | null>(null);
    const [wagerAmount, setWagerAmount] = useState('');

    useEffect(() => {
        loadMarkets();
    }, []);

    const openMarkets = markets.filter(m => m.status === 'open');

    const calculatePotentialWin = () => {
        if (!selectedOption || !wagerAmount) return 0;
        const amount = parseInt(wagerAmount) || 0;
        const odds = selectedOption.odds;
        let win: number;
        if (odds > 0) {
            win = (amount * odds) / 100;
        } else {
            win = (amount * 100) / Math.abs(odds);
        }
        return Math.round(win * (isAtStadium ? boostMultiplier : 1));
    };

    const handleSelectOption = (market: PredictionMarket, option: PredictionOption) => {
        setSelectedMarket(market);
        setSelectedOption(option);
        setWagerAmount('');
        setShowBetModal(true);
    };

    const handlePlaceBet = () => {
        if (!selectedMarket || !selectedOption || !user) return;

        const amount = parseInt(wagerAmount) || 0;
        if (amount <= 0) {
            Alert.alert('Invalid Amount', 'Please enter a valid wager amount');
            return;
        }
        if (amount > user.coins) {
            Alert.alert('Insufficient Coins', 'You don\'t have enough coins for this wager');
            return;
        }

        const success = placePrediction(
            selectedMarket,
            selectedOption,
            amount,
            isAtStadium,
            isAtStadium ? boostMultiplier : 1,
            user.coins,
            updateCoins
        );

        if (success) {
            incrementPredictions();
            setShowBetModal(false);
            Alert.alert('Prediction Placed! 🎯', `You wagered ${amount} coins on ${selectedOption.label}`);
        }
    };

    const renderMarketCard = (market: PredictionMarket) => {
        const game = games.find(g => g.id === market.gameId);
        const effectiveBoost = isAtStadium && !market.isStadiumExclusive
            ? boostMultiplier
            : market.isStadiumExclusive && isAtStadium
                ? market.boostMultiplier
                : 1;

        const isLocked = market.isStadiumExclusive && !isAtStadium;

        return (
            <Card key={market.id} style={isLocked ? [styles.marketCard, styles.lockedCard] : styles.marketCard}>
                <View style={styles.marketHeader}>
                    {market.type === 'flash_prop' && <Badge text="⚡ FLASH" variant="warning" />}
                    {market.isStadiumExclusive && <Badge text="🏟️ Stadium Only" variant="boost" />}
                    {effectiveBoost > 1 && <Badge text={`${effectiveBoost}x Boost`} variant="success" />}
                </View>

                {game && (
                    <Text style={styles.gameInfo}>
                        {game.awayTeam.shortName} @ {game.homeTeam.shortName}
                    </Text>
                )}
                <Text style={styles.marketTitle}>{market.title}</Text>
                {market.description && (
                    <Text style={styles.marketDescription}>{market.description}</Text>
                )}

                <View style={styles.optionsContainer}>
                    {market.options.map(option => (
                        <TouchableOpacity
                            key={option.id}
                            style={[styles.optionButton, isLocked && styles.optionLocked]}
                            onPress={() => !isLocked && handleSelectOption(market, option)}
                            disabled={isLocked}
                        >
                            <Text style={styles.optionLabel}>{option.label}</Text>
                            <Text style={[
                                styles.optionOdds,
                                option.odds > 0 ? styles.oddsPositive : styles.oddsNegative
                            ]}>
                                {option.odds > 0 ? '+' : ''}{option.odds}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>

                {isLocked && (
                    <Text style={styles.lockedText}>
                        🔒 Go to the stadium to unlock this prediction
                    </Text>
                )}
            </Card>
        );
    };

    const renderPredictionCard = (prediction: Prediction) => (
        <Card key={prediction.id} style={styles.predictionCard}>
            <View style={styles.predictionHeader}>
                <Badge
                    text={prediction.status.toUpperCase()}
                    variant={prediction.status === 'pending' ? 'info' : prediction.status === 'won' ? 'success' : 'error'}
                />
                {prediction.boosted && <Badge text={`${prediction.boostMultiplier}x`} variant="warning" />}
            </View>
            <Text style={styles.predictionMarket}>{prediction.market.title}</Text>
            <Text style={styles.predictionPick}>Your pick: {prediction.selectedOption.label}</Text>
            <View style={styles.predictionStats}>
                <Text style={styles.predictionWager}>🪙 {prediction.coinsWagered} wagered</Text>
                <Text style={styles.predictionPotential}>
                    → 🪙 {prediction.potentialWin + prediction.coinsWagered} to win
                </Text>
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={[colors.bgPrimary, colors.bgSecondary]} style={styles.gradient}>
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.title}>Predictions</Text>
                    <CoinBalance amount={user?.coins || 0} size="md" />
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'open' && styles.tabActive]}
                        onPress={() => setSelectedTab('open')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'open' && styles.tabTextActive]}>
                            Open Markets
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'my' && styles.tabActive]}
                        onPress={() => setSelectedTab('my')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'my' && styles.tabTextActive]}>
                            My Predictions ({userPredictions.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {selectedTab === 'open' ? (
                        openMarkets.length > 0 ? (
                            openMarkets.map(renderMarketCard)
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>🎯</Text>
                                <Text style={styles.emptyText}>No open markets right now</Text>
                                <Text style={styles.emptySubtext}>Check back when games are live!</Text>
                            </View>
                        )
                    ) : (
                        userPredictions.length > 0 ? (
                            userPredictions.map(renderPredictionCard)
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>📊</Text>
                                <Text style={styles.emptyText}>No predictions yet</Text>
                                <Text style={styles.emptySubtext}>Place your first prediction to get started!</Text>
                            </View>
                        )
                    )}
                </ScrollView>

                {/* Bet Slip Modal */}
                <Modal
                    visible={showBetModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowBetModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Place Prediction</Text>
                                <TouchableOpacity onPress={() => setShowBetModal(false)}>
                                    <Text style={styles.modalClose}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {selectedMarket && selectedOption && (
                                <>
                                    <Card style={styles.selectionCard}>
                                        <Text style={styles.selectionMarket}>{selectedMarket.title}</Text>
                                        <Text style={styles.selectionPick}>{selectedOption.label}</Text>
                                        <Text style={[
                                            styles.selectionOdds,
                                            selectedOption.odds > 0 ? styles.oddsPositive : styles.oddsNegative
                                        ]}>
                                            {selectedOption.odds > 0 ? '+' : ''}{selectedOption.odds}
                                        </Text>
                                    </Card>

                                    {isAtStadium && (
                                        <View style={styles.boostNotice}>
                                            <Text style={styles.boostNoticeText}>
                                                🔥 Stadium Boost: {boostMultiplier}x multiplier active!
                                            </Text>
                                        </View>
                                    )}

                                    <Text style={styles.inputLabel}>Wager Amount</Text>
                                    <View style={styles.wagerInputContainer}>
                                        <Text style={styles.wagerIcon}>🪙</Text>
                                        <TextInput
                                            style={styles.wagerInput}
                                            value={wagerAmount}
                                            onChangeText={setWagerAmount}
                                            keyboardType="number-pad"
                                            placeholder="Enter amount"
                                            placeholderTextColor={colors.textMuted}
                                        />
                                    </View>

                                    <View style={styles.quickAmounts}>
                                        {[50, 100, 250, 500].map(amount => (
                                            <TouchableOpacity
                                                key={amount}
                                                style={styles.quickAmount}
                                                onPress={() => setWagerAmount(amount.toString())}
                                            >
                                                <Text style={styles.quickAmountText}>{amount}</Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>

                                    <View style={styles.potentialWin}>
                                        <Text style={styles.potentialLabel}>Potential Win:</Text>
                                        <CoinBalance amount={calculatePotentialWin() + (parseInt(wagerAmount) || 0)} size="lg" />
                                    </View>

                                    <Button
                                        title="Confirm Prediction"
                                        onPress={handlePlaceBet}
                                        disabled={!wagerAmount || parseInt(wagerAmount) <= 0}
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
    tabs: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderBottomWidth: 2,
        borderBottomColor: 'transparent',
    },
    tabActive: {
        borderBottomColor: colors.primary,
    },
    tabText: {
        ...typography.body,
        color: colors.textMuted,
    },
    tabTextActive: {
        color: colors.primary,
        fontWeight: '600',
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    marketCard: {
        marginBottom: spacing.md,
    },
    lockedCard: {
        opacity: 0.7,
    },
    marketHeader: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.sm,
        flexWrap: 'wrap',
    },
    gameInfo: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    marketTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    marketDescription: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    optionsContainer: {
        flexDirection: 'row',
        gap: spacing.sm,
    },
    optionButton: {
        flex: 1,
        backgroundColor: colors.bgElevated,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    optionLocked: {
        opacity: 0.5,
    },
    optionLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    optionOdds: {
        ...typography.odds,
    },
    oddsPositive: {
        color: colors.success,
    },
    oddsNegative: {
        color: colors.secondary,
    },
    lockedText: {
        ...typography.caption,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: spacing.sm,
    },
    predictionCard: {
        marginBottom: spacing.md,
    },
    predictionHeader: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.sm,
    },
    predictionMarket: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    predictionPick: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    predictionStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    predictionWager: {
        ...typography.caption,
        color: colors.textMuted,
    },
    predictionPotential: {
        ...typography.caption,
        color: colors.success,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.xxl,
    },
    emptyEmoji: {
        fontSize: 56,
        marginBottom: spacing.md,
    },
    emptyText: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    emptySubtext: {
        ...typography.body,
        color: colors.textMuted,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: colors.bgSecondary,
        borderTopLeftRadius: borderRadius.xl,
        borderTopRightRadius: borderRadius.xl,
        padding: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    modalTitle: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    modalClose: {
        fontSize: 24,
        color: colors.textMuted,
    },
    selectionCard: {
        marginBottom: spacing.md,
    },
    selectionMarket: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    selectionPick: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    selectionOdds: {
        ...typography.odds,
    },
    boostNotice: {
        backgroundColor: colors.boostActive + '20',
        padding: spacing.sm,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    boostNoticeText: {
        ...typography.bodyBold,
        color: colors.boostActive,
        textAlign: 'center',
    },
    inputLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    wagerInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.sm,
    },
    wagerIcon: {
        fontSize: 20,
        marginRight: spacing.sm,
    },
    wagerInput: {
        flex: 1,
        paddingVertical: spacing.md,
        color: colors.textPrimary,
        ...typography.h3,
    },
    quickAmounts: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.lg,
    },
    quickAmount: {
        flex: 1,
        backgroundColor: colors.bgCard,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        alignItems: 'center',
    },
    quickAmountText: {
        ...typography.bodyBold,
        color: colors.primary,
    },
    potentialWin: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
        paddingVertical: spacing.sm,
    },
    potentialLabel: {
        ...typography.body,
        color: colors.textSecondary,
    },
});
