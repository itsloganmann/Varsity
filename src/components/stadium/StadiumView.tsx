// Interactive 3D Stadium View
import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Animated,
    Dimensions,
    TouchableOpacity,
} from 'react-native';
import {
    PanGestureHandler,
    PinchGestureHandler,
    State,
    GestureHandlerRootView,
    PanGestureHandlerStateChangeEvent,
    PinchGestureHandlerStateChangeEvent,
} from 'react-native-gesture-handler';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, gradients, shadows } from '../../theme';
import { Friend } from '../../store/friendsStore';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const STADIUM_WIDTH = 800; // Virtual width
const STADIUM_HEIGHT = 600; // Virtual height

interface StadiumViewProps {
    friends: Friend[];
    isUserAtStadium?: boolean;
    userPosition?: { x: number; y: number };
    onFriendPress?: (friend: Friend) => void;
}

// Seat Section Definition
interface Section {
    id: string;
    label: string;
    x: number; // %
    y: number; // %
    width: number; // %
    height: number; // %
    color: string;
    rotation?: number;
}

const SECTIONS: Section[] = [
    // Endzones
    { id: 'N', label: 'North End', x: 25, y: 0, width: 50, height: 15, color: '#cc0000' },
    { id: 'S', label: 'South End', x: 25, y: 85, width: 50, height: 15, color: '#666666' },
    // Sidelines
    { id: 'W', label: 'West Side', x: 0, y: 15, width: 15, height: 70, color: '#990000' },
    { id: 'E', label: 'East Side', x: 85, y: 15, width: 15, height: 70, color: '#990000' },
    // Corners
    { id: 'NW', label: 'Sec A', x: 0, y: 0, width: 25, height: 15, color: '#888888' },
    { id: 'NE', label: 'Sec B', x: 75, y: 0, width: 25, height: 15, color: '#888888' },
    { id: 'SW', label: 'Sec C', x: 0, y: 85, width: 25, height: 15, color: '#888888' },
    { id: 'SE', label: 'Sec D', x: 75, y: 85, width: 25, height: 15, color: '#888888' },
];

const FriendMarker: React.FC<{
    friend: Friend;
    scale: Animated.AnimatedInterpolation<number>;
    onPress?: () => void;
}> = ({ friend, scale, onPress }) => {
    // Inverse scale for markers to keep them readable
    const invalidScale = scale.interpolate({
        inputRange: [0.5, 2],
        outputRange: [1.5, 0.7], // visual compensation
    });

    // Determine position based on section or random
    const pos = friend.stadiumPosition || { x: 50, y: 50 };

    return (
        <Animated.View
            style={[
                styles.markerWrapper,
                {
                    left: `${pos.x}%`,
                    top: `${pos.y}%`,
                    transform: [{ scale: invalidScale }]
                }
            ]}
        >
            <TouchableOpacity onPress={onPress}>
                <View style={[styles.markerAvatar, { borderColor: friend.isOnline ? colors.success : colors.textMuted }]}>
                    <Text style={styles.markerEmoji}>{friend.avatar}</Text>
                </View>
                <View style={styles.markerLabel}>
                    <Text style={styles.markerName}>{friend.name.split(' ')[0]}</Text>
                </View>
            </TouchableOpacity>
        </Animated.View>
    );
};

