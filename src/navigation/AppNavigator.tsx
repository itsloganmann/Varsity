// App Navigation
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import { useAuthStore } from '../store/authStore';
import { colors, spacing } from '../theme';

// Auth Screens
import {
    UniversitySelectScreen,
    EmailVerifyScreen,
    ProfileSetupScreen,
    OnboardingScreen,
} from '../screens/auth';

// Main Screens
import {
    HomeScreen,
    PredictionsScreen,
    LeaderboardScreen,
    RewardsScreen,
    TicketsScreen,
} from '../screens/main';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Tab Bar Icon Component
const TabIcon: React.FC<{ emoji: string; focused: boolean }> = ({ emoji, focused }) => (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
        <Text style={styles.tabEmoji}>{emoji}</Text>
    </View>
);

// Main Tab Navigator
const MainTabs = () => (
    <Tab.Navigator
        screenOptions={{
            headerShown: false,
            tabBarStyle: styles.tabBar,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textMuted,
            tabBarLabelStyle: styles.tabLabel,
        }}
    >
        <Tab.Screen
            name="Home"
            component={HomeScreen}
            options={{
                tabBarIcon: ({ focused }) => <TabIcon emoji="🏠" focused={focused} />,
            }}
        />
        <Tab.Screen
            name="Predictions"
            component={PredictionsScreen}
            options={{
                tabBarIcon: ({ focused }) => <TabIcon emoji="🎯" focused={focused} />,
            }}
        />
        <Tab.Screen
            name="Leaderboard"
            component={LeaderboardScreen}
            options={{
                tabBarIcon: ({ focused }) => <TabIcon emoji="🏆" focused={focused} />,
            }}
        />
        <Tab.Screen
            name="Rewards"
            component={RewardsScreen}
            options={{
                tabBarIcon: ({ focused }) => <TabIcon emoji="🎁" focused={focused} />,
            }}
        />
        <Tab.Screen
            name="Tickets"
            component={TicketsScreen}
            options={{
                tabBarIcon: ({ focused }) => <TabIcon emoji="🎟️" focused={focused} />,
            }}
        />
    </Tab.Navigator>
);

// Auth Stack
const AuthStack = () => (
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            cardStyle: { backgroundColor: colors.bgPrimary },
        }}
    >
        <Stack.Screen name="UniversitySelect" component={UniversitySelectScreen} />
        <Stack.Screen name="EmailVerify" component={EmailVerifyScreen} />
        <Stack.Screen name="ProfileSetup" component={ProfileSetupScreen} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
        <Stack.Screen name="MainApp" component={MainTabs} />
    </Stack.Navigator>
);

// Root Navigator
export const AppNavigator = () => {
    const { user, isOnboarded } = useAuthStore();

    return (
        <NavigationContainer>
            {user && isOnboarded ? (
                <MainTabs />
            ) : (
                <AuthStack />
            )}
        </NavigationContainer>
    );
};

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: colors.bgSecondary,
        borderTopColor: colors.cardBorder,
        borderTopWidth: 1,
        paddingTop: spacing.xs,
        paddingBottom: spacing.sm,
        height: 80,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    tabIcon: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIconFocused: {
        backgroundColor: colors.primary + '20',
    },
    tabEmoji: {
        fontSize: 20,
    },
});
