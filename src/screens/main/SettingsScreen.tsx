// Settings Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { colors, spacing, borderRadius, typography, gradients } from '../../theme';
import { useAuthStore } from '../../store/authStore';

interface Props {
    navigation: any;
}

interface SettingRowProps {
    icon: string;
    label: string;
    value?: string;
    hasToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
    onPress?: () => void;
    danger?: boolean;
}

const SettingRow: React.FC<SettingRowProps> = ({
    icon,
    label,
    value,
    hasToggle,
    toggleValue,
    onToggle,
    onPress,
    danger,
}) => (
    <TouchableOpacity
        style={styles.settingRow}
        onPress={onPress}
        disabled={hasToggle}
    >
        <View style={styles.settingLeft}>
            <Text style={styles.settingIcon}>{icon}</Text>
            <Text style={[styles.settingLabel, danger && styles.dangerText]}>{label}</Text>
        </View>
        {hasToggle ? (
            <Switch
                value={toggleValue}
                onValueChange={onToggle}
                trackColor={{ false: colors.bgElevated, true: colors.primary }}
                thumbColor={colors.textPrimary}
            />
        ) : value ? (
            <Text style={styles.settingValue}>{value}</Text>
        ) : (
            <Text style={styles.settingChevron}>›</Text>
        )}
    </TouchableOpacity>
);

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
    const { user, logout } = useAuthStore();
    const [notifications, setNotifications] = useState(true);
    const [stadiumAlerts, setStadiumAlerts] = useState(true);
    const [friendActivity, setFriendActivity] = useState(true);

    const handleClearData = () => {
        Alert.alert(
            'Clear All Data',
            'This will reset the app to its initial state. Perfect for demo recordings!',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Clear Data',
                    style: 'destructive',
                    onPress: async () => {
                        await AsyncStorage.clear();
                        logout();
                    },
                },
            ]
        );
    };

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
                            <Text style={styles.backIcon}>‹</Text>
                        </TouchableOpacity>
                        <Text style={styles.title}>Settings</Text>
                        <View style={styles.headerSpacer} />
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        {/* Profile Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Profile</Text>
                            <View style={styles.sectionCard}>
                                <SettingRow
                                    icon="📛"
                                    label="Display Name"
                                    value={user?.displayName}
                                    onPress={() => { }}
                                />
                                <SettingRow
                                    icon="🎭"
                                    label="Avatar"
                                    value="Edit"
                                    onPress={() => { }}
                                />
                                <SettingRow
                                    icon="🏫"
                                    label="University"
                                    value={user?.universityName?.split(' ')[0]}
                                    onPress={() => { }}
                                />
                            </View>
                        </View>

                        {/* Notifications Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Notifications</Text>
                            <View style={styles.sectionCard}>
                                <SettingRow
                                    icon="🔔"
                                    label="Push Notifications"
                                    hasToggle
                                    toggleValue={notifications}
                                    onToggle={setNotifications}
                                />
                                <SettingRow
                                    icon="🏟️"
                                    label="Stadium Alerts"
                                    hasToggle
                                    toggleValue={stadiumAlerts}
                                    onToggle={setStadiumAlerts}
                                />
                                <SettingRow
                                    icon="👥"
                                    label="Friend Activity"
                                    hasToggle
                                    toggleValue={friendActivity}
                                    onToggle={setFriendActivity}
                                />
                            </View>
                        </View>

                        {/* Stadium Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Stadium Boost</Text>
                            <View style={styles.sectionCard}>
                                <SettingRow
                                    icon="📍"
                                    label="Location Services"
                                    value="Enabled"
                                    onPress={() => { }}
                                />
                                <SettingRow
                                    icon="⚡"
                                    label="Auto Check-in"
                                    hasToggle
                                    toggleValue={true}
                                    onToggle={() => { }}
                                />
                            </View>
                        </View>

                        {/* App Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>App</Text>
                            <View style={styles.sectionCard}>
                                <SettingRow
                                    icon="🌙"
                                    label="Dark Mode"
                                    value="Always"
                                    onPress={() => { }}
                                />
                                <SettingRow
                                    icon="📱"
                                    label="App Version"
                                    value="1.0.0"
                                />
                                <SettingRow
                                    icon="📄"
                                    label="Terms of Service"
                                    onPress={() => { }}
                                />
                                <SettingRow
                                    icon="🔒"
                                    label="Privacy Policy"
                                    onPress={() => { }}
                                />
                            </View>
                        </View>

                        {/* Demo Section */}
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Demo Tools</Text>
                            <View style={styles.sectionCard}>
                                <SettingRow
                                    icon="🗑️"
                                    label="Clear All Data"
                                    onPress={handleClearData}
                                    danger
                                />
                            </View>
                            <Text style={styles.demoHint}>
                                Use this to reset the app before recording a demo
                            </Text>
                        </View>

                        <View style={{ height: 120 }} />
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: {
        fontSize: 32,
        color: colors.textPrimary,
        marginTop: -4,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    headerSpacer: {
        width: 40,
    },
    section: {
        paddingHorizontal: spacing.lg,
        marginTop: spacing.lg,
    },
    sectionTitle: {
        ...typography.micro,
        color: colors.textMuted,
        textTransform: 'uppercase',
        marginBottom: spacing.sm,
        marginLeft: spacing.xs,
    },
    sectionCard: {
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.xl,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        overflow: 'hidden',
    },
    settingRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
    },
    settingLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    settingIcon: {
        fontSize: 20,
        width: 28,
        textAlign: 'center',
    },
    settingLabel: {
        ...typography.body,
        color: colors.textPrimary,
    },
    settingValue: {
        ...typography.body,
        color: colors.textMuted,
    },
    settingChevron: {
        fontSize: 24,
        color: colors.textMuted,
    },
    dangerText: {
        color: colors.error,
    },
    demoHint: {
        ...typography.small,
        color: colors.textMuted,
        marginTop: spacing.sm,
        marginLeft: spacing.xs,
    },
});
