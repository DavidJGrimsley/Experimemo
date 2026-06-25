import type { KeyboardTypeOptions } from 'react-native';
import { StyleSheet, TextInput as RNTextInput, View } from 'react-native';

import { useAppTheme } from '@/theme/provider';
import { AppText } from './app-text';

interface AppTextFieldProps {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  error?: string;
  multiline?: boolean;
  keyboardType?: KeyboardTypeOptions;
}

export function AppTextField({
  label,
  value,
  onChangeText,
  placeholder,
  error,
  multiline = false,
  keyboardType = 'default',
}: AppTextFieldProps) {
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <View
      style={[
        styles.fieldCard,
        {
          backgroundColor: colors.surface,
          borderColor: error ? colors.warning : colors.primary,
          borderRadius: theme.layout.radius,
        },
      ]}>
      <AppText
        style={{
          color: colors.text,
          fontFamily: theme.typography.fontBody,
          fontSize: 15,
          fontWeight: '800',
        }}>
        {label}
      </AppText>
      <RNTextInput
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        style={{
          backgroundColor: colors.background,
          borderColor: error ? colors.warning : colors.surface,
          borderRadius: 14,
          borderWidth: 1,
          color: colors.text,
          fontFamily: theme.typography.fontBody,
          fontSize: 14,
          height: multiline ? 112 : 50,
          lineHeight: 20,
          paddingHorizontal: 14,
          paddingVertical: 12,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
        value={value}
      />
      {error ? (
        <AppText
          style={{
            color: colors.warning,
            fontFamily: theme.typography.fontBody,
            fontSize: 13,
            fontWeight: '700',
          }}>
          {error}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  fieldCard: {
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
});
