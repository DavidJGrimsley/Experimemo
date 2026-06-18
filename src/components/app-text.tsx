import type { StyleProp, TextProps, TextStyle } from 'react-native';
import { Text as RNText } from 'react-native';

interface AppTextProps extends TextProps {
  style?: StyleProp<TextStyle>;
}

export function AppText({ style, ...props }: AppTextProps) {
  return <RNText {...props} style={style} />;
}
