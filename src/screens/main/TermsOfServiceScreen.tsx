// Terms of Service Screen
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

export const TermsOfServiceScreen: React.FC<Props> = ({ navigation }) => {
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
                        <Text style={styles.title}>Terms of Service</Text>
                        <Text style={styles.subtitle}>Last updated: January 2025</Text>
                    </View>

                    <ScrollView
                        style={styles.content}
                        showsVerticalScrollIndicator={false}
                    >
                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>1. Acceptance of Terms</Text>
                            <Text style={styles.paragraph}>
                                By downloading, installing, or using the Varsity application ("App"), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the App.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>2. Virtual Currency</Text>
                            <Text style={styles.paragraph}>
                                Varsity Coins are virtual currency with no real-world monetary value. They cannot be exchanged for real money, goods, or services outside of the App. This is not a gambling platform.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>3. Eligibility</Text>
                            <Text style={styles.paragraph}>
                                You must be at least 18 years old and a currently enrolled college student with a valid .edu email address to use this App. You must verify your student status during registration.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>4. User Conduct</Text>
                            <Text style={styles.paragraph}>
                                You agree not to:{'\n'}
                                • Use the App for any unlawful purpose{'\n'}
                                • Attempt to manipulate predictions or outcomes{'\n'}
                                • Create multiple accounts{'\n'}
                                • Share your account with others{'\n'}
                                • Use automated systems or bots
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>5. Predictions & Rewards</Text>
                            <Text style={styles.paragraph}>
                                All predictions are for entertainment purposes only. Rewards are subject to availability and may be modified or discontinued at any time. We reserve the right to void predictions in cases of technical error or manipulation.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>6. Privacy</Text>
                            <Text style={styles.paragraph}>
                                Your use of the App is also governed by our Privacy Policy. By using the App, you consent to the collection and use of your information as described in our Privacy Policy.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>7. Termination</Text>
                            <Text style={styles.paragraph}>
                                We reserve the right to suspend or terminate your account at any time for violations of these terms or for any other reason at our sole discretion.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>8. Changes to Terms</Text>
                            <Text style={styles.paragraph}>
                                We may modify these terms at any time. Continued use of the App after changes constitutes acceptance of the modified terms.
                            </Text>
                        </View>

                        <View style={styles.section}>
                            <Text style={styles.sectionTitle}>9. Contact</Text>
                            <Text style={styles.paragraph}>
                                For questions about these terms, contact us at:{'\n'}
                                support@varsityapp.com
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
