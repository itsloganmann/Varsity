// Speed Challenge Game Mode
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, gradients, shadows } from '../../theme';
import { useAuthStore } from '../../store/authStore';
import { Friend } from '../../store/friendsStore';

interface Props {
    navigation: any;
    route: { params: { friend: Friend } };
}

// Mock Challenge Data
const CHALLENGE_QUESTIONS = [
    { id: '1', q: 'OSU Total Points', line: 34.5 },
    { id: '2', q: 'Stroud Pass Yds', line: 285.5 },
    { id: '3', q: 'Harrison Jr Rec Yds', line: 105.5 },
    { id: '4', q: 'Michigan Total Pts', line: 24.5 },
    { id: '5', q: 'Total Interceptions', line: 1.5 },
    { id: '6', q: 'Henderson Rush Yds', line: 85.5 },
    { id: '7', q: 'Longest TD Yards', line: 45.5 },
    { id: '8', q: 'Total Sacks', line: 3.5 },
    { id: '9', q: 'OSU First Downs', line: 22.5 },
    { id: '10', q: 'Field Goals Made', line: 2.5 },
];

export const SpeedChallengeScreen: React.FC<Props> = ({ navigation, route }) => {
    const { friend } = route.params;
    const { user, updateCoins } = useAuthStore();

    // Game State
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'results'>('intro');
    const [timeLeft, setTimeLeft] = useState(120);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, 'over' | 'under'>>({});
    const [score, setScore] = useState(0);

    const fadeAnim = useRef(new Animated.Value(1)).current;
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Timer Logic
    useEffect(() => {
        if (gameState === 'playing') {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        endGame();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
        };
    }, [gameState]);

    const startGame = () => {
        setGameState('playing');
    };

    const endGame = () => {
        if (timerRef.current) clearInterval(timerRef.current);

        // Calculate Score (Random correctness for demo)
        // In real app, would compare against actuals or friend's answers
        let calculatedScore = 0;
        Object.keys(answers).forEach(() => {
            // 60% chance of being right for demo
            if (Math.random() > 0.4) calculatedScore++;
        });
        setScore(calculatedScore);

        setGameState('results');

        // Award Coins
        const coinsWon = calculatedScore * 10;
        if (coinsWon > 0) {
            updateCoins((user?.coins || 0) + coinsWon);
        }
    };

    const handleAnswer = (type: 'over' | 'under') => {
        const question = CHALLENGE_QUESTIONS[currentIndex];
        setAnswers(prev => ({ ...prev, [question.id]: type }));

        // Animate transition
        Animated.sequence([
            Animated.timing(fadeAnim, { toValue: 0, duration: 100, useNativeDriver: true }),
            Animated.timing(fadeAnim, { toValue: 1, duration: 100, useNativeDriver: true })
        ]).start();

        setTimeout(() => {
            if (currentIndex < CHALLENGE_QUESTIONS.length - 1) {
                setCurrentIndex(prev => prev + 1);
            } else {
                endGame();
            }
        }, 100);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const renderIntro = () => (
        <View style={styles.centerContent}>
            <View style={styles.introCard}>
                <Text style={styles.introEmoji}>⚡</Text>
                <Text style={styles.introTitle}>Speed Challenge</Text>
                <Text style={styles.introSubtitle}>vs {friend.name}</Text>

                <View style={styles.rulesContainer}>
                    <Text style={styles.ruleText}>• 10 Rapid-fire questions</Text>
                    <Text style={styles.ruleText}>• 2 Minute time limit</Text>
                    <Text style={styles.ruleText}>• Earn 10 coins per correct pick</Text>
                </View>

                <TouchableOpacity style={styles.startButton} onPress={startGame}>
                    <LinearGradient colors={gradients.boost} style={styles.startGradient}>
                        <Text style={styles.startText}>START CHALLENGE</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderGame = () => {
        const question = CHALLENGE_QUESTIONS[currentIndex];
        const progress = ((currentIndex) / CHALLENGE_QUESTIONS.length) * 100;

        return (
            <View style={styles.gameContainer}>
                {/* Timer Bar */}
                <View style={styles.timerBar}>
                    <Text style={[
                        styles.timerText,
                        timeLeft < 10 && styles.timerUrgent
                    ]}>
                        ⏱️ {formatTime(timeLeft)}
                    </Text>
                    <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress}%` }]} />
                    </View>
                </View>

                {/* Question Card */}
                <Animated.View style={[styles.questionCard, { opacity: fadeAnim }]}>
                    <Text style={styles.questionIndex}>Question {currentIndex + 1} / 10</Text>
                    <Text style={styles.questionText}>{question.q}</Text>

                    <View style={styles.lineBox}>
                        <Text style={styles.lineLabel}>LINE</Text>
                        <Text style={styles.lineValue}>{question.line}</Text>
                    </View>

                    <View style={styles.optionsRow}>
                        <TouchableOpacity
                            style={[styles.optionButton, styles.optionUnder]}
                            onPress={() => handleAnswer('under')}
                        >
                            <Text style={styles.optionEmoji}>⬇️</Text>
                            <Text style={styles.optionText}>UNDER</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.optionButton, styles.optionOver]}
                            onPress={() => handleAnswer('over')}
                        >
                            <Text style={styles.optionEmoji}>⬆️</Text>
                            <Text style={styles.optionText}>OVER</Text>
                        </TouchableOpacity>
                    </View>
                </Animated.View>
            </View>
        );
    };

    const renderResults = () => (
        <View style={styles.centerContent}>
            <View style={styles.resultsCard}>
                <Text style={styles.resultEmoji}>🏆</Text>
                <Text style={styles.resultTitle}>Challenge Complete!</Text>
                <Text style={styles.resultScore}>{score} / 10 Correct</Text>

                <Text style={styles.coinsEarned}>+{score * 10} Coins Earned</Text>

                <TouchableOpacity
                    style={styles.doneButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.doneText}>Done</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <LinearGradient colors={gradients.dark} style={styles.gradient}>
                <SafeAreaView style={styles.safeArea}>
                    <View style={styles.header}>
                        <TouchableOpacity onPress={() => navigation.goBack()}>
                            <Text style={styles.closeText}>✕</Text>
                        </TouchableOpacity>
                    </View>

                    {gameState === 'intro' && renderIntro()}
                    {gameState === 'playing' && renderGame()}
                    {gameState === 'results' && renderResults()}
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
        paddingHorizontal: spacing.lg,
    },
    header: {
        height: 50,
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    closeText: {
        fontSize: 24,
        color: colors.textSecondary,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    // Intro
    introCard: {
        width: '100%',
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.cardBorder,
        ...shadows.lg,
    },
    introEmoji: {
        fontSize: 64,
        marginBottom: spacing.md,
    },
    introTitle: {
        ...typography.h2,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    introSubtitle: {
        ...typography.body,
        color: colors.textSecondary,
        marginBottom: spacing.xl,
    },
    rulesContainer: {
        alignSelf: 'flex-start',
        marginBottom: spacing.xl,
        backgroundColor: colors.bgElevated,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        width: '100%',
    },
    ruleText: {
        ...typography.body,
        color: colors.textPrimary,
        marginBottom: spacing.xs,
    },
    startButton: {
        width: '100%',
        borderRadius: borderRadius.lg,
        ...shadows.glowOrange,
    },
    startGradient: {
        paddingVertical: spacing.md,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
    },
    startText: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
    // Game
    gameContainer: {
        flex: 1,
        paddingTop: spacing.xl,
    },
    timerBar: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: spacing.xl,
    },
    timerText: {
        ...typography.h3,
        color: colors.textPrimary,
        width: 80,
    },
    timerUrgent: {
        color: colors.error,
    },
    progressBar: {
        flex: 1,
        height: 8,
        backgroundColor: colors.bgElevated,
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: colors.primary,
    },
    questionCard: {
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        borderWidth: 1,
        borderColor: colors.cardBorder,
        alignItems: 'center',
        ...shadows.lg,
    },
    questionIndex: {
        ...typography.small,
        color: colors.textSecondary,
        marginBottom: spacing.lg,
    },
    questionText: {
        ...typography.h2,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xl,
    },
    lineBox: {
        backgroundColor: colors.bgElevated,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        marginBottom: spacing.xxl,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    lineLabel: {
        ...typography.micro,
        color: colors.textSecondary,
        marginBottom: 4,
    },
    lineValue: {
        ...typography.h1,
        color: colors.textPrimary,
        fontWeight: '900',
    },
    optionsRow: {
        flexDirection: 'row',
        gap: spacing.md,
        width: '100%',
    },
    optionButton: {
        flex: 1,
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        borderWidth: 1,
    },
    optionUnder: {
        backgroundColor: colors.bgElevated,
        borderColor: colors.cardBorder,
    },
    optionOver: {
        backgroundColor: colors.bgElevated,
        borderColor: colors.cardBorder,
    },
    optionEmoji: {
        fontSize: 32,
        marginBottom: spacing.sm,
    },
    optionText: {
        ...typography.bodyBold,
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
    // Results
    resultsCard: {
        width: '100%',
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: colors.cardBorder,
        ...shadows.glow,
    },
    resultEmoji: {
        fontSize: 64,
        marginBottom: spacing.md,
    },
    resultTitle: {
        ...typography.h2,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },
    resultScore: {
        ...typography.h1,
        color: colors.primary,
        marginBottom: spacing.md,
    },
    coinsEarned: {
        ...typography.h3,
        color: colors.coinGold,
        marginBottom: spacing.xl,
    },
    doneButton: {
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.xl,
        backgroundColor: colors.bgElevated,
        borderRadius: borderRadius.lg,
        width: '100%',
        alignItems: 'center',
    },
    doneText: {
        color: colors.textPrimary,
        fontWeight: 'bold',
    },
});
