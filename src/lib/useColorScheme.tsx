import { useColorScheme as useSystemColorScheme } from 'react-native';

import { COLORS } from '@/theme/colors';

function useColorScheme() {
  const systemScheme = useSystemColorScheme();
  const colorScheme = systemScheme === 'dark' ? 'dark' : 'light';

  return {
    colorScheme,
    isDarkColorScheme: colorScheme === 'dark',
    colors: COLORS[colorScheme],
  };
}

export { useColorScheme };
