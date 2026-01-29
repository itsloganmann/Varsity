// Promotional Challenge Screen - Sports Analytics Internship
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, commonStyles } from '../../theme';
import { SectionHeader, Badge } from '../../components/common';
import { useAuthStore } from '../../store/authStore';

// Mock Data for the Challenge
const CHALLENGE_WEEKS = [
    { id: 1, label: 'Week 1', status: 'completed' },
    { id: 2, label: 'Week 2', status: 'active' },
    { id: 3, label: 'Week 3', status: 'locked' },
    { id: 4, label: 'Week 4', status: 'locked' },
];

const WEEK_2_QUESTIONS = [
    { id: 1, question: 'Will Ohio State cover -14.5 vs Penn State?', options: ['Yes', 'No'], locked: false },
    { id: 2, question: 'Total Points: Over/Under 52.5', options: ['Over', 'Under'], locked: false },
    { id: 3, question: 'Who will have more passing yards?', options: ['Howard', 'Allar'], locked: false },
    { id: 4, question: 'First Touchdown Scorer type?', options: ['Rush', 'Pass/Other'], locked: false },
    { id: 5, question: 'Will there be a defensive touchdown?', options: ['Yes', 'No'], locked: false },
    { id: 6, question: 'Winning Margin > 20 points?', options: ['Yes', 'No'], locked: false },
    { id: 7, question: 'Total Turnovers > 2.5?', options: ['Over', 'Under'], locked: false },
    { id: 8, question: 'Longest play > 50 yards?', options: ['Yes', 'No'], locked: false },
    { id: 9, question: 'Halftime Leader?', options: ['OSU', 'PSU', 'Tie'], locked: false },
    { id: 10, question: 'Attendance > 105,000?', options: ['Yes', 'No'], locked: false },
];

