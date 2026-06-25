import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Image,
  Pressable,
  StyleSheet,
  Switch,
  TextInput as RNTextInput,
  View,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { AppText } from '@/components/app-text';
import { ScreenHeader } from '@/components/screen-header';
import { SurfaceCard } from '@/components/surface-card';
import { useAppTheme } from '@/theme/provider';

import {
  fromExperimentInput,
  toExperimentInput,
  type ExperimentFormState,
} from './experiment-form-types';
import { pickExperimentPhotos } from './photo-picker';
import {
  getExperimentById,
  updateExperiment,
  updateExperimentStatus,
  type ExperimentRecord,
  type ExperimentResultEntry,
} from './experiment-store';

type ExperimentFormTextFieldKey = Exclude<
  keyof ExperimentFormState,
  'photoAssets' | 'resultEntries'
>;

interface ResultDraftState {
  notes: string;
  photoAssets: ExperimentResultEntry['photoAssets'];
}

const editorFields: {
  key: ExperimentFormTextFieldKey;
  label: string;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
}[] = [
  {
    key: 'title',
    label: 'Experiment title',
    placeholder: 'Name this experiment',
  },
  {
    key: 'category',
    label: 'Category',
    placeholder: 'Choose a category',
  },
  {
    key: 'hypothesis',
    label: 'Hypothesis',
    placeholder: 'What are you testing?',
    multiline: true,
  },
  {
    key: 'procedure',
    label: 'Procedure',
    placeholder: 'Record the steps clearly.',
    multiline: true,
  },
  {
    key: 'dataPlan',
    label: 'Data collection plan',
    placeholder: 'What will you measure or capture?',
    multiline: true,
  },
  {
    key: 'observationsNotes',
    label: 'Observations',
    placeholder: 'Add observations as they come in.',
    multiline: true,
  },
  {
    key: 'notes',
    label: 'Field notes',
    placeholder: 'Capture reminders, anomalies, or context.',
    multiline: true,
  },
  {
    key: 'conclusionNotes',
    label: 'Conclusion',
    placeholder: 'Summarize what the experiment shows when you are ready.',
    multiline: true,
  },
  {
    key: 'plannedAttachmentCount',
    label: 'Planned photo count',
    placeholder: '0',
    keyboardType: 'number-pad',
  },
];

function buildErrors(form: ExperimentFormState) {
  const nextErrors: Partial<Record<keyof ExperimentFormState, string>> = {};

  if (!form.title.trim()) {
    nextErrors.title = 'Give this experiment a name.';
  }
  if (!form.hypothesis.trim()) {
    nextErrors.hypothesis = 'Keep the question you are testing visible here.';
  }

  return nextErrors;
}

