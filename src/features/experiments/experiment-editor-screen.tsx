import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import { Image, Pressable, StyleSheet, Switch, View } from 'react-native';
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
} from './experiment-store';

type ExperimentFormTextFieldKey = Exclude<keyof ExperimentFormState, 'photoAssets'>;

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
    key: 'resultsNotes',
    label: 'Results and observations',
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

export default function ExperimentEditorScreen() {
  const theme = useAppTheme();
  const colors = theme.activeColors;
  const { id } = useLocalSearchParams<{ id: string }>();
  const [experiment, setExperiment] = useState<ExperimentRecord | null>(null);
  const [form, setForm] = useState<ExperimentFormState | null>(null);
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
            resultsNotes: result.resultsNotes,
            notes: result.notes,
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