export const PromotionalChallengeScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const [activeWeek, setActiveWeek] = useState(2);
    const [selections, setSelections] = useState<Record<number, string>>({});
    const { user } = useAuthStore();

    const handleSelect = (questionId: number, option: string) => {
        setSelections(prev => ({
            ...prev,
            [questionId]: option
        }));
    };

    const handleSubmit = () => {
        Alert.alert(
            'Predictions Saved',
            'You can edit these until kickoff on Saturday at 12:00 PM EST.',
            [{ text: 'OK' }]
        );
    };

    return (
        <View style={styles.container}>
            <SafeAreaView edges={['top']} style={styles.safeArea}>
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                        <Text style={styles.backText}>← Back</Text>
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Internship Challenge</Text>
                    <View style={{ width: 60 }} />
                </View>

                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Hero Banner */}
                    <View style={styles.heroBanner}>
                        <Text style={styles.heroTitle}>Sports Analytics Internship</Text>
                        <Text style={styles.heroSubtitle}>
                            Predict 4 weeks of games perfectly to win a summer internship with the Varsity Analytics team.
                        </Text>
                        <View style={styles.prizeBadge}>
                            <Text style={styles.prizeText}>🏆 Grand Prize: Summer 2026 Internship</Text>
                        </View>
                    </View>

                    {/* Week Tabs */}
                    <View style={styles.tabsContainer}>
                        {CHALLENGE_WEEKS.map(week => (
                            <TouchableOpacity
                                key={week.id}
                                style={[
                                    styles.tab,
                                    activeWeek === week.id && styles.tabActive,
                                    week.status === 'locked' && styles.tabLocked
                                ]}
                                onPress={() => week.status !== 'locked' && setActiveWeek(week.id)}
                            >
                                <Text style={[
                                    styles.tabText,
                                    activeWeek === week.id && styles.tabTextActive,
                                    week.status === 'locked' && styles.tabTextLocked
                                ]}>
                                    {week.label}
                                </Text>
                                {week.status === 'completed' && <Text style={styles.checkMark}>✓</Text>}
                            </TouchableOpacity>
                        ))}
                    </View>

                    {/* Content */}
                    {activeWeek === 1 ? (
                        <View style={styles.completedState}>
                            <Text style={styles.completedTitle}>Week 1 Completed</Text>
                            <Text style={styles.completedScore}>You scored 8/10</Text>
                            <Text style={styles.completedSub}>Strong start! Keep it up in Week 2.</Text>
                        </View>
                    ) : (
                        <View style={styles.questionsList}>
                            <View style={styles.statusRow}>
                                <Badge text="OPEN" variant="success" />
                                <Text style={styles.deadlineText}>Closes Sat, 12:00 PM</Text>
                            </View>

                            {WEEK_2_QUESTIONS.map((q, index) => (
                                <View key={q.id} style={styles.questionCard}>
                                    <View style={styles.questionHeader}>
                                        <Text style={styles.questionNum}>Q{index + 1}</Text>
                                        <Text style={styles.questionText}>{q.question}</Text>
                                    </View>
                                    <View style={styles.optionsGrid}>
                                        {q.options.map(opt => (
                                            <TouchableOpacity
                                                key={opt}
                                                style={[
                                                    styles.optionButton,
                                                    selections[q.id] === opt && styles.optionSelected
                                                ]}
                                                onPress={() => handleSelect(q.id, opt)}
                                            >
                                                <Text style={[
                                                    styles.optionText,
                                                    selections[q.id] === opt && styles.optionTextSelected
                                                ]}>
                                                    {opt}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                    </View>
                                </View>
                            ))}

                            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                                <Text style={styles.submitButtonText}>Save Predictions</Text>
                            </TouchableOpacity>
                            <Text style={styles.disclaimer}>
                                * You can edit your picks until the deadline.
                            </Text>
                        </View>
                    )}

                    <View style={{ height: 40 }} />
                </ScrollView>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.bgPrimary,
    },
    safeArea: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: spacing.xxl,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        backgroundColor: colors.bgPrimary,
    },
    backButton: {
        width: 60,
    },
    backText: {
        color: colors.textSecondary,
        fontSize: 14,
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    heroBanner: {
        padding: spacing.xl,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        alignItems: 'center',
        backgroundColor: colors.bgSecondary,
    },
    heroTitle: {
        fontSize: 24,
        fontWeight: '800',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        textAlign: 'center',
    },
    heroSubtitle: {
        fontSize: 14,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
        lineHeight: 20,
    },
    prizeBadge: {
        backgroundColor: 'rgba(210, 153, 34, 0.15)',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        borderWidth: 1,
        borderColor: colors.gold,
    },
    prizeText: {
        color: colors.gold,
        fontWeight: '700',
        fontSize: 13,
    },
    tabsContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        gap: spacing.sm,
    },
    tab: {
        flex: 1,
        paddingVertical: spacing.sm,
        alignItems: 'center',
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: 'transparent',
    },
    tabActive: {
        backgroundColor: colors.bgElevated,
        borderColor: colors.border,
    },
    tabLocked: {
        opacity: 0.5,
    },
    tabText: {
        fontSize: 13,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    tabTextActive: {
        color: colors.textPrimary,
    },
    tabTextLocked: {
        color: colors.textTertiary,
    },
    checkMark: {
        fontSize: 10,
        color: colors.success,
        marginTop: 2,
    },
    completedState: {
        padding: spacing.xl,
        alignItems: 'center',
    },
    completedTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    completedScore: {
        fontSize: 32,
        fontWeight: '800',
        color: colors.success,
        marginBottom: spacing.md,
    },
    completedSub: {
        color: colors.textSecondary,
    },
    questionsList: {
        padding: spacing.lg,
    },
    statusRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.lg,
    },
    deadlineText: {
        fontSize: 12,
        color: colors.textSecondary,
        fontWeight: '500',
    },
    questionCard: {
        backgroundColor: colors.bgSecondary,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        marginBottom: spacing.lg,
        borderWidth: 1,
        borderColor: colors.border,
    },
    questionHeader: {
        flexDirection: 'row',
        gap: spacing.md,
        marginBottom: spacing.md,
    },
    questionNum: {
        fontSize: 14,
        fontWeight: '700',
        color: colors.textTertiary,
        width: 24,
    },
    questionText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '500',
        color: colors.textPrimary,
        lineHeight: 22,
    },
    optionsGrid: {
        flexDirection: 'row',
        gap: spacing.md,
        paddingLeft: 32, // align with text
    },
    optionButton: {
        flex: 1,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.sm,
        backgroundColor: colors.bgPrimary,
        borderRadius: borderRadius.md,
        borderWidth: 1,
        borderColor: colors.border,
        alignItems: 'center',
    },
    optionSelected: {
        backgroundColor: colors.primary,
        borderColor: colors.primary,
    },
    optionText: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textSecondary,
    },
    optionTextSelected: {
        color: colors.textPrimary,
    },
    submitButton: {
        backgroundColor: colors.primary,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginTop: spacing.md,
    },
    submitButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.textPrimary,
    },
    disclaimer: {
        marginTop: spacing.md,
        textAlign: 'center',
        fontSize: 12,
        color: colors.textTertiary,
    },
});
