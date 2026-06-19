import { useIsFocused, useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Image, Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { ScreenHeader } from '@/components/screen-header';
import { SurfaceCard } from '@/components/surface-card';
import { useAppTheme } from '@/theme/provider';

import { listExperiments, type ExperimentRecord } from '../experiments/experiment-store';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function formatResultDate(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function ExperimentRow({ experiment }: { experiment: ExperimentRecord }) {
  const theme = useAppTheme();
  const colors = theme.activeColors;
  const router = useRouter();

  const isCompleted = experiment.status === 'complete';
  const latestResult = experiment.resultEntries[0];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={() =>
        router.push({
          pathname: '/experiment/[id]',
          params: { id: experiment.id },
        })
      }
      style={styles.cardButton}>
      <SurfaceCard>
        <View style={styles.cardTopRow}>
          <View style={styles.cardTitleWrap}>
            <AppText
              style={{
                color: colors.text,
                fontFamily: theme.typography.fontBody,
                fontSize: 16,
                fontWeight: '800',
              }}>
              {experiment.title}
            </AppText>
            <AppText
              style={{
                color: colors.text,
                fontFamily: theme.typography.fontBody,
                fontSize: 12,
                lineHeight: 18,
              }}>
              {`${experiment.category} - Updated ${formatDate(experiment.updatedAt)}`}
            </AppText>
          </View>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: isCompleted ? colors.secondary : colors.primary,
                borderColor: isCompleted ? colors.secondary : colors.primary,
              },
            ]}>
            <AppText
              style={{
                color: '#ffffff',
                fontFamily: theme.typography.fontBody,
                fontSize: 12,
                fontWeight: '800',
              }}>
              {experiment.status.toUpperCase()}
            </AppText>
          </View>
        </View>

        <View style={styles.detailList}>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 12,
              fontWeight: '800',
            }}>
            Hypothesis
          </AppText>
          <AppText
            numberOfLines={3}
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 14,
              lineHeight: 20,
            }}>
            {experiment.hypothesis}
          </AppText>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 12,
              fontWeight: '800',
            }}>
            Observations
          </AppText>
          <AppText
            numberOfLines={3}
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 14,
              lineHeight: 20,
            }}>
            {experiment.observationsNotes || 'No observations recorded yet.'}
          </AppText>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 12,
              fontWeight: '800',
            }}>
            Results
          </AppText>
          <AppText
            numberOfLines={3}
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 14,
              lineHeight: 20,
            }}>
            {latestResult
              ? `${experiment.resultEntries.length} ${
                  experiment.resultEntries.length === 1 ? 'entry' : 'entries'
                } - Latest ${formatResultDate(latestResult.recordedAt)}: ${latestResult.notes || 'Photos only'}`
              : 'No result entries yet.'}
          </AppText>
        </View>

        {experiment.photoAssets.length > 0 ? (
          <View style={styles.photoPreviewRow}>
            <Image
              source={{ uri: experiment.photoAssets[0].uri }}
              style={[styles.photoPreview, { borderColor: colors.primary }]}
            />
            <AppText
              style={{
                color: colors.text,
                fontFamily: theme.typography.fontBody,
                fontSize: 13,
                fontWeight: '700',
                lineHeight: 18,
              }}>
              {experiment.photoAssets.length === 1
                ? '1 attached photo'
                : `${experiment.photoAssets.length} attached photos`}
            </AppText>
          </View>
        ) : null}

        <View style={styles.footer}>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 12,
              fontWeight: '700',
            }}>
            {`Planned photos: ${experiment.plannedAttachmentCount}`}
          </AppText>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 12,
              fontWeight: '700',
            }}>
            {`Conclusion: ${experiment.conclusionNotes ? 'Ready' : 'Open'}`}
          </AppText>
        </View>
      </SurfaceCard>
    </Pressable>
  );
}

export default function TrackScreen() {
  const theme = useAppTheme();
  const colors = theme.activeColors;
  const router = useRouter();
  const isFocused = useIsFocused();
  const [experiments, setExperiments] = useState<ExperimentRecord[] | null>(null);

  useEffect(() => {
    if (!isFocused) {
      return;
    }

    let active = true;

    void listExperiments().then((result) => {
      if (!active) {
        return;
      }

      setExperiments(result);
    });

    return () => {
      active = false;
    };
  }, [isFocused]);

  const grouped = useMemo(() => {
    const allExperiments = experiments ?? [];
    return {
      active: allExperiments.filter((experiment) => experiment.status === 'active'),
      completed: allExperiments.filter((experiment) => experiment.status === 'complete'),
    };
  }, [experiments]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      style={[styles.screen, { backgroundColor: colors.background }]}>
      <ScreenHeader
        showInfoAction
        subtitle="Review every experiment in one place and reopen any record to keep adding observations, notes, and photos."
        title="Track experiments"
      />

      {!experiments ? (
        <View style={styles.loadingWrap}>
          <ActivityIndicator color={colors.primary} />
        </View>
      ) : experiments.length === 0 ? (
        <SurfaceCard>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 17,
              fontWeight: '800',
            }}>
            No experiments yet
          </AppText>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 14,
              lineHeight: 20,
            }}>
            Create your first experiment to start recording your process and results.
          </AppText>
          <AppButton
            label="Create experiment"
            onPress={() => router.push('/new')}
            style={{ backgroundColor: colors.primary, borderRadius: 999 }}
          />
        </SurfaceCard>
      ) : (
        <View style={styles.sectionList}>
          {grouped.active.length > 0 ? (
            <View style={styles.section}>
              <AppText
                style={{
                  color: colors.text,
                  fontFamily: theme.typography.fontBody,
                  fontSize: 13,
                  fontWeight: '800',
                }}>
                ACTIVE
              </AppText>
              <View style={styles.list}>
                {grouped.active.map((experiment) => (
                  <ExperimentRow experiment={experiment} key={experiment.id} />
                ))}
              </View>
            </View>
          ) : null}

          {grouped.completed.length > 0 ? (
            <View style={styles.section}>
              <AppText
                style={{
                  color: colors.text,
                  fontFamily: theme.typography.fontBody,
                  fontSize: 13,
                  fontWeight: '800',
                }}>
                COMPLETED
              </AppText>
              <View style={styles.list}>
                {grouped.completed.map((experiment) => (
                  <ExperimentRow experiment={experiment} key={experiment.id} />
                ))}
              </View>
            </View>
          ) : null}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  cardButton: {
    borderRadius: 12,
  },
  cardTitleWrap: {
    flex: 1,
    gap: 4,
  },
  cardTopRow: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  content: {
    gap: 20,
    padding: 20,
    paddingBottom: 28,
  },
  detailList: {
    gap: 4,
  },
  footer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  list: {
    gap: 12,
  },
  loadingWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  photoPreview: {
    borderRadius: 12,
    borderWidth: 1,
    height: 56,
    width: 56,
  },
  photoPreviewRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
  },
  screen: {
    flex: 1,
  },
  section: {
    gap: 10,
  },
  sectionList: {
    gap: 20,
  },
});
