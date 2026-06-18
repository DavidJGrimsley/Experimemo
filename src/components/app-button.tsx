import type { StyleProp, TextStyle, ViewStyle } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/theme/provider';

import { AppText } from './app-text';

interface AppButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'filled' | 'outlined';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export function AppButton({
  label,
  onPress,
  disabled = false,
  variant = 'filled',
  style,
  textStyle,
}: AppButtonProps) {
  const theme = useAppTheme();
  const colors = theme.activeColors;
  const isOutlined = variant === 'outlined';
  const surfaceStyle = StyleSheet.flatten([
    styles.surface,
    {
      backgroundColor: isOutlined ? colors.background : colors.primary,
      borderColor: colors.primary,
      borderRadius: 999,
      borderWidth: isOutlined ? 1 : 0,
      opacity: disabled ? 0.65 : 1,
    },
    style,
  ]);
  const pressableStyle = StyleSheet.flatten([
    styles.pressable,
    style,
    {
      backgroundColor: 'transparent',
      borderColor: 'transparent',
      borderWidth: 0,
      opacity: disabled ? 0.65 : 1,
      paddingHorizontal: 0,
      paddingVertical: 0,
    },
  ]);

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={pressableStyle}>
      <View pointerEvents="none" style={surfaceStyle}>
        <AppText
          style={[
            styles.label,
            {
              color: isOutlined ? colors.text : '#ffffff',
              fontFamily: theme.typography.fontBody,
            },
            textStyle,
          ]}>
          {label}
        </AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  pressable: {
    alignSelf: 'flex-start',
  },
  surface: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 48,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '800',
    lineHeight: 18,
  },
});
