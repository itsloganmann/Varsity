// Privacy Policy Screen
import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, gradients } from '../../theme';

interface Props {
    navigation: any;
}

export const PrivacyPolicyScreen: React.FC<Props> = ({ navigation }) => {
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
                        <Text style={styles.title}>Privacy Policy</Text>
                        <Text style={styles.subtitle}>Last updated: January 2025</Text>
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Information We Collect</Text>
                            <Text style={styles.paragraph}>
                                We collect information you provide directly:{'\n'}
                                • Email address (for verification){'\n'}
                                • Display name{'\n'}
                                • University affiliation{'\n'}
                                • Profile photo (optional){'\n'}
                                • Prediction history
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Location Data</Text>
                            <Text style={styles.paragraph}>
                                With your permission, we collect location data to:{'\n'}
                                • Verify your presence at stadiums{'\n'}
                                • Provide Stadium Boost features{'\n'}
                                • Show friends at games{'\n\n'}
                                You can disable location access at any time in your device settings.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>How We Use Your Data</Text>
                            <Text style={styles.paragraph}>
                                We use your information to:{'\n'}
                                • Provide and improve our services{'\n'}
                                • Process predictions and rewards{'\n'}
                                • Communicate with you{'\n'}
                                • Ensure fair play and prevent fraud{'\n'}
                                • Generate anonymized analytics
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Data Sharing</Text>
                            <Text style={styles.paragraph}>
                                We do not sell your personal information. We may share data with:{'\n'}
                                • Service providers who help operate our App{'\n'}
                                • University partners (with your consent){'\n'}
                                • Law enforcement when required by law
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Data Security</Text>
                            <Text style={styles.paragraph}>
                                We implement industry-standard security measures to protect your data. However, no method of transmission over the Internet is 100% secure.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Your Rights</Text>
                            <Text style={styles.paragraph}>
                                You have the right to:{'\n'}
                                • Access your personal data{'\n'}
                                • Correct inaccurate data{'\n'}
                                • Delete your account and data{'\n'}
                                • Opt out of marketing communications{'\n'}
                                • Export your data
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Data Retention</Text>
                            <Text style={styles.paragraph}>
                                We retain your data as long as your account is active. You can request deletion at any time through Settings → Clear All Data or by contacting support.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>Contact Us</Text>
                            <Text style={styles.paragraph}>
                                For privacy concerns or data requests:{'\n'}
                                privacy@varsityapp.com
                            </Text>
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
        borderBottomWidth: 1,
        borderBottomColor: colors.cardBorder,
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
        color: colors.textMuted,
        marginTop: 2,
    },
    content: {
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    section: {
        paddingVertical: spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: colors.cardBorder,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    paragraph: {
        ...typography.body,
        color: colors.textSecondary,
        lineHeight: 22,
    },
});
