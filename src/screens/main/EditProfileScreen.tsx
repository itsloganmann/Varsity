// Edit Profile Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, typography, gradients } from '../../theme';
import { Button, Card } from '../../components/common';
import { useAuthStore } from '../../store/authStore';

interface Props {
    navigation: any;
}

const AVATAR_OPTIONS = ['🎓', '🏈', '🏀', '⚽', '🎯', '🔥', '⭐', '🌟', '💪', '🏆', '👤', '😎'];

export const EditProfileScreen: React.FC<Props> = ({ navigation }) => {
    const { user, login } = useAuthStore();
    const [displayName, setDisplayName] = useState(user?.displayName || '');
    const [selectedAvatar, setSelectedAvatar] = useState(user?.avatarUrl || '🎓');
    const [customImage, setCustomImage] = useState<string | null>(null);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (status !== 'granted') {
            Alert.alert('Permission needed', 'Please grant camera roll permissions to upload a photo.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 0.5,
        });

        if (!result.canceled && result.assets[0]) {
            setCustomImage(result.assets[0].uri);
            setSelectedAvatar('custom');
        }
    };

    const handleSave = async () => {
        if (!displayName.trim()) {
            Alert.alert('Error', 'Please enter a display name');
            return;
        }

        // In a real app, this would update the user via API
        // For demo, we'll just show success
        Alert.alert('Profile Updated! ✓', 'Your changes have been saved.', [
            { text: 'OK', onPress: () => navigation.goBack() }
        ]);
    };

    return (
        <View style={styles.container}>
            <LinearGradient colors={gradients.dark} style={styles.gradient}>
                <SafeAreaView edges={['top']} style={styles.safeArea}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Header */}
                        <View style={styles.header}>
                            <TouchableOpacity
                                style={styles.backButton}
                                onPress={() => navigation.goBack()}
                            >
                                <Text style={styles.backText}>← Cancel</Text>
                            </TouchableOpacity>
                            <Text style={styles.title}>Edit Profile</Text>
                        </View>

                        {/* Avatar Section */}
                        <View style={styles.avatarSection}>
                            <TouchableOpacity
                                style={styles.avatarPreview}
                                onPress={pickImage}
                            >
                                {customImage ? (
                                    <View style={styles.customImagePlaceholder}>
                                        <Text style={styles.customImageText}>📷</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.avatarEmoji}>{selectedAvatar}</Text>
                                )}
                                <View style={styles.editBadge}>
                                    <Text style={styles.editBadgeText}>✏️</Text>
                                </View>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={pickImage}>
                                <Text style={styles.uploadLink}>Upload Photo</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Avatar Options */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Choose Avatar</Text>
                            <View style={styles.avatarGrid}>
                                {AVATAR_OPTIONS.map((emoji) => (
                                    <TouchableOpacity
                                        key={emoji}
                                        style={[
                                            styles.avatarOption,
                                            selectedAvatar === emoji && styles.avatarOptionSelected,
                                        ]}
                                        onPress={() => {
                                            setSelectedAvatar(emoji);
                                            setCustomImage(null);
                                        }}
                                    >
                                        <Text style={styles.avatarOptionEmoji}>{emoji}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>
                        </View>

                        {/* Display Name */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Display Name</Text>
                            <TextInput
                                style={styles.input}
                                value={displayName}
                                onChangeText={setDisplayName}
                                placeholder="Enter your display name"
                                placeholderTextColor={colors.textMuted}
                                maxLength={20}
                            />
                            <Text style={styles.charCount}>{displayName.length}/20</Text>
                        </View>

                        {/* University (Read-only) */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>University</Text>
                            <Card style={styles.readOnlyCard}>
                                <Text style={styles.readOnlyText}>
                                    {user?.universityName || 'Ohio State University'}
                                </Text>
                                <Text style={styles.readOnlyHint}>Cannot be changed</Text>
                            </Card>
                        </View>

                        {/* Save Button */}
                        <View style={styles.saveSection}>
                            <Button
                                title="Save Changes"
                                onPress={handleSave}
                                size="lg"
                            />
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
    avatarSection: {
        alignItems: 'center',
        paddingVertical: spacing.xl,
    },
    avatarPreview: {
        position: 'relative',
        marginBottom: spacing.md,
    },
    avatarEmoji: {
        fontSize: 80,
    },
    customImagePlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: colors.bgCard,
        alignItems: 'center',
        justifyContent: 'center',
    },
    customImageText: {
        fontSize: 40,
    },
    editBadge: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        backgroundColor: colors.primary,
        width: 32,
        height: 32,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.bgPrimary,
    },
    editBadgeText: {
        fontSize: 16,
    },
    uploadLink: {
        ...typography.body,
        color: colors.primary,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginBottom: spacing.xl,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.md,
    },
    avatarGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.sm,
    },
    avatarOption: {
        width: 56,
        height: 56,
        borderRadius: 28,
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
    avatarOptionEmoji: {
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
    charCount: {
        ...typography.small,
        color: colors.textMuted,
        textAlign: 'right',
        marginTop: spacing.xs,
    },
    readOnlyCard: {
        opacity: 0.7,
    },
    readOnlyText: {
        ...typography.body,
        color: colors.textSecondary,
    },
    readOnlyHint: {
        ...typography.small,
        color: colors.textMuted,
        marginTop: 4,
    },
    saveSection: {
        paddingHorizontal: spacing.lg,
    },
});
