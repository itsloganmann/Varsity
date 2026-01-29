// 3D Stadium View with animated friend markers
import React, { useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, gradients, shadows } from '../../theme';
import { Friend } from '../../store/friendsStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STADIUM_WIDTH = SCREEN_WIDTH - spacing.lg * 2;
const STADIUM_HEIGHT = 200;

interface StadiumViewProps {
    friends: Friend[];
    isUserAtStadium?: boolean;
    userPosition?: { x: number; y: number };
    onFriendPress?: (friend: Friend) => void;
}

// Animated pulsing marker for friends
const FriendMarker: React.FC<{
    friend: Friend;
    onPress?: () => void;
}> = ({ friend, onPress }) => {
    const pulseAnim = useRef(new Animated.Value(1)).current;
    const glowAnim = useRef(new Animated.Value(0.5)).current;

    useEffect(() => {
        // Continuous pulse animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(pulseAnim, {
                    toValue: 1.3,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(pulseAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
            ])
        ).start();

        // Glow animation
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1500,
                    useNativeDriver: true,
                }),
                Animated.timing(glowAnim, {
                    toValue: 0.5,
                    duration: 1500,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, []);

    const position = friend.stadiumPosition || { x: 50, y: 50 };

    return (
        <TouchableOpacity
            style={[
                styles.markerContainer,
                {
                    left: `${position.x}%`,
                    top: `${position.y}%`,
                },
            ]}
            onPress={onPress}
        >
            {/* Pulse ring */}
            <Animated.View
                style={[
                    styles.markerPulse,
                    {
                        transform: [{ scale: pulseAnim }],
                        opacity: glowAnim,
                    },
                ]}
            />
            {/* Avatar */}
            <View style={styles.markerAvatar}>
                <Text style={styles.markerEmoji}>{friend.avatar}</Text>
            </View>
            {/* Name label */}
            <View style={styles.markerLabel}>
                <Text style={styles.markerName}>{friend.name.split(' ')[0]}</Text>
            </View>
        </TouchableOpacity>
    );
};

