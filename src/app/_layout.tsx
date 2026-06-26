import '../../global.css';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { Platform, StatusBar } from 'react-native';
import { NavigationBar } from 'expo-navigation-bar';
import * as SystemUI from 'expo-system-ui';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { KeyboardProvider } from 'react-native-keyboard-controller';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import themeFontAssets from '../theme/font-assets';
import { AppThemeProvider, useAppTheme } from '../theme/provider';

void SplashScreen.preventAutoHideAsync();

function RouterThemeBridge({ children }: { children: ReactNode }) {
  const theme = useAppTheme();
  const isDark = theme.activeScheme === 'dark';
  const base = isDark ? DarkTheme : DefaultTheme;
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
  const isDark = theme.activeScheme === 'dark';
  const shellColor = theme.activeColors.background;
  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: shellColor }}>
      <KeyboardProvider>
        <SafeAreaProvider>
          <RouterThemeBridge>
            <StatusBar
              backgroundColor={shellColor}
              barStyle={isDark ? 'light-content' : 'dark-content'}
              translucent={false}
            />
            {Platform.OS === 'android' ? <NavigationBar style={isDark ? 'light' : 'dark'} /> : null}
            <Stack
              screenOptions={{
                contentStyle: { backgroundColor: shellColor },
                headerLargeTitleEnabled: false,
                headerShown: Platform.OS !== 'web',
                headerStyle: { backgroundColor: shellColor },
                headerTitleStyle: {
                  fontSize: 18,
                  fontWeight: '700',
                },
                ...(Platform.OS === 'android'
                  ? {
                      statusBarBackgroundColor: shellColor,
                      statusBarTranslucent: false,
                    }
                  : {}),
              }}>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen
                name="experiment/[id]"
                options={{ headerBackButtonDisplayMode: 'minimal', title: '' }}
              />
              <Stack.Screen name="onboarding" options={{ title: 'Onboarding' }} />
              <Stack.Screen name="onboarding/account-setup" options={{ title: 'Account Setup' }} />
              <Stack.Screen
                name="modal"
                options={{
                  headerBackButtonDisplayMode: 'minimal',
                  headerLargeTitleEnabled: false,
                  headerShown: Platform.OS !== 'web',
                  headerTitleAlign: 'left',
                  presentation: 'modal',
                  title: 'App info',
                }}
              />
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

  useEffect(() => {
    if (!hasFontAssets || fontsLoaded || fontsError) {
      void SplashScreen.hideAsync();
    }
  }, [fontsError, fontsLoaded, hasFontAssets]);

  if (hasFontAssets && !fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <AppThemeProvider>
      <LayoutInner />
    </AppThemeProvider>
  );
}
