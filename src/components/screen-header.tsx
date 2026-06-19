import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { useAppTheme } from '@/theme/provider';
import { AppText } from './app-text';

interface ScreenHeaderProps {
  title: string;
  subtitle?: string;
  eyebrow?: string;
  showInfoAction?: boolean;
  titleNumberOfLines?: number;
  rightAccessory?: ReactNode;
}

export function ScreenHeader({
  title,
  subtitle,
  eyebrow,
  showInfoAction = false,
  titleNumberOfLines,
  rightAccessory,
}: ScreenHeaderProps) {
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <View style={styles.header}>
      <View style={styles.headerTopRow}>
        <View style={styles.headerTextWrap}>
          {eyebrow ? (
            <AppText
              style={{
                color: colors.primary,
                fontFamily: theme.typography.fontFamily,
                fontSize: 12,
                fontWeight: '800',
                letterSpacing: 1,
              }}>
              {eyebrow.toUpperCase()}
            </AppText>
          ) : null}
          <AppText
            numberOfLines={titleNumberOfLines}
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontFamily,
              fontSize: 28,
              fontWeight: '800',
              lineHeight: 34,
            }}>
            {title}
          </AppText>
        </View>

        {rightAccessory ? (
          rightAccessory
        ) : showInfoAction ? (
          <Link href="/modal" asChild>
            <Pressable
              accessibilityLabel="Open app info and settings"
              accessibilityRole="button"
              style={StyleSheet.flatten([
                styles.infoButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.primary,
                },
              ])}>
              <Ionicons color={colors.text} name="information-circle-outline" size={22} />
            </Pressable>
          </Link>
        ) : null}
      </View>

      {subtitle ? (
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 15,
            lineHeight: 22,
          }}>
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  headerTextWrap: {
    flex: 1,
    gap: 4,
  },
  headerTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  infoButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
});
