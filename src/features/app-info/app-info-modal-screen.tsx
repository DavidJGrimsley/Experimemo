import { Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import { startTransition, useEffect, useState } from 'react';
import { Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';

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
}: {
  title: string;
  body: string;
  actionLabel?: string;
  actionColor?: string;
  onPress?: () => void;
}) {
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <Pressable
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
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

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

  async function runDeleteExperiment(id: string) {
    setDeletingId(id);

    try {
      await deleteExperiments([id]);
      await loadExperiments();
    } finally {
      setDeletingId((current) => (current === id ? null : current));
    }
  }

  function handleDeleteExperiment(experiment: ExperimentRecord) {
    Alert.alert('Delete experiment?', `This will permanently remove "${experiment.title}".`, [
      { text: 'Cancel', style: 'cancel' },
      {
        style: 'destructive',
        text: 'Delete',
        onPress: () => {
          void runDeleteExperiment(experiment.id);
        },
      },
    ]);
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
                setShowDeleteModal(false);
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

  function handleOpenDeleteModal() {
    if (!showDeleteModal) {
      void loadExperiments();
    }

    setShowDeleteModal(true);
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
          <View style={styles.settingsActions}>
            <AppButton
              label="Delete experiments"
              onPress={handleOpenDeleteModal}
              style={{
                alignSelf: 'stretch',
                borderRadius: 14,
                borderColor: '#dc2626',
                borderWidth: 1,
                minHeight: 52,
              }}
              textStyle={{ color: colors.text }}
              variant="outlined"
            />
            <AppButton
              label={isResetting ? 'Resetting...' : 'Reset app'}
              onPress={handleResetApp}
              style={{
                alignSelf: 'stretch',
                borderRadius: 14,
                borderColor: colors.secondary,
                borderWidth: 1,
                minHeight: 52,
                opacity: isResetting ? 0.75 : 1,
              }}
              textStyle={{ color: colors.text }}
              variant="outlined"
            />
          </View>
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
            title="About Experimemo"
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
              body="Read the current terms that apply when using Experimemo."
              title="Terms of service"
            />
          </ExternalLink>
          <ExternalLink asChild href={APP_LINKS.privacy}>
            <SettingsRow
              actionLabel="Open"
              body="Review how Experimemo handles data and privacy."
              title="Privacy policy"
            />
          </ExternalLink>
        </SurfaceCard>
      </ScrollView>
      <Modal
        animationType="fade"
        onRequestClose={() => {
          setShowDeleteModal(false);
        }}
        transparent
        visible={showDeleteModal}>
        <View style={styles.modalBackdrop}>
          <View
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.surface,
                borderColor: colors.primary,
              },
            ]}>
            <View style={styles.modalHeader}>
              <AppText
                style={{
                  color: colors.text,
                  fontFamily: theme.typography.fontBody,
                  fontSize: 20,
                  fontWeight: '800',
                }}>
                Delete experiments
              </AppText>
              <Pressable
                accessibilityLabel="Close delete experiments"
                accessibilityRole="button"
                onPress={() => {
                  setShowDeleteModal(false);
                }}
                style={[
                  styles.closeButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.primary,
                  },
                ]}>
                <Ionicons color={colors.text} name="close" size={20} />
              </Pressable>
            </View>

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
              <ScrollView
                contentContainerStyle={styles.modalList}
                showsVerticalScrollIndicator={false}>
                {experiments.map((experiment) => {
                  const isDeletingRow = deletingId === experiment.id;

                  return (
                    <View
                      key={experiment.id}
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
                      <Pressable
                        accessibilityLabel={`Delete ${experiment.title}`}
                        accessibilityRole="button"
                        disabled={isDeletingRow}
                        onPress={() => handleDeleteExperiment(experiment)}
                        style={[
                          styles.deleteIconButton,
                          {
                            opacity: isDeletingRow ? 0.6 : 1,
                          },
                        ]}>
                        <Ionicons color="#ffffff" name="close" size={18} />
                      </Pressable>
                    </View>
                  );
                })}
              </ScrollView>
            )}

            <AppButton
              label="Done"
              onPress={() => {
                setShowDeleteModal(false);
              }}
              style={{
                alignSelf: 'stretch',
                backgroundColor: colors.background,
                borderColor: colors.primary,
                borderRadius: 14,
                borderWidth: 1,
              }}
              variant="outlined"
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 20,
    padding: 20,
    paddingBottom: 28,
  },
  deleteIconButton: {
    alignItems: 'center',
    backgroundColor: '#dc2626',
    borderRadius: 999,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  closeButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    height: 36,
    justifyContent: 'center',
    width: 36,
  },
  modalBackdrop: {
    backgroundColor: 'rgba(15, 23, 42, 0.45)',
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 20,
    borderWidth: 1,
    gap: 16,
    maxHeight: '78%',
    padding: 18,
  },
  modalHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  modalList: {
    gap: 12,
    paddingBottom: 8,
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
  settingsActions: {
    gap: 12,
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
