import { Link, useIsFocused } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { listExperiments, type ExperimentRecord } from '../experiments/experiment-store';
import { useAppTheme } from '../../theme/provider';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default function TrackScreen() {
  const theme = useAppTheme();
  const colors = theme.activeColors;
  const isFocused = useIsFocused();
  const [experiments, setExperiments] = useState<ExperimentRecord[] | null>(null);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let active = true;

    void listExperiments().then((result) => {
      if (!active) return;
      setExperiments(result);
    });

    return () => {
      active = false;
    };
  }, [isFocused]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.screen, { backgroundColor: colors.background }]}>
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
          Track experiments
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Review saved drafts and active experiment records. Open any record to update results,
          notes, and attached photos.
        </Text>
      </View>

      {!experiments ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : (
        <View style={styles.list}>
          {experiments.map((experiment) => (
            <Link
              key={experiment.id}
              href={{
                pathname: '/experiment/[id]',
                params: { id: experiment.id },
              }}
              asChild>
              <Pressable
                accessibilityRole="button"
                style={StyleSheet.flatten([
                  styles.card,
                  {
                    backgroundColor: colors.surface,
                    borderColor: colors.primary,
                    borderRadius: theme.layout.radius,
                  },
                ])}>
                <View style={styles.row}>
                  <View style={styles.titleWrap}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>
                      {experiment.title}
                    </Text>
                    <Text style={[styles.cardMeta, { color: colors.text }]}>
                      {`${experiment.category} · Updated ${formatDate(experiment.updatedAt)}`}
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.badge,
                      {
                        backgroundColor:
                          experiment.status === 'active' ? colors.primary : colors.background,
                        borderColor: colors.primary,
                      },
                    ]}>
                    <Text
                      style={[
                        styles.badgeText,
                        { color: experiment.status === 'active' ? '#ffffff' : colors.text },
                      ]}>
                      {experiment.status}
                    </Text>
                  </View>
                </View>

                <View style={styles.detailList}>
                  <Text style={[styles.detailLabel, { color: colors.text }]}>Hypothesis</Text>
                  <Text style={[styles.cardBody, { color: colors.text }]}>
                    {experiment.hypothesis}
                  </Text>
                  <Text style={[styles.detailLabel, { color: colors.text }]}>
                    Results and observations
                  </Text>
                  <Text style={[styles.cardBody, { color: colors.text }]}>
                    {experiment.resultsNotes || 'No results recorded yet.'}
                  </Text>
                </View>

                {experiment.photoAssets.length > 0 ? (
                  <View style={styles.photoPreviewRow}>
                    <Image
                      source={{ uri: experiment.photoAssets[0].uri }}
                      style={[styles.photoPreview, { borderColor: colors.primary }]}
                    />
                    <Text style={[styles.photoPreviewText, { color: colors.text }]}>
                      {experiment.photoAssets.length === 1
                        ? '1 attached photo'
                        : `${experiment.photoAssets.length} attached photos`}
                    </Text>
                  </View>
                ) : null}

                <View style={styles.footer}>
                  <Text style={[styles.footerText, { color: colors.text }]}>
                    Attached photos: {experiment.photoAssets.length}
                  </Text>
                  <Text style={[styles.footerText, { color: colors.text }]}>
                    Planned photos: {experiment.plannedAttachmentCount}
                  </Text>
                  <Text style={[styles.footerText, { color: colors.text }]}>
                    Notes ready: {experiment.notes ? 'Yes' : 'No'}
                  </Text>
                </View>
              </Pressable>
            </Link>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 28,
  },
  header: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    lineHeight: 22,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  list: {
    gap: 12,
  },
  card: {
    borderWidth: 1,
    gap: 12,
    padding: 16,
  },
  row: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  titleWrap: {
    flex: 1,
    gap: 4,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
  },
  cardMeta: {
    fontSize: 12,
    lineHeight: 18,
    opacity: 0.8,
  },
  detailList: {
    gap: 4,
  },
  detailLabel: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.6,
    opacity: 0.8,
    textTransform: 'uppercase',
  },
  cardBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  photoPreviewRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  photoPreview: {
    borderRadius: 12,
    borderWidth: 1,
    height: 56,
    width: 56,
  },
  photoPreviewText: {
    flex: 1,
    fontSize: 13,
    fontWeight: '700',
    lineHeight: 18,
  },
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '700',
    opacity: 0.85,
  },
});
