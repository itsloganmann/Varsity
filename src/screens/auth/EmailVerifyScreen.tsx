// Email Verification Screen
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { Button } from '../../components/common';
import { useAuthStore } from '../../store/authStore';

interface Props {
    navigation: any;
}

export const EmailVerifyScreen: React.FC<Props> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [step, setStep] = useState<'email' | 'code'>('email');
    const [error, setError] = useState('');

    const { selectedUniversity, login, isLoading } = useAuthStore();

    const isValidEmail = (email: string) => {
        return email.includes('@') && email.includes('.edu');
    };

    const handleSendCode = () => {
        if (!isValidEmail(email)) {
            setError('Please enter a valid .edu email address');
            return;
        }
        setError('');
        setStep('code');
    };

    const handleVerify = async () => {
        if (code.length < 4) {
            setError('Please enter the verification code');
            return;
        }
        setError('');

        // For demo, any 4+ digit code works
        await login(email);
        navigation.navigate('ProfileSetup');
    };

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.bgPrimary, colors.bgSecondary]}
                style={styles.gradient}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    style={styles.content}
                >
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => step === 'code' ? setStep('email') : navigation.goBack()}
                    >
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>

                    <View style={styles.header}>
                        <Text style={styles.emoji}>{step === 'email' ? '📧' : '🔐'}</Text>
                        <Text style={styles.title}>
                            {step === 'email' ? 'Verify Your Email' : 'Enter Code'}
                        </Text>
                        <Text style={styles.subtitle}>
                            {step === 'email'
                                ? `Use your ${selectedUniversity?.shortName || 'university'} email to verify you're a student`
                                : `We sent a code to ${email}`}
                        </Text>
                    </View>

                    {step === 'email' ? (
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Student Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="yourname@university.edu"
                                placeholderTextColor={colors.textMuted}
                                value={email}
                                onChangeText={(text) => {
                                    setEmail(text);
                                    setError('');
                                }}
                                keyboardType="email-address"
                                autoCapitalize="none"
                                autoCorrect={false}
                            />
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                        </View>
                    ) : (
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Verification Code</Text>
                            <TextInput
                                style={[styles.input, styles.codeInput]}
                                placeholder="Enter 6-digit code"
                                placeholderTextColor={colors.textMuted}
                                value={code}
                                onChangeText={(text) => {
                                    setCode(text.replace(/[^0-9]/g, '').slice(0, 6));
                                    setError('');
                                }}
                                keyboardType="number-pad"
                                maxLength={6}
                            />
                            {error ? <Text style={styles.errorText}>{error}</Text> : null}
                            <TouchableOpacity style={styles.resendLink}>
                                <Text style={styles.resendText}>Didn't receive it? Resend code</Text>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={styles.footer}>
                        <Button
                            title={step === 'email' ? 'Send Verification Code' : 'Verify & Continue'}
                            onPress={step === 'email' ? handleSendCode : handleVerify}
                            loading={isLoading}
                            size="lg"
                        />

                        {step === 'email' && (
                            <Text style={styles.demoHint}>
                                💡 Demo mode: Enter any .edu email
                            </Text>
                        )}
                        {step === 'code' && (
                            <Text style={styles.demoHint}>
                                💡 Demo mode: Enter any 4+ digit code
                            </Text>
                        )}
                    </View>
                </KeyboardAvoidingView>
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
        flex: 1,
        paddingHorizontal: spacing.lg,
    },
    backButton: {
        paddingVertical: spacing.md,
    },
    backText: {
        color: colors.textSecondary,
        ...typography.body,
    },
    header: {
        alignItems: 'center',
        paddingTop: spacing.xl,
        paddingBottom: spacing.xl,
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
        paddingHorizontal: spacing.lg,
    },
    inputContainer: {
        marginBottom: spacing.lg,
    },
    inputLabel: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
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
    codeInput: {
        textAlign: 'center',
        fontSize: 28,
        letterSpacing: 8,
        fontWeight: '600',
        height: 60,
        paddingVertical: spacing.md,
    },
    errorText: {
        color: colors.error,
        ...typography.caption,
        marginTop: spacing.sm,
    },
    resendLink: {
        marginTop: spacing.md,
        alignItems: 'center',
    },
    resendText: {
        color: colors.primary,
        ...typography.caption,
    },
    footer: {
        marginTop: 'auto',
        paddingVertical: spacing.xl,
    },
    demoHint: {
        ...typography.caption,
        color: colors.textMuted,
        textAlign: 'center',
        marginTop: spacing.md,
    },
});
