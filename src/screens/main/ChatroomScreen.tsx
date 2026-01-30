// Live Stadium Chatroom Screen
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    KeyboardAvoidingView,
    Modal,
    Platform,
    Animated,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors, spacing, borderRadius, typography, gradients } from '../../theme';
import { Badge } from '../../components/common';
import { useLocationStore } from '../../store/locationStore';
import { useFriendsStore } from '../../store/friendsStore';

interface Props {
    navigation: any;
}

interface ChatMessage {
    id: string;
    sender: string;
    avatar: string;
    content: string;
    timestamp: Date;
    isCurrentUser?: boolean;
}

// Simulated chat messages
const MOCK_MESSAGES: Omit<ChatMessage, 'id' | 'timestamp'>[] = [
    { sender: 'Jake', avatar: '👨‍🎓', content: 'LETS GOOOO! 🔥' },
    { sender: 'Sarah', avatar: '👩‍🎓', content: 'OSU looking strong today!' },
    { sender: 'Mike', avatar: '🧑‍💼', content: 'Who else is in Block O?' },
    { sender: 'Emma', avatar: '👩‍🦰', content: 'This atmosphere is INSANE 🏟️' },
    { sender: 'Jake', avatar: '👨‍🎓', content: 'That last play was crazy!' },
    { sender: 'Alex', avatar: '🧑‍🎤', content: 'O-H!' },
    { sender: 'Multiple', avatar: '👥', content: 'I-O! 📣' },
    { sender: 'Sarah', avatar: '👩‍🎓', content: 'Defense holding strong 💪' },
    { sender: 'Mike', avatar: '🧑‍💼', content: 'Anyone at the concession stand?' },
    { sender: 'Emma', avatar: '👩‍🦰', content: 'Halftime predictions?' },
];

