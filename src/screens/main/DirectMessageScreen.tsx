// Direct Message Screen with Friend
import React, { useState, useRef, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
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

interface Message {
    id: string;
    text: string;
    senderId: string;
    timestamp: Date;
    isSystem?: boolean;
}

export const DirectMessageScreen: React.FC<Props> = ({ navigation, route }) => {
    const { friend } = route.params;
    const { user } = useAuthStore();
    const [inputText, setInputText] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: `Hey! Are you going to the game this weekend? 🏈`,
            senderId: friend.id,
            timestamp: new Date(Date.now() - 3600000), // 1 hour ago
        },
    ]);

    const flatListRef = useRef<FlatList>(null);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            text: inputText.trim(),
            senderId: user?.id || 'me',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');

        // Scroll to bottom
        setTimeout(() => {
            flatListRef.current?.scrollToEnd({ animated: true });
        }, 100);

        // Simulated reply (Demo)
        if (messages.length === 1) { // Only reply once for demo
            setTimeout(() => {
                const reply: Message = {
                    id: (Date.now() + 1).toString(),
                    text: `Nice wager! I'm taking the over on points today.`,
                    senderId: friend.id,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, reply]);
            }, 2000);
        }
    };

    const renderMessage = ({ item }: { item: Message }) => {
        const isMe = item.senderId === (user?.id || 'me');
        const isSystem = item.isSystem;

        if (isSystem) {
            return (
                <View style={styles.systemMessage}>
                    <Text style={styles.systemMessageText}>{item.text}</Text>
                </View>
            );
        }

        return (
            <View style={[styles.messageRow, isMe ? styles.myMessageRow : styles.theirMessageRow]}>
                {!isMe && (
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{friend.avatar}</Text>
                    </View>
                )}
                <View style={[
                    styles.bubble,
                    isMe ? styles.myBubble : styles.theirBubble
                ]}>
                    <Text style={[
                        styles.messageText,
                        isMe ? styles.myMessageText : styles.theirMessageText
                    ]}>
                        {item.text}
                    </Text>
                    <Text style={[
                        styles.timestamp,
                        isMe ? styles.myTimestamp : styles.theirTimestamp
                    ]}>
                        {item.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                </View>
            </View>
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
                            <Text style={styles.backText}>←</Text>
                        </TouchableOpacity>
                        <View style={styles.headerContent}>
                            <Text style={styles.headerName}>{friend.name}</Text>
                            {friend.isOnline && (
                                <View style={styles.onlineBadge}>
                                    <View style={styles.onlineDot} />
                                    <Text style={styles.onlineText}>Online</Text>
                                </View>
                            )}
                        </View>
                        <View style={{ width: 40 }} />
                    </View>

                    {/* Messages */}
                    <FlatList
                        ref={flatListRef}
                        data={messages}
                        renderItem={renderMessage}
                        keyExtractor={item => item.id}
                        contentContainerStyle={styles.messagesList}
                        showsVerticalScrollIndicator={false}
                    />

                    {/* Input */}
                    <KeyboardAvoidingView
                        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 10 : 0}
                    >
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Type a message..."
                                placeholderTextColor={colors.textMuted}
                                value={inputText}
                                onChangeText={setInputText}
                                onSubmitEditing={handleSend}
                                returnKeyType="send"
                            />
                            <TouchableOpacity
                                style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
                                onPress={handleSend}
                                disabled={!inputText.trim()}
                            >
                                <LinearGradient
                                    colors={inputText.trim() ? gradients.primary : [colors.bgElevated, colors.bgElevated]}
                                    style={styles.sendGradient}
                                >
                                    <Text style={styles.sendIcon}>➤</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </KeyboardAvoidingView>
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
        paddingHorizontal: spacing.md,
        paddingBottom: spacing.md,
        borderBottomWidth: 1,
        borderBottomColor: colors.divider,
        justifyContent: 'space-between',
    },
    backButton: {
        padding: spacing.sm,
        width: 40,
    },
    backText: {
        fontSize: 24,
        color: colors.textSecondary,
    },
    headerContent: {
        alignItems: 'center',
    },
    headerName: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    onlineBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
    },
    onlineDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.success,
        marginRight: 4,
    },
    onlineText: {
        ...typography.micro,
        color: colors.success,
    },
    messagesList: {
        padding: spacing.md,
        paddingBottom: spacing.xl,
    },
    messageRow: {
        marginBottom: spacing.md,
        flexDirection: 'row',
        alignItems: 'flex-end',
    },
    myMessageRow: {
        justifyContent: 'flex-end',
    },
    theirMessageRow: {
        justifyContent: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.bgElevated,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.sm,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    avatarText: {
        fontSize: 16,
    },
    bubble: {
        maxWidth: '75%',
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        ...shadows.sm,
    },
    myBubble: {
        backgroundColor: colors.primary,
        borderBottomRightRadius: 2,
    },
    theirBubble: {
        backgroundColor: colors.bgElevated,
        borderBottomLeftRadius: 2,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    messageText: {
        ...typography.body,
    },
    myMessageText: {
        color: colors.textPrimary,
    },
    theirMessageText: {
        color: colors.textSecondary,
    },
    timestamp: {
        ...typography.micro,
        marginTop: 4,
        alignSelf: 'flex-end',
        opacity: 0.7,
    },
    myTimestamp: {
        color: 'rgba(255, 255, 255, 0.7)',
    },
    theirTimestamp: {
        color: colors.textMuted,
    },
    systemMessage: {
        alignItems: 'center',
        marginVertical: spacing.md,
    },
    systemMessageText: {
        ...typography.small,
        color: colors.textMuted,
        backgroundColor: colors.bgElevated,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: spacing.md,
        backgroundColor: colors.bgSecondary,
        borderTopWidth: 1,
        borderTopColor: colors.divider,
    },
    input: {
        flex: 1,
        backgroundColor: colors.bgElevated,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.lg,
        paddingVertical: spacing.md,
        color: colors.textPrimary,
        marginRight: spacing.md,
        ...typography.body,
    },
    sendButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        ...shadows.md,
    },
    sendButtonDisabled: {
        opacity: 0.5,
    },
    sendGradient: {
        flex: 1,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center',
    },
    sendIcon: {
        color: colors.textPrimary,
        fontSize: 18,
        marginLeft: 2,
    },
});
