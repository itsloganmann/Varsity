// Tickets Screen
import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    SafeAreaView,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    Platform,
    KeyboardAvoidingView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { Card, Button, CoinBalance, Badge } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { useTicketsStore } from '../../store/ticketsStore';
import { usePredictionStore } from '../../store/predictionStore';
import { Ticket } from '../../types';

interface Props {
    navigation: any;
}

export const TicketsScreen: React.FC<Props> = ({ navigation }) => {
    const { user, updateCoins } = useAuthStore();
    const { availableTickets, myListings, myPurchases, loadTickets, listTicket, purchaseTicket } = useTicketsStore();
    const { games } = usePredictionStore();

    const [selectedTab, setSelectedTab] = useState<'browse' | 'mytickets'>('browse');
    const [showListModal, setShowListModal] = useState(false);
    const [showBuyModal, setShowBuyModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

    // List ticket form
    const [listForm, setListForm] = useState({
        gameId: '',
        section: '',
        row: '',
        seat: '',
        price: '',
    });

    useEffect(() => {
        loadTickets();
    }, []);

    const upcomingGames = games.filter(g => g.status === 'upcoming');

    const handleListTicket = () => {
        if (!listForm.gameId || !listForm.section || !listForm.row || !listForm.seat || !listForm.price) {
            Alert.alert('Missing Information', 'Please fill in all fields');
            return;
        }

        listTicket(
            listForm.gameId,
            listForm.section,
            listForm.row,
            listForm.seat,
            parseInt(listForm.price)
        );

        setShowListModal(false);
        setListForm({ gameId: '', section: '', row: '', seat: '', price: '' });
        Alert.alert('Ticket Listed! 🎟️', 'Your ticket is now available for other students');
    };

    const handleBuyTicket = () => {
        if (!selectedTicket || !user) return;

        if (selectedTicket.price > user.coins) {
            Alert.alert('Insufficient Coins', 'You don\'t have enough coins for this ticket');
            return;
        }

        const success = purchaseTicket(selectedTicket.id, user.coins, updateCoins);

        if (success) {
            setShowBuyModal(false);
            Alert.alert('Ticket Purchased! 🎉', 'The ticket has been transferred to you');
        }
    };

    const formatGameTime = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    };

    const renderTicketCard = (ticket: Ticket) => (
        <Card
            key={ticket.id}
            style={styles.ticketCard}
            onPress={() => {
                setSelectedTicket(ticket);
                setShowBuyModal(true);
            }}
        >
            <View style={styles.ticketHeader}>
                <Badge
                    text={ticket.game.sport === 'football' ? '🏈 Football' : '🏀 Basketball'}
                    variant="info"
                />
                <Text style={styles.ticketTime}>{formatGameTime(ticket.game.startTime)}</Text>
            </View>

            <Text style={styles.ticketMatchup}>
                {ticket.game.awayTeam.shortName} @ {ticket.game.homeTeam.shortName}
            </Text>

            <View style={styles.ticketDetails}>
                <View style={styles.ticketLocation}>
                    <Text style={styles.ticketLabel}>Section</Text>
                    <Text style={styles.ticketValue}>{ticket.section}</Text>
                </View>
                <View style={styles.ticketLocation}>
                    <Text style={styles.ticketLabel}>Row</Text>
                    <Text style={styles.ticketValue}>{ticket.row}</Text>
                </View>
                <View style={styles.ticketLocation}>
                    <Text style={styles.ticketLabel}>Seat</Text>
                    <Text style={styles.ticketValue}>{ticket.seat}</Text>
                </View>
            </View>

            <View style={styles.ticketFooter}>
                <Text style={styles.sellerName}>From: {ticket.sellerName}</Text>
                <CoinBalance amount={ticket.price} size="md" />
            </View>
        </Card>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient colors={[colors.bgPrimary, colors.bgSecondary]} style={styles.gradient}>
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.title}>Tickets</Text>
                        <Text style={styles.subtitle}>Buy & sell with students</Text>
                    </View>
                    <Button
                        title="+ List"
                        onPress={() => setShowListModal(true)}
                        variant="outline"
                        size="sm"
                    />
                </View>

                {/* Tabs */}
                <View style={styles.tabs}>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'browse' && styles.tabActive]}
                        onPress={() => setSelectedTab('browse')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'browse' && styles.tabTextActive]}>
                            Browse ({availableTickets.length})
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, selectedTab === 'mytickets' && styles.tabActive]}
                        onPress={() => setSelectedTab('mytickets')}
                    >
                        <Text style={[styles.tabText, selectedTab === 'mytickets' && styles.tabTextActive]}>
                            My Tickets ({myListings.length + myPurchases.length})
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Content */}
                <ScrollView
                    style={styles.content}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContent}
                >
                    {selectedTab === 'browse' ? (
                        availableTickets.length > 0 ? (
                            availableTickets.map(renderTicketCard)
                        ) : (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>🎟️</Text>
                                <Text style={styles.emptyText}>No tickets available</Text>
                                <Text style={styles.emptySubtext}>Be the first to list a ticket!</Text>
                            </View>
                        )
                    ) : (
                        <>
                            {myListings.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>My Listings</Text>
                                    {myListings.map(ticket => (
                                        <Card key={ticket.id} style={styles.myTicketCard}>
                                            <Text style={styles.myTicketMatchup}>
                                                {ticket.game.awayTeam.shortName} @ {ticket.game.homeTeam.shortName}
                                            </Text>
                                            <Text style={styles.myTicketDetails}>
                                                Section {ticket.section}, Row {ticket.row}, Seat {ticket.seat}
                                            </Text>
                                            <View style={styles.myTicketFooter}>
                                                <Badge text="Listed" variant="warning" />
                                                <CoinBalance amount={ticket.price} size="sm" />
                                            </View>
                                        </Card>
                                    ))}
                                </View>
                            )}

                            {myPurchases.length > 0 && (
                                <View style={styles.section}>
                                    <Text style={styles.sectionTitle}>Purchased Tickets</Text>
                                    {myPurchases.map(ticket => (
                                        <Card key={ticket.id} style={styles.myTicketCard}>
                                            <Text style={styles.myTicketMatchup}>
                                                {ticket.game.awayTeam.shortName} @ {ticket.game.homeTeam.shortName}
                                            </Text>
                                            <Text style={styles.myTicketDetails}>
                                                Section {ticket.section}, Row {ticket.row}, Seat {ticket.seat}
                                            </Text>
                                            <Badge text="Purchased ✓" variant="success" />
                                        </Card>
                                    ))}
                                </View>
                            )}

                            {myListings.length === 0 && myPurchases.length === 0 && (
                                <View style={styles.emptyState}>
                                    <Text style={styles.emptyEmoji}>📭</Text>
                                    <Text style={styles.emptyText}>No tickets yet</Text>
                                    <Text style={styles.emptySubtext}>List or buy tickets to see them here</Text>
                                </View>
                            )}
                        </>
                    )}
                </ScrollView>

                {/* List Ticket Modal */}
                <Modal
                    visible={showListModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowListModal(false)}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        style={styles.modalOverlay}
                    >
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>List a Ticket</Text>
                                <TouchableOpacity onPress={() => setShowListModal(false)}>
                                    <Text style={styles.modalClose}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            <Text style={styles.inputLabel}>Select Game</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.gamesScroll}>
                                {upcomingGames.map(game => (
                                    <TouchableOpacity
                                        key={game.id}
                                        style={[
                                            styles.gameOption,
                                            listForm.gameId === game.id && styles.gameOptionSelected,
                                        ]}
                                        onPress={() => setListForm(f => ({ ...f, gameId: game.id }))}
                                    >
                                        <Text style={styles.gameOptionText}>
                                            {game.awayTeam.shortName} @ {game.homeTeam.shortName}
                                        </Text>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>

                            <View style={styles.inputRow}>
                                <View style={styles.inputHalf}>
                                    <Text style={styles.inputLabel}>Section</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={listForm.section}
                                        onChangeText={v => setListForm(f => ({ ...f, section: v }))}
                                        placeholder="e.g. Block O"
                                        placeholderTextColor={colors.textMuted}
                                    />
                                </View>
                                <View style={styles.inputHalf}>
                                    <Text style={styles.inputLabel}>Row</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={listForm.row}
                                        onChangeText={v => setListForm(f => ({ ...f, row: v }))}
                                        placeholder="e.g. A"
                                        placeholderTextColor={colors.textMuted}
                                    />
                                </View>
                            </View>

                            <View style={styles.inputRow}>
                                <View style={styles.inputHalf}>
                                    <Text style={styles.inputLabel}>Seat</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={listForm.seat}
                                        onChangeText={v => setListForm(f => ({ ...f, seat: v }))}
                                        placeholder="e.g. 15"
                                        placeholderTextColor={colors.textMuted}
                                    />
                                </View>
                                <View style={styles.inputHalf}>
                                    <Text style={styles.inputLabel}>Price (coins)</Text>
                                    <TextInput
                                        style={styles.input}
                                        value={listForm.price}
                                        onChangeText={v => setListForm(f => ({ ...f, price: v.replace(/[^0-9]/g, '') }))}
                                        placeholder="e.g. 500"
                                        placeholderTextColor={colors.textMuted}
                                        keyboardType="number-pad"
                                    />
                                </View>
                            </View>

                            <Button
                                title="List Ticket"
                                onPress={handleListTicket}
                                size="lg"
                            />
                        </View>
                    </KeyboardAvoidingView>
                </Modal>

                {/* Buy Ticket Modal */}
                <Modal
                    visible={showBuyModal}
                    transparent
                    animationType="slide"
                    onRequestClose={() => setShowBuyModal(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>Confirm Purchase</Text>
                                <TouchableOpacity onPress={() => setShowBuyModal(false)}>
                                    <Text style={styles.modalClose}>✕</Text>
                                </TouchableOpacity>
                            </View>

                            {selectedTicket && (
                                <>
                                    <Card style={styles.confirmCard}>
                                        <Text style={styles.confirmMatchup}>
                                            {selectedTicket.game.awayTeam.shortName} @ {selectedTicket.game.homeTeam.shortName}
                                        </Text>
                                        <Text style={styles.confirmTime}>
                                            {formatGameTime(selectedTicket.game.startTime)}
                                        </Text>
                                        <View style={styles.confirmDetails}>
                                            <Text style={styles.confirmDetail}>
                                                Section: {selectedTicket.section}
                                            </Text>
                                            <Text style={styles.confirmDetail}>
                                                Row: {selectedTicket.row}, Seat: {selectedTicket.seat}
                                            </Text>
                                        </View>
                                    </Card>

                                    <View style={styles.costRow}>
                                        <Text style={styles.costLabel}>Ticket Price:</Text>
                                        <CoinBalance amount={selectedTicket.price} size="lg" />
                                    </View>

                                    <View style={styles.costRow}>
                                        <Text style={styles.costLabel}>Your Balance:</Text>
                                        <CoinBalance amount={user?.coins || 0} size="md" />
                                    </View>

                                    <Button
                                        title="Buy Ticket"
                                        onPress={handleBuyTicket}
                                        disabled={(user?.coins || 0) < selectedTicket.price}
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
        ...typography.h2,
        color: colors.textPrimary,
    },
    headerLeft: {
        flex: 1,
        marginRight: spacing.sm,
    },
    subtitle: {
        ...typography.caption,
        color: colors.textSecondary,
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
    ticketCard: {
        marginBottom: spacing.md,
    },
    ticketHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },
    ticketTime: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    ticketMatchup: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    ticketDetails: {
        flexDirection: 'row',
        gap: spacing.lg,
        marginBottom: spacing.md,
    },
    ticketLocation: {
        alignItems: 'center',
    },
    ticketLabel: {
        ...typography.caption,
        color: colors.textMuted,
    },
    ticketValue: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    ticketFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.cardBorder,
    },
    sellerName: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    section: {
        marginBottom: spacing.lg,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    myTicketCard: {
        marginBottom: spacing.sm,
    },
    myTicketMatchup: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    myTicketDetails: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    myTicketFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
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
    inputLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    gamesScroll: {
        marginBottom: spacing.md,
    },
    gameOption: {
        backgroundColor: colors.bgCard,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.md,
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    gameOptionSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '20',
    },
    gameOptionText: {
        ...typography.caption,
        color: colors.textPrimary,
    },
    inputRow: {
        flexDirection: 'row',
        gap: spacing.sm,
        marginBottom: spacing.md,
    },
    inputHalf: {
        flex: 1,
    },
    input: {
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        ...typography.body,
    },
    confirmCard: {
        marginBottom: spacing.lg,
    },
    confirmMatchup: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    confirmTime: {
        ...typography.caption,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },
    confirmDetails: {
        paddingTop: spacing.sm,
        borderTopWidth: 1,
        borderTopColor: colors.cardBorder,
    },
    confirmDetail: {
        ...typography.body,
        color: colors.textSecondary,
    },
    costRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    costLabel: {
        ...typography.body,
        color: colors.textSecondary,
    },
});