export const StadiumView: React.FC<StadiumViewProps> = ({
    friends,
    isUserAtStadium,
    userPosition,
    onFriendPress,
}) => {
    // Animation Values
    const translateX = useRef(new Animated.Value(0)).current;
    const translateY = useRef(new Animated.Value(0)).current;
    const scale = useRef(new Animated.Value(1)).current; // Start at 1 (offset handles zoom)

    const lastScale = useRef(0.6); // Start partially zoomed out

    // Init effect
    React.useEffect(() => {
        scale.setOffset(0.6 - 1); // Initial offset to make 1 + offset = 0.6
    }, []);
    const lastOffset = useRef({ x: 0, y: 0 });

    const onPanEvent = Animated.event(
        [{ nativeEvent: { translationX: translateX, translationY: translateY } }],
        { useNativeDriver: false }
    );

    const onPinchEvent = Animated.event(
        [{ nativeEvent: { scale: scale } }],
        { useNativeDriver: false }
    );

    const handlePanStateChange = (event: PanGestureHandlerStateChangeEvent) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            lastOffset.current.x += event.nativeEvent.translationX;
            lastOffset.current.y += event.nativeEvent.translationY;
            translateX.setOffset(lastOffset.current.x);
            translateX.setValue(0);
            translateY.setOffset(lastOffset.current.y);
            translateY.setValue(0);
        }
    };

    const handlePinchStateChange = (event: PinchGestureHandlerStateChangeEvent) => {
        if (event.nativeEvent.oldState === State.ACTIVE) {
            // Accumulate the scale
            lastScale.current *= event.nativeEvent.scale;
            // Clamp total scale
            lastScale.current = Math.max(0.4, Math.min(lastScale.current, 3));

            // Reset the gesture scale to 1, but update the base offset
            scale.setValue(1);
            scale.setOffset(lastScale.current - 1); // Trick: offset + value(1) = lastScale
        }
    };

    return (
        <GestureHandlerRootView style={styles.container}>
            <View style={styles.viewport}>
                <PanGestureHandler
                    onGestureEvent={onPanEvent}
                    onHandlerStateChange={handlePanStateChange}
                    minPointers={1}
                    maxPointers={2}
                >
                    <Animated.View>
                        <PinchGestureHandler
                            onGestureEvent={onPinchEvent}
                            onHandlerStateChange={handlePinchStateChange}
                        >
                            <Animated.View
                                style={[
                                    styles.contentContainer,
                                    {
                                        transform: [
                                            { translateX },
                                            { translateY },
                                            { scale },
                                            { perspective: 1000 },
                                            { rotateX: '15deg' } // 3D tilt
                                        ]
                                    }
                                ]}
                            >
                                {/* Stadium Base */}
                                <View style={styles.stadiumBase}>
                                    {/* Field */}
                                    <View style={styles.field}>
                                        <View style={styles.endZoneTop}><Text style={styles.ezText}>OHIO STATE</Text></View>
                                        <View style={styles.fieldGrass}>
                                            <View style={styles.fiftyLine} />
                                            <View style={[styles.hashBox, { top: '30%' }]} />
                                            <View style={[styles.hashBox, { bottom: '30%' }]} />
                                        </View>
                                        <View style={styles.endZoneBottom}><Text style={styles.ezText}>VISITOR</Text></View>
                                    </View>

                                    {/* Sections */}
                                    {SECTIONS.map((sec) => (
                                        <View
                                            key={sec.id}
                                            style={[
                                                styles.section,
                                                {
                                                    left: `${sec.x}%`,
                                                    top: `${sec.y}%`,
                                                    width: `${sec.width}%`,
                                                    height: `${sec.height}%`,
                                                    backgroundColor: sec.color,
                                                }
                                            ]}
                                        >
                                            <Text style={styles.sectionLabel}>{sec.label}</Text>
                                            <View style={styles.rowLines} />
                                        </View>
                                    ))}

                                    {/* Friends */}
                                    {friends.filter(f => f.isAtStadium).map(friend => (
                                        <FriendMarker
                                            key={friend.id}
                                            friend={friend}
                                            scale={scale}
                                            onPress={() => onFriendPress?.(friend)}
                                        />
                                    ))}

                                    {/* User */}
                                    {isUserAtStadium && (
                                        <Animated.View
                                            style={[
                                                styles.userMarker,
                                                {
                                                    left: '48%',
                                                    top: '48%',
                                                    transform: [{ scale: Animated.divide(1, scale) }]
                                                }
                                            ]}
                                        >
                                            <View style={styles.userDot} />
                                            <View style={styles.userRing} />
                                        </Animated.View>
                                    )}
                                </View>
                            </Animated.View>
                        </PinchGestureHandler>
                    </Animated.View>
                </PanGestureHandler>

                <View style={styles.controls}>
                    <Text style={styles.controlText}>🖐️ Drag • 🤏 Pinch to Zoom</Text>
                </View>
            </View>
        </GestureHandlerRootView>
    );
};

const styles = StyleSheet.create({
    container: {
        height: 350,
        backgroundColor: colors.bgElevated,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        marginVertical: spacing.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    viewport: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    contentContainer: {
        width: STADIUM_WIDTH,
        height: STADIUM_HEIGHT,
        alignItems: 'center',
        justifyContent: 'center',
    },
    stadiumBase: {
        width: '100%',
        height: '100%',
        backgroundColor: '#333',
        borderRadius: 50,
        position: 'relative',
        ...shadows.lg,
    },
    field: {
        position: 'absolute',
        left: '20%',
        top: '20%',
        width: '60%',
        height: '60%',
        backgroundColor: '#4C8527',
        borderRadius: 4,
        borderWidth: 2,
        borderColor: 'white',
        zIndex: 10,
    },
    fieldGrass: {
        flex: 1,
        position: 'relative',
        borderTopWidth: 2,
        borderBottomWidth: 2,
        borderColor: 'white',
    },
    endZoneTop: {
        height: '10%',
        backgroundColor: '#bb0000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    endZoneBottom: {
        height: '10%',
        backgroundColor: '#444',
        alignItems: 'center',
        justifyContent: 'center',
    },
    ezText: {
        fontSize: 14,
        fontWeight: 'bold',
        color: 'white',
        opacity: 0.8,
    },
    fiftyLine: {
        position: 'absolute',
        top: '50%',
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: 'rgba(255,255,255,0.8)',
    },
    hashBox: {
        position: 'absolute',
        left: '30%',
        right: '30%',
        height: 1,
        borderTopWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        borderStyle: 'dashed',
    },
    section: {
        position: 'absolute',
        borderRadius: 4,
        padding: 4,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    sectionLabel: {
        color: 'white',
        fontSize: 14,
        fontWeight: '900',
        textShadowColor: 'black',
        textShadowRadius: 2,
    },
    rowLines: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: 'transparent',
    },

    // Markers
    markerWrapper: {
        position: 'absolute',
        zIndex: 50,
        marginLeft: -15,
        marginTop: -30,
    },
    markerAvatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
    },
    markerEmoji: {
        fontSize: 16,
    },
    markerLabel: {
        backgroundColor: 'rgba(0,0,0,0.7)',
        paddingHorizontal: 4,
        borderRadius: 4,
        marginTop: 2,
    },
    markerName: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },

    // User Marker
    userMarker: {
        position: 'absolute',
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
    },
    userDot: {
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: colors.primary,
        borderWidth: 2,
        borderColor: 'white',
    },
    userRing: {
        position: 'absolute',
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: colors.primary,
        opacity: 0.5,
    },

    controls: {
        position: 'absolute',
        bottom: 12,
        right: 12,
        backgroundColor: 'rgba(0,0,0,0.6)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 12,
    },
    controlText: {
        color: 'white',
        fontSize: 10,
        fontWeight: '600',
    },
});
