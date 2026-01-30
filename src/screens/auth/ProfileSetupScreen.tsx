// Profile Setup Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { Button } from '../../components/common';
import { useAuthStore } from '../../store/authStore';

interface Props {
    navigation: any;
}

const AVATARS = ['🏈', '🏀', '⚾', '⚽', '🏒', '🎯', '🏆', '🔥'];

export const ProfileSetupScreen: React.FC<Props> = ({ navigation }) => {
    const { user, setUser } = useAuthStore();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [selectedAvatar, setSelectedAvatar] = useState('🏈');

    const handleComplete = () => {
        if (user && displayName.trim()) {
            setUser({
                ...user,
                displayName: displayName.trim(),
                avatarUrl: selectedAvatar,
            });
            navigation.navigate('Onboarding');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.bgPrimary, colors.bgSecondary]}
                style={styles.gradient}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={styles.header}>
                        <Text style={styles.emoji}>👤</Text>
                        <Text style={styles.title}>Create Your Profile</Text>
                        <Text style={styles.subtitle}>
                            Set up your display name and choose an avatar
                        </Text>
                    </View>

                    {/* Avatar Selection */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Choose Your Avatar</Text>
                        <View style={styles.avatarGrid}>
                            {AVATARS.map((avatar) => (
                                <TouchableOpacity
                                    key={avatar}
                                    style={[
                                        styles.avatarOption,
                                        selectedAvatar === avatar && styles.avatarOptionSelected,
                                    ]}
                                    onPress={() => setSelectedAvatar(avatar)}
                                >
                                    <Text style={styles.avatarEmoji}>{avatar}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>

                    {/* Display Name */}
                    <View style={styles.section}>
                        <Text style={styles.sectionLabel}>Display Name</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="Enter your display name"
                            placeholderTextColor={colors.textMuted}
                            value={displayName}
                            onChangeText={setDisplayName}
                            maxLength={20}
                        />
                        <Text style={styles.hint}>
                            This is how other fans will see you on leaderboards
                        </Text>
                    </View>

                    {/* Preview */}
                    <View style={styles.previewCard}>
                        <Text style={styles.previewLabel}>Preview</Text>
                        <View style={styles.previewContent}>
                            <View style={styles.previewAvatar}>
                                <Text style={styles.previewAvatarEmoji}>{selectedAvatar}</Text>
                            </View>
                            <View style={styles.previewInfo}>
                                <Text style={styles.previewName}>
                                    {displayName || 'Your Name'}
                                </Text>
                                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                                    <Image
                                        source={require('../../../assets/silver-coin.png')}
                                        style={{ width: 14, height: 14, marginRight: 4 }}
                                        resizeMode="contain"
                                    />
                                    <Text style={styles.previewStats}>
                                        1,000 coins • 0 predictions
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.footer}>
                        <Button
                            title="Complete Setup"
                            onPress={handleComplete}
                            disabled={!displayName.trim()}
                            size="lg"
                        />
                    </View>
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
    content: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xxl,
    },
    header: {
        alignItems: 'center',
        paddingTop: spacing.xl,
        paddingBottom: spacing.lg,
    },
    emoji: {
        fontSize: 56,
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
    section: {
        marginBottom: spacing.xl,
    },
    sectionLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    avatarOption: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.lg,
        backgroundColor: colors.bgCard,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    avatarOptionSelected: {
        borderColor: colors.primary,
        backgroundColor: colors.primary + '20',
    },
    avatarEmoji: {
        fontSize: 28,
    },
    input: {
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        color: colors.textPrimary,
        ...typography.body,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    hint: {
        ...typography.caption,
        color: colors.textMuted,
        marginTop: spacing.sm,
    },
    previewCard: {
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.xl,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    previewLabel: {
        ...typography.caption,
        color: colors.textMuted,
        marginBottom: spacing.sm,
    },
    previewContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    previewAvatar: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: colors.bgElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },
    previewAvatarEmoji: {
        fontSize: 28,
    },
    previewInfo: {
        flex: 1,
    },
    previewName: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: 4,
    },
    previewStats: {
        ...typography.caption,
        color: colors.textSecondary,
    },
    footer: {
        marginTop: spacing.lg,
    },
});
