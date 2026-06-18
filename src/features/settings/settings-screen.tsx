import { StyleSheet, Text, View } from 'react-native';

import { useAppTheme } from '../../theme/provider';

export default function SettingsScreen() {
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text
          style={[
            styles.title,
            {
              color: colors.text,
              fontFamily: theme.typography.fontFamily,
              fontWeight:
                theme.typography.fontFamily === 'System' ||
                theme.typography.fontFamily === 'monospace'
                  ? '800'
                  : 'normal',
            },
          ]}>
          Settings
        </Text>
        <Text style={[styles.body, { color: colors.text }]}>
          Keep this screen focused on app-level preferences, storage controls, and future export
          options without distracting from the main experiment workflow.
        </Text>
      </View>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.primary,
            borderRadius: theme.layout.radius,
          },
        ]}>
        <Text style={[styles.cardTitle, { color: colors.text }]}>Planned settings</Text>
        <Text style={[styles.cardBody, { color: colors.text }]}>
          Theme controls, storage management, export preferences, and camera defaults are the next
          settings areas to expand here.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: '#ffffff',
    flex: 1,
    padding: 20,
  },
  header: {
    marginBottom: 12,
  },
  card: {
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  title: {
    color: '#111827',
    fontSize: 26,
    fontWeight: '800',
  },
  body: {
    color: '#4b5563',
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
});