function formatResultTimestamp(iso: string) {
  return new Date(iso).toLocaleString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function createResultId() {
  return `result-${Date.now()}-${Math.round(Math.random() * 100000)}`;
}

function ResultNotesInput({
  label,
  onChangeText,
  placeholder,
  value,
}: {
  label: string;
  onChangeText: (value: string) => void;
  placeholder: string;
  value: string;
}) {
  const theme = useAppTheme();
  const colors = theme.activeColors;

  return (
    <View style={styles.inlineTextAreaWrap}>
      <AppText
        style={{
          color: colors.text,
          fontFamily: theme.typography.fontBody,
          fontSize: 14,
          fontWeight: '800',
        }}>
        {label}
      </AppText>
      <RNTextInput
        multiline
        numberOfLines={4}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        style={[
          styles.inlineTextArea,
          {
            backgroundColor: colors.background,
            borderColor: colors.primary,
            color: colors.text,
            fontFamily: theme.typography.fontBody,
          },
        ]}
        value={value}
      />
    </View>
  );
}

export default function ExperimentEditorScreen() {
  const theme = useAppTheme();
  const colors = theme.activeColors;
  const { id } = useLocalSearchParams<{ id: string }>();
  const [experiment, setExperiment] = useState<ExperimentRecord | null>(null);
  const [form, setForm] = useState<ExperimentFormState | null>(null);
  const [resultDraft, setResultDraft] = useState<ResultDraftState>({
    notes: '',
    photoAssets: [],
  });
  const [errors, setErrors] = useState<Partial<Record<keyof ExperimentFormState, string>>>({});
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const hasLoadedFormRef = useRef(false);
  const saveRequestRef = useRef(0);

  useEffect(() => {
    let active = true;
    hasLoadedFormRef.current = false;

    void getExperimentById(id).then((result) => {
      if (!active) {
        return;
      }

      setExperiment(result);
      if (result) {
        setForm(
          fromExperimentInput({
            title: result.title,
            category: result.category,
            hypothesis: result.hypothesis,
            procedure: result.procedure,
            dataPlan: result.dataPlan,
            observationsNotes: result.observationsNotes,
            resultEntries: result.resultEntries,
            notes: result.notes,
            conclusionNotes: result.conclusionNotes,
            plannedAttachmentCount: result.plannedAttachmentCount,
            photoAssets: result.photoAssets,
          })
        );
      }
    });

    return () => {
      active = false;
    };
  }, [id]);

  useEffect(() => {
    if (!form) {
      return;
    }

    if (!hasLoadedFormRef.current) {
      hasLoadedFormRef.current = true;
      return;
    }

    const nextErrors = buildErrors(form);
    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const timeout = setTimeout(() => {
      const requestId = saveRequestRef.current + 1;
      saveRequestRef.current = requestId;

      void updateExperiment(id, toExperimentInput(form)).then((updated) => {
        if (updated && saveRequestRef.current === requestId) {
          setExperiment(updated);
        }
      });
    }, 600);

    return () => {
      clearTimeout(timeout);
    };
  }, [form, id]);

  async function handleStatusChange(isActive: boolean) {
    if (!experiment || isUpdatingStatus) {
      return;
    }

    const nextStatus = isActive ? 'active' : 'complete';
    setIsUpdatingStatus(true);

    try {
      const updated = await updateExperimentStatus(experiment.id, nextStatus);
      if (updated) {
        setExperiment(updated);
      }
    } finally {
      setIsUpdatingStatus(false);
    }
  }

  function updateResultEntry(entryId: string, updates: Partial<ExperimentResultEntry>) {
    setForm((current) =>
      current
        ? {
            ...current,
            resultEntries: current.resultEntries.map((entry) =>
              entry.id === entryId ? { ...entry, ...updates } : entry
            ),
          }
        : current
    );
  }

  function handleAddResult() {
    const notes = resultDraft.notes.trim();

    if (!notes && resultDraft.photoAssets.length === 0) {
      return;
    }

    const nextEntry: ExperimentResultEntry = {
      id: createResultId(),
      recordedAt: new Date().toISOString(),
      notes,
      photoAssets: resultDraft.photoAssets,
    };

    setForm((current) =>
      current ? { ...current, resultEntries: [nextEntry, ...current.resultEntries] } : current
    );
    setResultDraft({ notes: '', photoAssets: [] });
  }

  function handleDeleteResult(entryId: string) {
    Alert.alert(
      'Delete result?',
      'This will remove the result notes and photos from this record.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            setForm((current) =>
              current
                ? {
                    ...current,
                    resultEntries: current.resultEntries.filter((entry) => entry.id !== entryId),
                  }
                : current
            );
          },
        },
      ]
    );
  }

  if (!experiment || !form) {
    return (
      <View style={[styles.emptyScreen, { backgroundColor: colors.background }]}>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontFamily,
            fontSize: 24,
            fontWeight: '800',
          }}>
          Experiment not found
        </AppText>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 15,
            lineHeight: 22,
          }}>
          This record is no longer available. Return to Track and open another experiment.
        </AppText>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen
        options={{
          headerBackButtonDisplayMode: 'minimal',
          title: '',
        }}
      />
      <KeyboardAwareScrollView
        bottomOffset={24}
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        style={[styles.screen, { backgroundColor: colors.background }]}>
        <ScreenHeader
          rightAccessory={
            <View style={styles.statusToggle}>
              <AppText
                style={{
                  color: colors.text,
                  fontFamily: theme.typography.fontBody,
                  fontSize: 13,
                  fontWeight: '800',
                }}>
                {experiment.status === 'complete' ? 'Complete' : 'Active'}
              </AppText>
              <Switch
                disabled={isUpdatingStatus}
                ios_backgroundColor={colors.secondary}
                onValueChange={(value) => {
                  void handleStatusChange(value);
                }}
                testID="experiment-active-switch"
                thumbColor="#ffffff"
                trackColor={{
                  false: colors.secondary,
                  true: colors.primary,
                }}
                value={experiment.status !== 'complete'}
              />
            </View>
          }
          subtitle="Update the plan, record what happened, and keep your supporting notes and photos together."
          title={experiment.title}
          titleNumberOfLines={3}
        />

        <View style={styles.formSection}>
          {editorFields.map((field) => (
            <AppTextField
              error={errors[field.key]}
              key={field.key}
              keyboardType={field.keyboardType}
              label={field.label}
              multiline={field.multiline}
              onChangeText={(value) => {
                setForm((current) => (current ? { ...current, [field.key]: value } : current));
                setErrors((current) => {
                  if (field.key === 'title' && !value.trim()) {
                    return { ...current, title: 'Give this experiment a name.' };
                  }
                  if (field.key === 'hypothesis' && !value.trim()) {
                    return {
                      ...current,
                      hypothesis: 'Keep the question you are testing visible here.',
                    };
                  }
                  return { ...current, [field.key]: undefined };
                });
              }}
              placeholder={field.placeholder}
              value={form[field.key]}
            />
          ))}
        </View>

        <SurfaceCard>
          <View style={styles.resultsHeader}>
            <View style={styles.resultsTitleWrap}>
              <AppText
                style={{
                  color: colors.text,
                  fontFamily: theme.typography.fontBody,
                  fontSize: 17,
                  fontWeight: '800',
                }}>
                Results
              </AppText>
              <AppText
                style={{
                  color: colors.text,
                  fontFamily: theme.typography.fontBody,
                  fontSize: 13,
                  fontWeight: '700',
                  lineHeight: 18,
                }}>
                {form.resultEntries.length === 1
                  ? '1 timestamped entry'
                  : `${form.resultEntries.length} timestamped entries`}
              </AppText>
            </View>
          </View>

          <View style={styles.resultDraft}>
            <ResultNotesInput
              label="New result"
              onChangeText={(value) => {
                setResultDraft((current) => ({ ...current, notes: value }));
              }}
              placeholder="Record what changed, what you measured, or what happened."
              value={resultDraft.notes}
            />
            <View style={styles.resultActions}>
              <AppButton
                label="Add photos"
                onPress={() => {
                  void pickExperimentPhotos(resultDraft.photoAssets).then((photoAssets) => {
                    setResultDraft((current) => ({ ...current, photoAssets }));
                  });
                }}
                style={{
                  backgroundColor: colors.background,
                  borderColor: colors.primary,
                  borderRadius: 999,
                  borderWidth: 1,
                }}
                variant="outlined"
              />
              <AppButton
                disabled={!resultDraft.notes.trim() && resultDraft.photoAssets.length === 0}
                label="Save result"
                onPress={handleAddResult}
                style={{ borderRadius: 999 }}
              />
            </View>
            {resultDraft.photoAssets.length > 0 ? (
              <View style={styles.photoGrid}>
                {resultDraft.photoAssets.map((photo) => (
                  <Pressable
                    accessibilityRole="button"
                    key={photo.id}
                    onPress={() => {
                      setResultDraft((current) => ({
                        ...current,
                        photoAssets: current.photoAssets.filter((asset) => asset.id !== photo.id),
                      }));
                    }}
                    style={styles.photoCard}>
                    <Image
                      source={{ uri: photo.uri }}
                      style={[styles.photoThumb, { borderColor: colors.primary }]}
                    />
                    <AppText
                      style={{
                        color: colors.text,
                        fontFamily: theme.typography.fontBody,
                        fontSize: 12,
                        fontWeight: '700',
                        textAlign: 'center',
                      }}>
                      Remove
                    </AppText>
                  </Pressable>
                ))}
              </View>
            ) : null}
          </View>

          {form.resultEntries.length > 0 ? (
            <View style={styles.resultList}>
              {form.resultEntries.map((entry) => (
                <View
                  key={entry.id}
                  style={[styles.resultEntry, { borderTopColor: colors.background }]}>
                  <View style={styles.resultEntryTopRow}>
                    <AppText
                      style={{
                        color: colors.text,
                        fontFamily: theme.typography.fontBody,
                        fontSize: 13,
                        fontWeight: '800',
                        lineHeight: 18,
                      }}>
                      {formatResultTimestamp(entry.recordedAt)}
                    </AppText>
                    <Pressable
                      accessibilityRole="button"
                      onPress={() => handleDeleteResult(entry.id)}
                      style={styles.deleteResultButton}>
                      <AppText
                        style={{
                          color: colors.warning,
                          fontFamily: theme.typography.fontBody,
                          fontSize: 13,
                          fontWeight: '800',
                        }}>
                        Delete
                      </AppText>
                    </Pressable>
                  </View>
                  <ResultNotesInput
                    label="Result notes"
                    onChangeText={(value) => updateResultEntry(entry.id, { notes: value })}
                    placeholder="Add result details."
                    value={entry.notes}
                  />
                  <View style={styles.resultActions}>
                    <AppButton
                      label="Add photos"
                      onPress={() => {
                        void pickExperimentPhotos(entry.photoAssets).then((photoAssets) => {
                          updateResultEntry(entry.id, { photoAssets });
                        });
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
                  {entry.photoAssets.length > 0 ? (
                    <View style={styles.photoGrid}>
                      {entry.photoAssets.map((photo) => (
                        <Pressable
                          accessibilityRole="button"
                          key={photo.id}
                          onPress={() => {
                            updateResultEntry(entry.id, {
                              photoAssets: entry.photoAssets.filter(
                                (asset) => asset.id !== photo.id
                              ),
                            });
                          }}
                          style={styles.photoCard}>
                          <Image
                            source={{ uri: photo.uri }}
                            style={[styles.photoThumb, { borderColor: colors.primary }]}
                          />
                          <AppText
                            style={{
                              color: colors.text,
                              fontFamily: theme.typography.fontBody,
                              fontSize: 12,
                              fontWeight: '700',
                              textAlign: 'center',
                            }}>
                            Remove
                          </AppText>
                        </Pressable>
                      ))}
                    </View>
                  ) : null}
                </View>
              ))}
            </View>
          ) : null}
        </SurfaceCard>

        <SurfaceCard>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 17,
              fontWeight: '800',
            }}>
            Attached photos
          </AppText>
          <AppText
            style={{
              color: colors.text,
              fontFamily: theme.typography.fontBody,
              fontSize: 14,
              lineHeight: 20,
            }}>
            Keep your reference photos with the experiment so everything stays easy to review later.
          </AppText>
          <AppButton
            label="Add photos"
            onPress={() => {
              void pickExperimentPhotos(form.photoAssets).then((photoAssets) => {
                setForm((current) => (current ? { ...current, photoAssets } : current));
              });
            }}
            style={{
              backgroundColor: colors.background,
              borderColor: colors.primary,
              borderRadius: 999,
              borderWidth: 1,
            }}
            variant="outlined"
          />
          {form.photoAssets.length > 0 ? (
            <View style={styles.photoGrid}>
              {form.photoAssets.map((photo) => (
                <Pressable
                  key={photo.id}
                  accessibilityRole="button"
                  onPress={() => {
                    setForm((current) =>
                      current
                        ? {
                            ...current,
                            photoAssets: current.photoAssets.filter(
                              (asset) => asset.id !== photo.id
                            ),
                          }
                        : current
                    );
                  }}
                  style={styles.photoCard}>
                  <Image
                    source={{ uri: photo.uri }}
                    style={[styles.photoThumb, { borderColor: colors.primary }]}
                  />
                  <AppText
                    style={{
                      color: colors.text,
                      fontFamily: theme.typography.fontBody,
                      fontSize: 12,
                      fontWeight: '700',
                      textAlign: 'center',
                    }}>
                    Remove
                  </AppText>
                </Pressable>
              ))}
            </View>
          ) : null}
        </SurfaceCard>
      </KeyboardAwareScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 28,
  },
  emptyScreen: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    padding: 24,
  },
  formSection: {
    gap: 12,
  },
  inlineTextArea: {
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 14,
    height: 112,
    lineHeight: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  inlineTextAreaWrap: {
    gap: 8,
  },
  deleteResultButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  photoCard: {
    gap: 6,
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  photoThumb: {
    borderRadius: 12,
    borderWidth: 1,
    height: 84,
    width: 84,
  },
  resultActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  resultDraft: {
    gap: 10,
  },
  resultEntry: {
    borderTopWidth: 1,
    gap: 10,
    paddingTop: 14,
  },
  resultEntryTopRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'space-between',
  },
  resultList: {
    gap: 14,
  },
  resultsHeader: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
  },
  resultsTitleWrap: {
    flex: 1,
    gap: 2,
  },
  screen: {
    flex: 1,
  },
  statusToggle: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
    minHeight: 40,
  },
});
