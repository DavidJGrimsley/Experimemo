import { NativeTabs } from 'expo-router/unstable-native-tabs';

import { useAppTheme } from '../../theme/provider';

export default function TabLayout() {
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <NativeTabs
      badgeBackgroundColor={colors.warning}
      backgroundColor={colors.background}
      iconColor={colors.text}
      labelStyle={{
        color: colors.text,
        fontSize: 12,
        fontWeight: '700',
      }}
      tintColor={colors.primary}>
      <NativeTabs.Trigger name="new">
        <NativeTabs.Trigger.Icon
          md={{ default: 'add_circle_outline', selected: 'add_circle' }}
          sf={{ default: 'plus.circle', selected: 'plus.circle.fill' }}
        />
        <NativeTabs.Trigger.Label>New</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="track">
        <NativeTabs.Trigger.Icon
          md={{ default: 'inventory_2', selected: 'inventory' }}
          sf={{ default: 'tray', selected: 'tray.full.fill' }}
        />
        <NativeTabs.Trigger.Label>Track</NativeTabs.Trigger.Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
