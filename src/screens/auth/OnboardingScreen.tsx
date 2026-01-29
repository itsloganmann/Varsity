// Onboarding Screen
import React, { useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    SafeAreaView,
    Dimensions,
    FlatList,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography } from '../../theme';
import { Button } from '../../components/common';
import { useAuthStore } from '../../store/authStore';

interface Props {
    navigation: any;
}

const { width } = Dimensions.get('window');

const SLIDES = [
    {
        id: '1',
        emoji: '🎯',
        title: 'Make Predictions',
        description: 'Predict game outcomes using virtual coins. No real money, no gambling - just pure fan skill.',
    },
    {
        id: '2',
        emoji: '🏟️',
        title: 'Stadium Boost',
        description: 'Get up to 5x boost on your predictions when you attend games in person. The more you show up, the more you win!',
    },
    {
        id: '3',
        emoji: '🏆',
        title: 'Win Rewards',
        description: 'Climb the leaderboards and redeem your coins for exclusive merch, perks, and experiences.',
    },
];

export const OnboardingScreen: React.FC<Props> = ({ navigation }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const flatListRef = useRef<FlatList>(null);
    const scrollX = useRef(new Animated.Value(0)).current;
    const completeOnboarding = useAuthStore(state => state.completeOnboarding);

    const handleNext = () => {
        if (currentIndex < SLIDES.length - 1) {
            flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
        } else {
            completeOnboarding();
            navigation.reset({
                index: 0,
                routes: [{ name: 'MainApp' }],
            });
        }
    };

    const handleSkip = () => {
        completeOnboarding();
        navigation.reset({
            index: 0,
            routes: [{ name: 'MainApp' }],
        });
    };

    const renderSlide = ({ item }: { item: typeof SLIDES[0] }) => (
        <View style={styles.slide}>
            <View style={styles.emojiContainer}>
                <Text style={styles.slideEmoji}>{item.emoji}</Text>
            </View>
            <Text style={styles.slideTitle}>{item.title}</Text>
            <Text style={styles.slideDescription}>{item.description}</Text>
        </View>
    );

    const renderDots = () => (
        <View style={styles.dotsContainer}>
            {SLIDES.map((_, index) => {
                const inputRange = [
                    (index - 1) * width,
                    index * width,
                    (index + 1) * width,
                ];

                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [8, 24, 8],
                    extrapolate: 'clamp',
                });

                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                });

                return (
                    <Animated.View
                        key={index}
                        style={[
                            styles.dot,
                            { width: dotWidth, opacity },
                        ]}
                    />
                );
            })}
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <LinearGradient
                colors={[colors.bgPrimary, colors.bgSecondary]}
                style={styles.gradient}
            >
                <View style={styles.header}>
                    <Text style={styles.skipButton} onPress={handleSkip}>
                        Skip
                    </Text>
                </View>

                <Animated.FlatList
                    ref={flatListRef}
                    data={SLIDES}
                    renderItem={renderSlide}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                    bounces={false}
                    keyExtractor={item => item.id}
                    onScroll={Animated.event(
                        [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                        { useNativeDriver: false }
                    )}
                    onMomentumScrollEnd={(e) => {
                        const index = Math.round(e.nativeEvent.contentOffset.x / width);
                        setCurrentIndex(index);
                    }}
                />

                {renderDots()}

                <View style={styles.footer}>
                    <Button
                        title={currentIndex === SLIDES.length - 1 ? "Let's Go!" : 'Next'}
                        onPress={handleNext}
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
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
    },
    skipButton: {
        color: colors.textSecondary,
        ...typography.body,
    },
    slide: {
        width,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xl,
    },
    emojiContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        backgroundColor: colors.bgCard,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.xl,
    },
    slideEmoji: {
        fontSize: 56,
    },
    slideTitle: {
        ...typography.h1,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.md,
    },
    slideDescription: {
        ...typography.body,
        color: colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: spacing.xl,
        gap: spacing.sm,
    },
    dot: {
        height: 8,
        borderRadius: 4,
        backgroundColor: colors.primary,
    },
    footer: {
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.xl,
    },
});
