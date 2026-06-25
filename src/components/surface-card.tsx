import type { PropsWithChildren } from 'react';
import type { StyleProp, ViewStyle } from 'react-native';
import { StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/theme/provider';

interface SurfaceCardProps extends PropsWithChildren {
  style?: StyleProp<ViewStyle>;
}

export function SurfaceCard({ children, style }: SurfaceCardProps) {
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.primary,
          borderRadius: theme.layout.radius,
        },
        style,
      ]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
});
