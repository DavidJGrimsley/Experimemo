import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { SurfaceCard } from '@/components/surface-card';
import { useAppTheme } from '@/theme/provider';

export default function AccountSetupScreen() {
  const router = useRouter();
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.screen, { backgroundColor: colors.background }]}>
      <AppText
        style={{
          color: colors.text,
          fontFamily: theme.typography.fontFamily,
          fontSize: 26,
          fontWeight: '800',
        }}>
        You are ready to start
      </AppText>
      <AppText
        style={{
          color: colors.text,
          fontFamily: theme.typography.fontBody,
          fontSize: 15,
          lineHeight: 22,
        }}>
        Head back into the app to begin creating and tracking your experiments.
      </AppText>
      <SurfaceCard>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 17,
            fontWeight: '800',
          }}>
          Next step
        </AppText>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 14,
            lineHeight: 20,
          }}>
          Create a new experiment or open Track to keep working on something you already saved.
        </AppText>
      </SurfaceCard>
      <AppButton
        label="Open experiments"
        onPress={() => router.replace('/')}
        style={{ backgroundColor: colors.primary, borderRadius: 12 }}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    padding: 20,
    paddingBottom: 28,
  },
  screen: {
    flex: 1,
  },
});
