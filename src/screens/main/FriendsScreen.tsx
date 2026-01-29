// Friends List Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, gradients } from '../../theme';
import { Card, Badge } from '../../components/common';
import { useFriendsStore, Friend } from '../../store/friendsStore';

interface Props {
    navigation: any;
}

export const FriendsScreen: React.FC<Props> = ({ navigation }) => {
    const { friends } = useFriendsStore();
    const [searchQuery, setSearchQuery] = useState('');
    const [filter, setFilter] = useState<'all' | 'atStadium' | 'online'>('all');

    const filteredFriends = friends.filter(friend => {
        const matchesSearch = friend.name.toLowerCase().includes(searchQuery.toLowerCase());
        if (filter === 'atStadium') return matchesSearch && friend.isAtStadium;
        if (filter === 'online') return matchesSearch && friend.isOnline;
        return matchesSearch;
    });

    const friendsAtStadium = friends.filter(f => f.isAtStadium).length;

    const renderFriendCard = (friend: Friend) => (
        <TouchableOpacity
            key={friend.id}
            onPress={() => navigation.navigate('FriendProfile', { friend })}
        >
            <Card style={styles.friendCard}>
                <View style={styles.friendRow}>
                    <View style={styles.avatarContainer}>
                        <Text style={styles.avatar}>{friend.avatar}</Text>
                        {friend.isOnline && <View style={styles.onlineIndicator} />}
                    </View>
                    <View style={styles.friendInfo}>
                        <Text style={styles.friendName}>{friend.name}</Text>
                        <Text style={styles.friendUniversity}>{friend.university}</Text>
                        {friend.lastActivity && (
                            <Text style={styles.lastActivity}>{friend.lastActivity}</Text>
                        )}
                    </View>
                    <View style={styles.friendStats}>
                        {friend.isAtStadium && (
                            <Badge text="🏟️ At Game" variant="boost" />
                        )}
                        <Text style={styles.friendStreak}>🔥 {friend.streak}</Text>
                    </View>
                </View>
            </Card>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={gradients.dark} style={styles.gradient}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    {/* Header */}
                    <View style={styles.header}>
                        <TouchableOpacity
                            style={styles.backButton}
                            onPress={() => navigation.goBack()}
                        >
                            <Text style={styles.backText}>← Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Friends</Text>
                        <Text style={styles.subtitle}>
                            {friends.length} friends • {friendsAtStadium} at stadium
                        </Text>
                    </View>

                    {/* Search */}
                    <View style={styles.searchContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search friends..."
                            placeholderTextColor={colors.textMuted}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Filters */}
                    <View style={styles.filterRow}>
                        <TouchableOpacity
                            style={[styles.filterButton, filter === 'all' && styles.filterActive]}
                            onPress={() => setFilter('all')}
                        >
                            <Text style={[styles.filterText, filter === 'all' && styles.filterTextActive]}>
                                All ({friends.length})
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterButton, filter === 'atStadium' && styles.filterActive]}
                            onPress={() => setFilter('atStadium')}
                        >
                            <Text style={[styles.filterText, filter === 'atStadium' && styles.filterTextActive]}>
                                🏟️ At Stadium ({friendsAtStadium})
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.filterButton, filter === 'online' && styles.filterActive]}
                            onPress={() => setFilter('online')}
                        >
                            <Text style={[styles.filterText, filter === 'online' && styles.filterTextActive]}>
                                Online
                            </Text>
                        </TouchableOpacity>
                    </View>

                    {/* Friends List */}
                    <ScrollView
                        style={styles.list}
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={styles.listContent}
                    >
                        {filteredFriends.map(renderFriendCard)}
                        {filteredFriends.length === 0 && (
                            <View style={styles.emptyState}>
                                <Text style={styles.emptyEmoji}>👥</Text>
                                <Text style={styles.emptyText}>No friends found</Text>
                            </View>
                        )}
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
        paddingBottom: spacing.md,
    },
    backButton: {
        paddingVertical: spacing.sm,
    },
    backText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    title: {
        ...typography.h1,
        color: colors.textPrimary,
    },
    subtitle: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    searchContainer: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
    },
    searchInput: {
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        color: colors.textPrimary,
        ...typography.body,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    filterRow: {
        flexDirection: 'row',
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.md,
        gap: spacing.sm,
    },
    filterButton: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.bgCard,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    filterActive: {
        backgroundColor: colors.primary + '20',
        borderColor: colors.primary,
    },
    filterText: {
        ...typography.small,
        color: colors.textMuted,
    },
    filterTextActive: {
        color: colors.primary,
        fontWeight: '600',
    },
    list: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    listContent: {
        paddingBottom: spacing.xxl,
    },
    friendCard: {
        marginBottom: spacing.sm,
    },
    friendRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'relative',
    },
    avatar: {
        fontSize: 36,
    },
    onlineIndicator: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 12,
        height: 12,
        borderRadius: 6,
        backgroundColor: colors.success,
        borderWidth: 2,
        borderColor: colors.bgCard,
    },
    friendInfo: {
        flex: 1,
        marginLeft: spacing.md,
    },
    friendName: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    friendUniversity: {
        ...typography.small,
        color: colors.textSecondary,
    },
    lastActivity: {
        ...typography.micro,
        color: colors.textMuted,
        marginTop: 2,
    },
    friendStats: {
        alignItems: 'flex-end',
        gap: spacing.xs,
    },
    friendStreak: {
        ...typography.small,
        color: colors.boostActive,
    },
    emptyState: {
        alignItems: 'center',
        paddingVertical: spacing.xxl,
    },
    emptyEmoji: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    emptyText: {
        ...typography.body,
        color: colors.textMuted,
    },
});
