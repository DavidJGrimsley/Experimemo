import '../../global.css';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import { Platform, StatusBar, useColorScheme } from 'react-native';
import { NavigationBar } from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import themeFontAssets from '../theme/font-assets';
import { AppThemeProvider, useAppTheme } from '../theme/provider';

function RouterThemeBridge({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  const systemScheme = useColorScheme();
  const prefersDark =
    theme.colorSystem.mode === 'automatic'
      ? systemScheme === 'dark'
      : theme.colorSystem.previewScheme === 'dark';
  const base = prefersDark ? DarkTheme : DefaultTheme;
  const shellColor = theme.activeColors.background;
  const routerTheme = useMemo(
    () => ({
      ...base,
      colors: {
        ...base.colors,
        background: shellColor,
        border: theme.activeColors.surface,
        card: shellColor,
        notification: theme.activeColors.warning,
        primary: theme.activeColors.primary,
        text: theme.activeColors.text,
      },
    }),
    [base, shellColor, theme.activeColors]
  );

  useEffect(() => {
    void SystemUI.setBackgroundColorAsync?.(shellColor);
  }, [shellColor]);

  return <ThemeProvider value={routerTheme}>{children}</ThemeProvider>;
}

function LayoutInner() {
  const theme = useAppTheme();
  const shellColor = theme.activeColors.background;
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: shellColor }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <RouterThemeBridge>
            <StatusBar
              backgroundColor={shellColor}
              barStyle={
                theme.colorSystem.previewScheme === 'dark' ? 'light-content' : 'dark-content'
              }
              translucent={false}
            />
            {Platform.OS === 'android' ? (
              <NavigationBar
                style={theme.colorSystem.previewScheme === 'dark' ? 'dark' : 'light'}
              />
            ) : null}
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: shellColor },
                headerShown: Platform.OS !== 'web',
              }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="experiment/[id]" options={{ title: 'Experiment' }} />
              <Stack.Screen name="onboarding" options={{ title: 'Onboarding' }} />
              <Stack.Screen name="onboarding/agreement" options={{ title: 'Agreement' }} />
              <Stack.Screen name="onboarding/terms" options={{ title: 'Terms Of Service' }} />
              <Stack.Screen name="onboarding/account-setup" options={{ title: 'Account Setup' }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            </Stack>
          </RouterThemeBridge>
        </SafeAreaProvider>
      </KeyboardProvider>
    </GestureHandlerRootView>
  );
}

export default function Layout() {
  const hasFontAssets = Object.keys(themeFontAssets).length > 0;
  const [fontsLoaded, fontsError] = useFonts(themeFontAssets);

  if (hasFontAssets && !fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <AppThemeProvider>
      <LayoutInner />
    </AppThemeProvider>
  );
}
