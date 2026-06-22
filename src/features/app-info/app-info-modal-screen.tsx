import { router, Stack } from 'expo-router';
import { startTransition, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Pressable,
  type PressableProps,
  ScrollView,
  StyleSheet,
  Switch,
  View,
} from 'react-native';

import { AppButton } from '@/components/app-button';
import { AppText } from '@/components/app-text';
import { ExternalLink } from '@/components/external-link';
import { SurfaceCard } from '@/components/surface-card';
import { APP_LINKS } from '@/config/app-links';
import { useAppTheme } from '@/theme/provider';

import {
  deleteExperiments,
  listExperiments,
  resetExperiments,
  type ExperimentRecord,
} from '../experiments/experiment-store';

const repoUrl = 'https://github.com/DavidJGrimsley/Experimemo';
const websiteUrl = 'https://DavidJGrimsley.com';

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function SettingsRow({
  title,
  body,
  actionLabel,
  actionColor,
  onPress,
  ...pressableProps
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionColor?: string;
  onPress?: () => void;
} & PressableProps) {
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <Pressable
      {...pressableProps}
      accessibilityRole={onPress ? 'button' : undefined}
      onPress={onPress}
      style={styles.row}>
      <View style={styles.rowText}>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 16,
            fontWeight: '800',
          }}>
          {title}
        </AppText>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 14,
            lineHeight: 20,
          }}>
          {body}
        </AppText>
      </View>
      {actionLabel ? (
        <AppText
          style={{
            color: actionColor ?? colors.primary,
            fontFamily: theme.typography.fontBody,
            fontSize: 13,
            fontWeight: '700',
          }}>
          {actionLabel}
        </AppText>
      ) : null}
    </Pressable>
  );
}

