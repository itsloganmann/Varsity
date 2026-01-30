// Redemption History Screen
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, gradients } from '../../theme';
import { Card, CoinBalance, Badge, Button } from '../../components/common';
import { useRewardsStore } from '../../store/rewardsStore';

interface Props {
    navigation: any;
}

export const RedemptionHistoryScreen: React.FC<Props> = ({ navigation }) => {
    const { redemptions, rewards } = useRewardsStore();

    const renderRedemption = (redemption: any) => {
        const reward = rewards.find(r => r.id === redemption.rewardId);
        const title = reward ? reward.title : 'Unknown Reward';
        const cost = reward ? reward.coinCost : 0;
        const date = new Date(redemption.redeemedAt).toLocaleDateString();
        const time = new Date(redemption.redeemedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        return (
            <Card key={redemption.id} style={styles.card}>
                <View style={styles.header}>
                    <View>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.date}>{date} at {time}</Text>
                    </View>
                    <Badge text="Completed" variant="success" />
                </View>

                <View style={styles.details}>
                    <View style={styles.codeContainer}>
                        <Text style={styles.codeLabel}>Redemption Code:</Text>
                        <Text style={styles.codeValue}>{redemption.code}</Text>
                    </View>
                    <CoinBalance amount={cost} size="md" />
                </View>

                <View style={styles.actions}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => Alert.alert('Refund Request', 'Refunds must be approved by an admin. Your request has been sent.')}
                    >
                        <Text style={styles.actionText}>Request Refund</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() => Alert.alert('Help', 'Contact support at support@varsity.com')}
                    >
                        <Text style={styles.actionText}>Get Help</Text>
                    </TouchableOpacity>
                </View>
            </Card>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={[colors.bgPrimary, colors.bgSecondary]} style={styles.gradient}>
                <View style={styles.topHeader}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.screenTitle}>Redemption History</Text>
                    <View style={{ width: 40 }} />
                </View>

                <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
                    {redemptions.length > 0 ? (
                        redemptions.map(renderRedemption)
                    ) : (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyEmoji}>📜</Text>
                            <Text style={styles.emptyText}>No history yet</Text>
                            <Text style={styles.emptySubtext}>Redeem rewards to see them here</Text>
                        </View>
                    )}
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
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.cardBorder,
    },
    backButton: {
        padding: spacing.xs,
    },
    backText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    screenTitle: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    content: {
        flex: 1,
    },
    scrollContent: {
        padding: spacing.lg,
        gap: spacing.md,
    },
    card: {
        marginBottom: spacing.sm,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: spacing.md,
    },
    title: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        fontSize: 16,
        marginBottom: 4,
    },
    date: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    details: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: colors.bgPrimary,
        padding: spacing.md,
        borderRadius: borderRadius.md,
        marginBottom: spacing.md,
    },
    codeContainer: {
        gap: 2,
    },
    codeLabel: {
        ...typography.micro,
        color: colors.textSecondary,
    },
    codeValue: {
        ...typography.bodyBold,
        color: colors.primary,
        fontFamily: 'System', // Monospace if possible
        letterSpacing: 1,
    },
    actions: {
        flexDirection: 'row',
        gap: spacing.md,
        justifyContent: 'flex-end',
    },
    actionButton: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
    },
    actionText: {
        ...typography.caption,
        color: colors.textSecondary,
        textDecorationLine: 'underline',
    },
    emptyState: {
        alignItems: 'center',
        marginTop: spacing.xxl,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    emptyText: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    emptySubtext: {
        ...typography.body,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
});