export const ChatroomScreen: React.FC<Props> = ({ navigation }) => {
    const { isAtStadium, stadiumName } = useLocationStore();
    const { friends } = useFriendsStore();
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputText, setInputText] = useState('');
    const scrollRef = useRef<ScrollView>(null);
    const [activeUsers] = useState(Math.floor(Math.random() * 500) + 200);
    const [showFansModal, setShowFansModal] = useState(false);

    // Simulate incoming messages
    useEffect(() => {
        // Add initial messages
        const initialMessages: ChatMessage[] = MOCK_MESSAGES.slice(0, 3).map((msg, i) => ({
            ...msg,
            id: `msg-${i}`,
            timestamp: new Date(Date.now() - (3 - i) * 60000),
        }));
        setMessages(initialMessages);

        // Add new messages periodically
        let msgIndex = 3;
        const interval = setInterval(() => {
            if (msgIndex < MOCK_MESSAGES.length) {
                const newMsg: ChatMessage = {
                    ...MOCK_MESSAGES[msgIndex],
                    id: `msg-${msgIndex}`,
                    timestamp: new Date(),
                };
                setMessages(prev => [...prev, newMsg]);
                msgIndex++;
            }
        }, 4000);

        return () => clearInterval(interval);
    }, []);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        setTimeout(() => {
            scrollRef.current?.scrollToEnd({ animated: true });
        }, 100);
    }, [messages]);

    const handleSend = () => {
        if (!inputText.trim()) return;

        const newMessage: ChatMessage = {
            id: `user-${Date.now()}`,
            sender: 'You',
            avatar: '🎓',
            content: inputText,
            timestamp: new Date(),
            isCurrentUser: true,
        };

        setMessages(prev => [...prev, newMessage]);
        setInputText('');
    };

    const formatTime = (date: Date) => {
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    };

    const friendsAtStadium = friends.filter(f => f.isAtStadium).length;

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
                        <View style={styles.headerContent}>
                            <View style={styles.headerRow}>
                                <Text style={styles.title}>Stadium Chat</Text>
                                <Badge text="🔴 LIVE" variant="error" />
                            </View>
                            <Text style={styles.subtitle}>
                                {stadiumName || 'Ohio Stadium'} • <Text onPress={() => setShowFansModal(true)} style={{ textDecorationLine: 'underline' }}>
                                    {activeUsers} fans online
                                </Text>
                            </Text>
                        </View>
                    </View>

                    <Modal
                        visible={showFansModal}
                        transparent
                        animationType="fade"
                        onRequestClose={() => setShowFansModal(false)}
                    >
                        <View style={styles.modalOverlay}>
                            <View style={styles.fansModalContent}>
                                <View style={styles.modalHeader}>
                                    <Text style={styles.modalTitle}>Active Fans ({friendsAtStadium} Friends)</Text>
                                    <TouchableOpacity onPress={() => setShowFansModal(false)}>
                                        <Text style={styles.modalClose}>✕</Text>
                                    </TouchableOpacity>
                                </View>
                                <ScrollView contentContainerStyle={styles.fansList}>
                                    {friends.filter(f => f.isAtStadium).map(friend => (
                                        <View key={friend.id} style={styles.fanRow}>
                                            <Text style={styles.fanAvatar}>{friend.avatar}</Text>
                                            <View>
                                                <Text style={styles.fanName}>{friend.name}</Text>
                                                <Text style={styles.fanSection}>📍 {friend.stadiumSection || 'In Stadium'}</Text>
                                            </View>
                                            <Badge text="Online" variant="success" />
                                        </View>
                                    ))}
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <View key={`anon-${i}`} style={styles.fanRow}>
                                            <Text style={styles.fanAvatar}>👤</Text>
                                            <View>
                                                <Text style={styles.fanName}>Fan #{Math.floor(Math.random() * 9000) + 1000}</Text>
                                                <Text style={styles.fanSection}>📍 Section {Math.floor(Math.random() * 30)}C</Text>
                                            </View>
                                        </View>
                                    ))}
                                </ScrollView>
                            </View>
                        </View>
                    </Modal>

                    {/* Stadium Indicator */}
                    {!isAtStadium && (
                        <View style={styles.notAtStadiumBanner}>
                            <Text style={styles.bannerText}>
                                📍 You're viewing as spectator. Go to stadium for full access!
                            </Text>
                        </View>
                    )}

                    {/* Friends at Stadium */}
                    {friendsAtStadium > 0 && (
                        <View style={styles.friendsBanner}>
                            <Text style={styles.friendsBannerText}>
                                👥 {friendsAtStadium} friends at the game
                            </Text>
                        </View>
                    )}

                    {/* Messages */}
                    <KeyboardAvoidingView
                        style={styles.chatContainer}
                        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                        keyboardVerticalOffset={100}
                    >
                        <ScrollView
                            ref={scrollRef}
                            style={styles.messagesList}
                            contentContainerStyle={styles.messagesContent}
                            showsVerticalScrollIndicator={false}
                        >
                            {messages.map((msg) => (
                                <View
                                    key={msg.id}
                                    style={[
                                        styles.messageRow,
                                        msg.isCurrentUser && styles.messageRowSelf,
                                    ]}
                                >
                                    {!msg.isCurrentUser && (
                                        <Text style={styles.messageAvatar}>{msg.avatar}</Text>
                                    )}
                                    <View style={[
                                        styles.messageBubble,
                                        msg.isCurrentUser && styles.messageBubbleSelf,
                                    ]}>
                                        {!msg.isCurrentUser && (
                                            <Text style={styles.messageSender}>{msg.sender}</Text>
                                        )}
                                        <Text style={styles.messageText}>{msg.content}</Text>
                                        <Text style={styles.messageTime}>{formatTime(msg.timestamp)}</Text>
                                    </View>
                                </View>
                            ))}
                        </ScrollView>

                        {/* Input */}
                        <View style={styles.inputContainer}>
                            <TextInput
                                style={styles.input}
                                placeholder="Message the crowd..."
                                placeholderTextColor={colors.textMuted}
                                value={inputText}
                                onChangeText={setInputText}
                                onSubmitEditing={handleSend}
                                returnKeyType="send"
                            />
                            <TouchableOpacity
                                style={styles.sendButton}
                                onPress={handleSend}
                            >
                                <Text style={styles.sendText}>Send</Text>
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
        paddingHorizontal: spacing.lg,
        paddingBottom: spacing.sm,
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
    headerContent: {},
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.sm,
    },
    title: {
        ...typography.h2,
        color: colors.textPrimary,
    },
    subtitle: {
        ...typography.caption,
        color: colors.textSecondary,
        marginTop: 2,
    },
    notAtStadiumBanner: {
        backgroundColor: colors.warning + '20',
        padding: spacing.sm,
        marginHorizontal: spacing.lg,
        marginTop: spacing.sm,
        borderRadius: borderRadius.md,
    },
    bannerText: {
        ...typography.caption,
        color: colors.warning,
        textAlign: 'center',
    },
    friendsBanner: {
        backgroundColor: colors.primary + '20',
        padding: spacing.sm,
        marginHorizontal: spacing.lg,
        marginTop: spacing.sm,
        borderRadius: borderRadius.md,
    },
    friendsBannerText: {
        ...typography.caption,
        color: colors.primary,
        textAlign: 'center',
    },
    chatContainer: {
        flex: 1,
    },
    messagesList: {
        flex: 1,
    },
    messagesContent: {
        padding: spacing.lg,
    },
    messageRow: {
        flexDirection: 'row',
        marginBottom: spacing.md,
        alignItems: 'flex-end',
    },
    messageRowSelf: {
        justifyContent: 'flex-end',
    },
    messageAvatar: {
        fontSize: 24,
        marginRight: spacing.sm,
    },
    messageBubble: {
        backgroundColor: colors.bgCard,
        padding: spacing.md,
        borderRadius: borderRadius.lg,
        borderBottomLeftRadius: 4,
        maxWidth: '75%',
    },
    messageBubbleSelf: {
        backgroundColor: colors.primary,
        borderBottomLeftRadius: borderRadius.lg,
        borderBottomRightRadius: 4,
    },
    messageSender: {
        ...typography.caption,
        color: colors.primary,
        fontWeight: '600',
        marginBottom: 2,
    },
    messageText: {
        ...typography.body,
        color: colors.textPrimary,
    },
    messageTime: {
        ...typography.micro,
        color: colors.textMuted,
        marginTop: 4,
        alignSelf: 'flex-end',
    },
    inputContainer: {
        flexDirection: 'row',
        padding: spacing.md,
        paddingBottom: spacing.lg,
        borderTopWidth: 1,
        borderTopColor: colors.cardBorder,
        backgroundColor: colors.bgSecondary,
    },
    input: {
        flex: 1,
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        color: colors.textPrimary,
        ...typography.body,
        marginRight: spacing.sm,
    },
    sendButton: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        justifyContent: 'center',
    },
    sendText: {
        ...typography.bodyBold,
        // color: colors.textPrimary, // Already in bodyBold
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: colors.overlay,
        justifyContent: 'center',
        padding: spacing.lg,
    },
    fansModalContent: {
        backgroundColor: colors.bgSecondary,
        borderRadius: borderRadius.lg,
        height: '60%',
        padding: spacing.md,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
        paddingBottom: spacing.sm,
        borderBottomWidth: 1,
        borderBottomColor: colors.cardBorder,
    },
    modalTitle: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    modalClose: {
        fontSize: 20,
        color: colors.textMuted,
    },
    fansList: {
        gap: spacing.md,
    },
    fanRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.md,
    },
    fanAvatar: {
        fontSize: 24,
        width: 40,
        textAlign: 'center',
    },
    fanName: {
        ...typography.bodyBold,
        color: colors.textPrimary,
    },
    fanSection: {
        ...typography.caption,
        color: colors.textSecondary,
    },
});
