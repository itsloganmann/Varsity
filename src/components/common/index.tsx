// Reusable UI components
import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    ViewStyle,
    TextStyle,
    StyleProp,
    Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, spacing, borderRadius, typography, shadows, gradients } from '../../theme';

// Primary Button with gradient
interface ButtonProps {
    title: string;
    onPress: () => void;
    disabled?: boolean;
    loading?: boolean;
    variant?: 'primary' | 'secondary' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    style?: StyleProp<ViewStyle>;
}

export const Button: React.FC<ButtonProps> = ({
    title,
    onPress,
    disabled = false,
    loading = false,
    variant = 'primary',
    size = 'md',
    style,
}) => {
    const sizeStyles = {
        sm: { paddingVertical: 8, paddingHorizontal: 16 },
        md: { paddingVertical: 14, paddingHorizontal: 24 },
        lg: { paddingVertical: 18, paddingHorizontal: 32 },
    };

    if (variant === 'primary') {
        return (
            <TouchableOpacity
                onPress={onPress}
                disabled={disabled || loading}
                style={[{ opacity: disabled ? 0.5 : 1 }, style as ViewStyle]}
                activeOpacity={0.8}
            >
                <LinearGradient
                    colors={gradients.primary}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={[styles.button, sizeStyles[size], shadows.md]}
                >
                    {loading ? (
                        <ActivityIndicator color={colors.textPrimary} />
                    ) : (
                        <Text style={styles.buttonText}>{title}</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        );
    }

    return (
        <TouchableOpacity
            onPress={onPress}
            disabled={disabled || loading}
            style={[
                styles.button,
                sizeStyles[size],
                variant === 'outline' ? styles.outlineButton : styles.secondaryButton,
                { opacity: disabled ? 0.5 : 1 },
                style as ViewStyle,
            ]}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator color={colors.textPrimary} />
            ) : (
                <Text style={[styles.buttonText, variant === 'outline' && styles.outlineText]}>
                    {title}
                </Text>
            )}
        </TouchableOpacity>
    );
};

// Card component
interface CardProps {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    gradient?: boolean;
    onPress?: () => void;
}

export const Card: React.FC<CardProps> = ({ children, style, gradient = false, onPress }) => {
    const content = gradient ? (
        <LinearGradient
            colors={gradients.dark}
            style={[styles.card, style]}
        >
            {children}
        </LinearGradient>
    ) : (
        <View style={[styles.card, style]}>{children}</View>
    );

    if (onPress) {
        return (
            <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
                {content}
            </TouchableOpacity>
        );
    }

    return content;
};

// Coin display
interface CoinBalanceProps {
    amount: number;
    size?: 'sm' | 'md' | 'lg';
    showLabel?: boolean;
}

export const CoinBalance: React.FC<CoinBalanceProps> = ({
    amount,
    size = 'md',
    showLabel = false,
}) => {
    const sizes = {
        sm: { icon: 16, text: 14 },
        md: { icon: 20, text: 18 },
        lg: { icon: 28, text: 24 },
    };

    return (
        <View style={styles.coinContainer}>
            <Image
                source={require('../../../assets/silver-coin.png')}
                style={{ width: sizes[size].icon, height: sizes[size].icon, borderRadius: sizes[size].icon / 2 }}
                resizeMode="contain"
            />
            <Text style={[styles.coinAmount, { fontSize: sizes[size].text }]}>
                {amount.toLocaleString()}
            </Text>
            {showLabel && <Text style={styles.coinLabel}>coins</Text>}
        </View>
    );
};

// Badge component
interface BadgeProps {
    text: string;
    variant?: 'success' | 'warning' | 'error' | 'info' | 'boost';
}

export const Badge: React.FC<BadgeProps> = ({ text, variant = 'info' }) => {
    const variantColors = {
        success: colors.success,
        warning: colors.warning,
        error: colors.error,
        info: colors.info,
        boost: colors.boostActive,
    };

    return (
        <View style={[styles.badge, { backgroundColor: variantColors[variant] + '20' }]}>
            <Text style={[styles.badgeText, { color: variantColors[variant] }]}>{text}</Text>
        </View>
    );
};

// Avatar component
interface AvatarProps {
    name: string;
    imageUrl?: string;
    size?: number;
    rank?: number;
}

export const Avatar: React.FC<AvatarProps> = ({ name, imageUrl, size = 40, rank }) => {
    const initials = name
        .split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    const rankColors = {
        1: colors.gold,
        2: colors.silver,
        3: colors.bronze,
    };

    return (
        <View style={{ position: 'relative' }}>
            <View
                style={[
                    styles.avatar,
                    {
                        width: size,
                        height: size,
                        borderRadius: size / 2,
                        borderColor: rank && rank <= 3 ? rankColors[rank as 1 | 2 | 3] : 'transparent',
                        borderWidth: rank && rank <= 3 ? 2 : 0,
                    },
                ]}
            >
                <Text style={[styles.avatarText, { fontSize: size / 2.5 }]}>{initials}</Text>
            </View>
            {rank && rank <= 3 && (
                <View style={[styles.rankBadge, { backgroundColor: rankColors[rank as 1 | 2 | 3] }]}>
                    <Text style={styles.rankText}>{rank}</Text>
                </View>
            )}
        </View>
    );
};

// Section Header
interface SectionHeaderProps {
    title: string;
    action?: string;
    onAction?: () => void;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({ title, action, onAction }) => (
    <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {action && (
            <TouchableOpacity onPress={onAction}>
                <Text style={styles.sectionAction}>{action}</Text>
            </TouchableOpacity>
        )}
    </View>
);

const styles = StyleSheet.create({
    button: {
        borderRadius: borderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        color: colors.textPrimary,
        ...typography.bodyBold,
    },
    secondaryButton: {
        backgroundColor: colors.bgCard,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: colors.primary,
    },
    outlineText: {
        color: colors.primary,
    },
    card: {
        backgroundColor: colors.bgCard,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        borderWidth: 1,
        borderColor: colors.cardBorder,
    },
    coinContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: spacing.xs,
    },
    coinAmount: {
        color: 'white',
        fontWeight: '700',
    },
    coinLabel: {
        color: colors.textMuted,
        fontSize: 12,
        marginLeft: 2,
    },
    badge: {
        paddingHorizontal: spacing.sm,
        paddingVertical: spacing.xs,
        borderRadius: borderRadius.full,
    },
    badgeText: {
        fontSize: 12,
        fontWeight: '600',
    },
    avatar: {
        backgroundColor: colors.bgElevated,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarText: {
        color: colors.textPrimary,
        fontWeight: '600',
    },
    rankBadge: {
        position: 'absolute',
        bottom: -2,
        right: -2,
        width: 18,
        height: 18,
        borderRadius: 9,
        alignItems: 'center',
        justifyContent: 'center',
    },
    rankText: {
        color: colors.bgPrimary,
        fontSize: 10,
        fontWeight: '700',
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: spacing.md,
    },
    sectionTitle: {
        ...typography.h3,
        color: colors.textPrimary,
    },
    sectionAction: {
        color: colors.primary,
        ...typography.bodyBold,
    },
});
