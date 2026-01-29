// University Selection Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, gradients } from '../../theme';
import { Button } from '../../components/common';
import { useAuthStore } from '../../store/authStore';
import { universities } from '../../data/mockData';
import { University } from '../../types';

interface Props {
    navigation: any;
}

export const UniversitySelectScreen: React.FC<Props> = ({ navigation }) => {
    const [search, setSearch] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const selectUniversity = useAuthStore(state => state.selectUniversity);

    const filteredUniversities = universities.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.shortName.toLowerCase().includes(search.toLowerCase())
    );

    const handleContinue = () => {
        if (selectedId) {
            selectUniversity(selectedId);
            navigation.navigate('EmailVerify');
        }
    };

    const renderUniversity = ({ item }: { item: University }) => (
        <TouchableOpacity
            style={[
                styles.universityCard,
                selectedId === item.id && styles.universityCardSelected,
            ]}
            onPress={() => setSelectedId(item.id)}
            activeOpacity={0.8}
        >
            <View style={[styles.universityLogo, { backgroundColor: item.primaryColor + '30' }]}>
                <Text style={styles.universityInitial}>{item.shortName}</Text>
            </View>
            <View style={styles.universityInfo}>
                <Text style={styles.universityName}>{item.name}</Text>
                <Text style={styles.universityMascot}>{item.mascot}</Text>
            </View>
            {selectedId === item.id && (
                <View style={styles.checkmark}>
                    <Text style={styles.checkmarkText}>✓</Text>
                </View>
            )}
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.bgPrimary, colors.bgSecondary]}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <Text style={styles.emoji}>🏟️</Text>
                    <Text style={styles.title}>Select Your University</Text>
                    <Text style={styles.subtitle}>
                        Join your school's fan community and start making predictions
                    </Text>
                </View>

                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search universities..."
                        placeholderTextColor={colors.textMuted}
                        value={search}
                        onChangeText={setSearch}
                    />
                </View>

                <FlatList
                    data={filteredUniversities}
                    renderItem={renderUniversity}
                    keyExtractor={item => item.id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                />

                <View style={styles.footer}>
                    <Button
                        title="Continue"
                        onPress={handleContinue}
                        disabled={!selectedId}
                        size="lg"
                    />
                </View>
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
        paddingHorizontal: spacing.lg,
    },
    header: {
        alignItems: 'center',
        paddingTop: spacing.xl,
        paddingBottom: spacing.lg,
    },
    emoji: {
        fontSize: 48,
        marginBottom: spacing.md,
    },
    title: {
        ...typography.h1,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.sm,
    },
    subtitle: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        marginBottom: spacing.lg,
    },
    searchIcon: {
        fontSize: 18,
        marginRight: spacing.sm,
    },
    searchInput: {
        flex: 1,
        paddingVertical: spacing.md,
        color: colors.textPrimary,
        ...typography.body,
    },
    list: {
        paddingBottom: spacing.lg,
    },
    universityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderWidth: 2,
        borderColor: 'transparent',
    },
    universityCardSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '10',
    },
    universityLogo: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    universityInitial: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    universityInfo: {
        flex: 1,
    },
    universityName: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: 2,
    },
    universityMascot: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    checkmark: {
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkmarkText: {
        color: colors.textPrimary,
        fontWeight: '700',
        fontSize: 16,
    },
    footer: {
        paddingVertical: spacing.lg,
    },
});
