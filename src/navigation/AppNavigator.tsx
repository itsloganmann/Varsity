// App Navigation with Account and Settings
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet } from 'react-native';

import { useAuthStore } from '../store/authStore';
import { colors, spacing, shadows } from '../theme';

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
    AccountScreen,
    SettingsScreen,
    FriendsScreen,
    FriendProfileScreen,
    ChatroomScreen,
    DirectMessageScreen,
    EditProfileScreen,
    TermsOfServiceScreen,
    PrivacyPolicyScreen,
    SpeedChallengeScreen,
    PromotionalChallengeScreen,
} from '../screens/main';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AccountStack = createStackNavigator();
const MainStack = createStackNavigator();

// Tab Bar Icon Component - Premium styling
const TabIcon: React.FC<{ emoji: string; focused: boolean }> = ({ emoji, focused }) => (
    <View style={[styles.tabIcon, focused && styles.tabIconFocused]}>
        <Text style={[styles.tabEmoji, focused && styles.tabEmojiFocused]}>{emoji}</Text>
    </View>
);

// Account Stack Navigator (Account + Settings + Legal)
const AccountStackNavigator = () => (
    <AccountStack.Navigator screenOptions={{ headerShown: false }}>
        <AccountStack.Screen name="AccountMain" component={AccountScreen} />
        <AccountStack.Screen name="Settings" component={SettingsScreen} />
        <AccountStack.Screen name="EditProfile" component={EditProfileScreen} />
        <AccountStack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
        <AccountStack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
    </AccountStack.Navigator>
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
            tabBarShowLabel: true,
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
            name="Predict"
            component={PredictionsScreen}
            options={{
                tabBarIcon: ({ focused }) => <TabIcon emoji="🎯" focused={focused} />,
            }}
        />
        <Tab.Screen
            name="Ranks"
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
        <Tab.Screen
            name="Account"
            component={AccountStackNavigator}
            options={{
                tabBarIcon: ({ focused }) => <TabIcon emoji="👤" focused={focused} />,
            }}
        />
    </Tab.Navigator>
);

// Main Stack (Tabs + Modal Screens)
const MainStackNavigator = () => (
    <MainStack.Navigator screenOptions={{ headerShown: false }}>
        <MainStack.Screen name="MainTabs" component={MainTabs} />
        <MainStack.Screen name="Friends" component={FriendsScreen} />
        <MainStack.Screen name="FriendProfile" component={FriendProfileScreen} />
        <MainStack.Screen name="Chatroom" component={ChatroomScreen} />
        <MainStack.Screen name="DirectMessage" component={DirectMessageScreen} />
        <MainStack.Screen name="SpeedChallenge" component={SpeedChallengeScreen} />
        <MainStack.Screen name="PromotionalChallenge" component={PromotionalChallengeScreen} />
    </MainStack.Navigator>
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
        <Stack.Screen name="MainApp" component={MainStackNavigator} />
    </Stack.Navigator>
);

// Root Navigator
export const AppNavigator = () => {
    const { user, isOnboarded } = useAuthStore();

    return (
        <NavigationContainer>
            {user && isOnboarded ? (
                <MainStackNavigator />
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
        height: 85,
        ...shadows.lg,
    },
    tabLabel: {
        fontSize: 10,
        fontWeight: '600',
        marginTop: 2,
    },
    tabIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    tabIconFocused: {
        backgroundColor: colors.primary + '20',
        ...shadows.glow,
    },
    tabEmoji: {
        fontSize: 22,
        opacity: 0.7,
    },
    tabEmojiFocused: {
        opacity: 1,
    },
});
