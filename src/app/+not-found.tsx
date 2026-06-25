import { router, Stack } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { useAppTheme } from '@/theme/provider';

export default function NotFoundScreen() {
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <>
      <Stack.Screen options={{ title: 'Not found' }} />
      <View style={[styles.screen, { backgroundColor: colors.background }]}>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontFamily,
            fontSize: 28,
            fontWeight: '800',
          }}>
          This screen does not exist
        </AppText>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 15,
            lineHeight: 22,
            textAlign: 'center',
          }}>
          Head back to the main app to create or track your experiments.
        </AppText>
        <AppButton
          label="Go home"
          onPress={() => router.replace('/')}
          style={{ backgroundColor: colors.primary, borderRadius: 12 }}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    alignItems: 'center',
    flex: 1,
    gap: 12,
    justifyContent: 'center',
    padding: 20,
  },
});