export default function AppInfoModalScreen() {
  const theme = useAppTheme();
  const colors = theme.activeColors;
  const [experiments, setExperiments] = useState<ExperimentRecord[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showDeletePicker, setShowDeletePicker] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const selectedIdSet = useMemo(() => new Set(selectedIds), [selectedIds]);

  async function loadExperiments() {
    const result = await listExperiments();
    startTransition(() => {
      setExperiments(result);
    });
  }

  useEffect(() => {
    let active = true;

    void listExperiments().then((result) => {
      if (!active) {
        return;
      }

      startTransition(() => {
        setExperiments(result);
      });
    });

    return () => {
      active = false;
    };
  }, []);

  function toggleSelected(id: string, value?: boolean) {
    setSelectedIds((current) => {
      const shouldSelect = value ?? !current.includes(id);
      if (shouldSelect) {
        return current.includes(id) ? current : [...current, id];
      }
      return current.filter((currentId) => currentId !== id);
    });
  }

  async function runDeleteSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    setIsDeleting(true);

    try {
      await deleteExperiments(selectedIds);
      setSelectedIds([]);
      await loadExperiments();
      router.dismissTo('/track');
    } finally {
      setIsDeleting(false);
    }
  }

  function handleDeleteSelected() {
    if (selectedIds.length === 0) {
      return;
    }

    Alert.alert(
      'Delete selected experiments?',
      `This will permanently remove ${selectedIds.length} experiment${
        selectedIds.length === 1 ? '' : 's'
      }.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          style: 'destructive',
          text: 'Delete',
          onPress: () => {
            void runDeleteSelected();
          },
        },
      ]
    );
  }

  function handleResetApp() {
    Alert.alert(
      'Reset app data?',
      'This will permanently remove every experiment and leave the app empty.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          style: 'destructive',
          text: 'Reset',
          onPress: () => {
            void (async () => {
              setIsResetting(true);
              try {
                await resetExperiments();
                setSelectedIds([]);
                await loadExperiments();
                router.dismissTo('/track');
              } finally {
                setIsResetting(false);
              }
            })();
          },
        },
      ]
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackButtonDisplayMode: 'minimal',
          headerLargeTitleEnabled: false,
          headerShown: true,
          headerStyle: { backgroundColor: colors.background },
          headerTitleAlign: 'left',
          headerTitleStyle: {
            fontSize: 18,
            fontWeight: '700',
          },
          title: 'App info',
        }}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
        style={[styles.screen, { backgroundColor: colors.background }]}>
        <SurfaceCard>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 13,
              fontWeight: '800',
            }}>
            SETTINGS
          </AppText>
          <SettingsRow
            actionLabel={showDeletePicker ? 'Hide' : 'Open'}
            body="Choose experiments to remove from the app."
            onPress={() => {
              setShowDeletePicker((current) => !current);
              if (!showDeletePicker) {
                void loadExperiments();
              }
            }}
            title="Delete experiments"
          />
          <SettingsRow
            actionColor={isResetting ? colors.warning : colors.primary}
            actionLabel={isResetting ? 'Working...' : 'Reset'}
            body="Clear every saved experiment and start fresh."
            onPress={handleResetApp}
            title="Reset app"
          />
        </SurfaceCard>

        <SurfaceCard>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 13,
              fontWeight: '800',
            }}>
            ABOUT
          </AppText>
          <SettingsRow
            body="Experimemo helps you capture experiment setup, observations, notes, and photos without slowing the work down."
            title="About experimemo"
          />
          <ExternalLink asChild href={APP_LINKS.support}>
            <SettingsRow
              actionLabel="Open"
              body="Visit the support page for release notes, contact details, and help."
              title="Support"
            />
          </ExternalLink>
          <SettingsRow
            body="Built by David Grimsley for fast experiment tracking in the lab, classroom, or field."
            title="Developer"
          />
          <AppButton
            label="DavidJGrimsley.com"
            onPress={() => {
              void Linking.openURL(websiteUrl);
            }}
            style={{
              alignSelf: 'stretch',
              backgroundColor: colors.secondary,
              borderRadius: 14,
              minHeight: 48,
            }}
          />
        </SurfaceCard>

        <SurfaceCard>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 13,
              fontWeight: '800',
            }}>
            FEEDBACK
          </AppText>
          <SettingsRow
            body="Share feedback by opening a GitHub issue with what you tried, what happened, and what you expected."
            title="How to send feedback"
          />
          <SettingsRow
            actionLabel="Open"
            body="Open the GitHub repository for updates, issues, ideas, and feature requests."
            onPress={() => {
              void Linking.openURL(repoUrl);
            }}
            title="GitHub repository"
          />
          <ExternalLink asChild href={APP_LINKS.terms}>
            <SettingsRow
              actionLabel="Open"
              body="Read the current terms that apply when using experimemo."
              title="Terms of service"
            />
          </ExternalLink>
          <ExternalLink asChild href={APP_LINKS.privacy}>
            <SettingsRow
              actionLabel="Open"
              body="Review how experimemo handles data and privacy."
              title="Privacy policy"
            />
          </ExternalLink>
        </SurfaceCard>

        {showDeletePicker ? (
          <SurfaceCard>
            <AppText
              style={{
                color: colors.text,
                fontFamily: theme.typography.fontBody,
                fontSize: 17,
                fontWeight: '800',
              }}>
              Select experiments to delete
            </AppText>
            {experiments.length === 0 ? (
              <AppText
                style={{
                  color: colors.text,
                  fontFamily: theme.typography.fontBody,
                  fontSize: 14,
                  lineHeight: 20,
                }}>
                There are no saved experiments to remove.
              </AppText>
            ) : (
              <View style={styles.selectionList}>
                {experiments.map((experiment) => (
                  <Pressable
                    key={experiment.id}
                    onPress={() => toggleSelected(experiment.id)}
                    style={[
                      styles.selectionRow,
                      {
                        backgroundColor: colors.background,
                        borderColor: colors.primary,
                      },
                    ]}>
                    <View style={styles.rowText}>
                      <AppText
                        style={{
                          color: colors.text,
                          fontFamily: theme.typography.fontBody,
                          fontSize: 15,
                          fontWeight: '700',
                        }}>
                        {experiment.title}
                      </AppText>
                      <AppText
                        style={{
                          color: colors.text,
                          fontFamily: theme.typography.fontBody,
                          fontSize: 13,
                          lineHeight: 18,
                        }}>
                        {`${experiment.category} - Updated ${formatDate(experiment.updatedAt)}`}
                      </AppText>
                    </View>
                    <Switch
                      onValueChange={(value) => toggleSelected(experiment.id, value)}
                      value={selectedIdSet.has(experiment.id)}
                    />
                  </Pressable>
                ))}
              </View>
            )}

            {experiments.length > 0 ? (
              <View style={styles.actions}>
                <AppButton
                  disabled={selectedIds.length === 0 || isDeleting}
                  label={
                    isDeleting
                      ? 'Deleting...'
                      : selectedIds.length === 0
                        ? 'Select experiments first'
                        : `Delete ${selectedIds.length} selected`
                  }
                  onPress={handleDeleteSelected}
                  style={{
                    backgroundColor: colors.warning,
                    borderRadius: 999,
                    opacity: selectedIds.length === 0 || isDeleting ? 0.7 : 1,
                  }}
                />
                <AppButton
                  label="Cancel"
                  onPress={() => {
                    setSelectedIds([]);
                    setShowDeletePicker(false);
                  }}
                  style={{
                    backgroundColor: colors.background,
                    borderColor: colors.primary,
                    borderRadius: 999,
                    borderWidth: 1,
                  }}
                  variant="outlined"
                />
              </View>
            ) : null}
          </SurfaceCard>
        ) : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 10,
  },
  content: {
    gap: 20,
    padding: 20,
    paddingBottom: 28,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  rowText: {
    flex: 1,
    gap: 4,
  },
  screen: {
    flex: 1,
  },
  selectionList: {
    gap: 10,
  },
  selectionRow: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    padding: 14,
  },
});