export const StadiumView: React.FC<StadiumViewProps> = ({
    friends,
    isUserAtStadium,
    userPosition,
    onFriendPress,
}) => {
    const friendsAtStadium = friends.filter(f => f.isAtStadium && f.stadiumPosition);

    return (
        <View style={styles.container}>
            {/* Stadium outline with 3D effect */}
            <View style={styles.stadiumWrapper}>
                <LinearGradient
                    colors={gradients.stadium}
                    style={styles.stadium}
                >
                    {/* Stadium 3D border effect */}
                    <View style={styles.stadiumBorder} />

                    {/* Field markings */}
                    <View style={styles.field}>
                        {/* End zones */}
                        <View style={styles.endZoneLeft}>
                            <Text style={styles.endZoneText}>OSU</Text>
                        </View>
                        <View style={styles.endZoneRight}>
                            <Text style={styles.endZoneText}>VISITOR</Text>
                        </View>

                        {/* Yard lines */}
                        <View style={styles.yardLines}>
                            {[10, 20, 30, 40, 50, 40, 30, 20, 10].map((yard, i) => (
                                <View key={i} style={styles.yardLine}>
                                    <View style={styles.yardLineInner} />
                                </View>
                            ))}
                        </View>

                        {/* Center circle */}
                        <View style={styles.centerCircle} />
                    </View>

                    {/* Stands (curved top and bottom) */}
                    <View style={styles.standsTop}>
                        <LinearGradient
                            colors={['rgba(204, 0, 0, 0.3)', 'rgba(102, 0, 0, 0.2)']}
                            style={styles.standsGradient}
                        />
                    </View>
                    <View style={styles.standsBottom}>
                        <LinearGradient
                            colors={['rgba(204, 0, 0, 0.3)', 'rgba(102, 0, 0, 0.2)']}
                            style={styles.standsGradient}
                        />
                    </View>

                    {/* Friend markers */}
                    {friendsAtStadium.map(friend => (
                        <FriendMarker
                            key={friend.id}
                            friend={friend}
                            onPress={() => onFriendPress?.(friend)}
                        />
                    ))}

                    {/* User marker (if at stadium) */}
                    {isUserAtStadium && userPosition && (
                        <View
                            style={[
                                styles.userMarker,
                                {
                                    left: `${userPosition.x}%`,
                                    top: `${userPosition.y}%`,
                                },
                            ]}
                        >
                            <View style={styles.userMarkerRing}>
                                <Text style={styles.userMarkerText}>You</Text>
                            </View>
                        </View>
                    )}
                </LinearGradient>

                {/* Stadium label */}
                <View style={styles.stadiumLabel}>
                    <Text style={styles.stadiumName}>Ohio Stadium</Text>
                    <View style={styles.liveDot} />
                    <Text style={styles.liveText}>LIVE</Text>
                </View>
            </View>

            {/* Legend */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.legendDot, { backgroundColor: colors.boostActive }]} />
                    <Text style={styles.legendText}>{friendsAtStadium.length} friends here</Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginVertical: spacing.md,
    },
    stadiumWrapper: {
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        ...shadows.lg,
    },
    stadium: {
        width: STADIUM_WIDTH,
        height: STADIUM_HEIGHT,
        position: 'relative',
        borderRadius: borderRadius.xl,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    stadiumBorder: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: borderRadius.xl - 2,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.05)',
    },
    field: {
        position: 'absolute',
        top: '25%',
        left: '10%',
        right: '10%',
        bottom: '25%',
        backgroundColor: 'rgba(45, 90, 39, 0.8)',
        borderRadius: borderRadius.sm,
        borderWidth: 2,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    endZoneLeft: {
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '10%',
        backgroundColor: 'rgba(204, 0, 0, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    endZoneRight: {
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '10%',
        backgroundColor: 'rgba(102, 102, 102, 0.5)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    endZoneText: {
        ...typography.micro,
        color: 'rgba(255, 255, 255, 0.6)',
        transform: [{ rotate: '-90deg' }],
    },
    yardLines: {
        position: 'absolute',
        left: '10%',
        right: '10%',
        top: 0,
        bottom: 0,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    yardLine: {
        width: 1,
        height: '100%',
        alignItems: 'center',
    },
    yardLineInner: {
        width: 1,
        height: '100%',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
    },
    centerCircle: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        width: 20,
        height: 20,
        marginLeft: -10,
        marginTop: -10,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.3)',
    },
    standsTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '22%',
    },
    standsBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '22%',
    },
    standsGradient: {
        flex: 1,
    },
    markerContainer: {
        position: 'absolute',
        alignItems: 'center',
        marginLeft: -18,
        marginTop: -18,
    },
    markerPulse: {
        position: 'absolute',
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.boostActive,
        opacity: 0.3,
    },
    markerAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: colors.bgCard,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: colors.boostActive,
        ...shadows.glowOrange,
    },
    markerEmoji: {
        fontSize: 16,
    },
    markerLabel: {
        marginTop: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        paddingHorizontal: 4,
        paddingVertical: 1,
        borderRadius: 4,
    },
    markerName: {
        ...typography.micro,
        color: colors.textPrimary,
        fontSize: 8,
    },
    userMarker: {
        position: 'absolute',
        alignItems: 'center',
        marginLeft: -20,
        marginTop: -20,
    },
    userMarkerRing: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: colors.textPrimary,
        ...shadows.glow,
    },
    userMarkerText: {
        ...typography.micro,
        color: colors.textPrimary,
        fontWeight: '700',
    },
    stadiumLabel: {
        position: 'absolute',
        top: spacing.sm,
        left: spacing.sm,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xxs,
        borderRadius: borderRadius.full,
    },
    stadiumName: {
        ...typography.micro,
        color: colors.textPrimary,
        marginRight: spacing.xs,
    },
    liveDot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: colors.error,
        marginRight: 4,
    },
    liveText: {
        ...typography.micro,
        color: colors.error,
        fontSize: 8,
    },
    legend: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: spacing.sm,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    legendDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: spacing.xs,
    },
    legendText: {
        ...typography.small,
        color: colors.textSecondary,
    },
});
