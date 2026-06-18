import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import {
  fromExperimentDraftInput,
  toExperimentDraftInput,
  type ExperimentFormState,
} from './experiment-form-types';
import { pickExperimentPhotos } from './photo-picker';
import { getExperimentById, updateExperiment, type ExperimentRecord } from './experiment-store';
import { useAppTheme } from '../../theme/provider';

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
    label: 'Folder or category',
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
    placeholder: 'Update this as real observations come in.',
    multiline: true,
  },
  {
    key: 'notes',
    label: 'Field notes',
    placeholder: 'Add reminders, anomalies, or context.',
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
    nextErrors.hypothesis = 'Keep the experiment question visible here.';
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
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let active = true;

    void getExperimentById(id).then((result) => {
      if (!active) {
        return;
      }

      setExperiment(result);
      if (result) {
        setForm(
          fromExperimentDraftInput({
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

  async function handleSave() {
    if (!form) {
      return;
    }

    const nextErrors = buildErrors(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);

    try {
      const updated = await updateExperiment(id, toExperimentDraftInput(form));
      if (updated) {
        setExperiment(updated);
        router.back();
      }
    } finally {
      setIsSaving(false);
    }
  }

  if (!experiment || !form) {
    return (
      <View style={[styles.emptyScreen, { backgroundColor: colors.background }]}>
        <Text style={[styles.emptyTitle, { color: colors.text }]}>Experiment not found</Text>
        <Text style={[styles.emptyBody, { color: colors.text }]}>
          This record is no longer available. Return to Track and open another experiment.
        </Text>
      </View>
    );
  }

  return (
    <KeyboardAwareScrollView
      bottomOffset={24}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.content}
      keyboardShouldPersistTaps="handled"
      style={[styles.screen, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text
          style={[
            styles.eyebrow,
            {
              color: colors.primary,
              fontFamily: theme.typography.fontFamily,
            },
          ]}>
          Experiment Record
        </Text>
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
          Edit experiment
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Update the procedure, record results and observations, refine notes, and manage attached
          photos from one place.
        </Text>
      </View>

      <View
        style={[
          styles.statusCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.primary,
            borderRadius: theme.layout.radius,
          },
        ]}>
        <Text style={[styles.statusTitle, { color: colors.text }]}>{experiment.title}</Text>
        <Text style={[styles.statusBody, { color: colors.text }]}>
          Current status: {experiment.status}. Updating results here is the intended follow-up path
          after creating a draft, and this is also where attached photos can be reviewed later.
        </Text>
      </View>

      <View style={styles.formSection}>
        {editorFields.map((field) => (
          <View
            key={field.key}
            style={[
              styles.fieldCard,
              {
                backgroundColor: colors.surface,
                borderColor: errors[field.key] ? colors.warning : colors.primary,
                borderRadius: theme.layout.radius,
              },
            ]}>
            <Text style={[styles.fieldLabel, { color: colors.text }]}>{field.label}</Text>
            <TextInput
              keyboardType={field.keyboardType}
              multiline={field.multiline}
              onChangeText={(value) => {
                setForm((current) => (current ? { ...current, [field.key]: value } : current));
                setErrors((current) => ({ ...current, [field.key]: undefined }));
              }}
              placeholder={field.placeholder}
              placeholderTextColor="#6b7280"
              style={[
                styles.input,
                styles.inputBase,
                field.multiline ? styles.multilineInput : styles.singleLineInput,
                {
                  backgroundColor: colors.background,
                  borderColor: errors[field.key] ? colors.warning : colors.surface,
                  color: colors.text,
                },
              ]}
              textAlignVertical={field.multiline ? 'top' : 'center'}
              value={form[field.key]}
            />
            {errors[field.key] ? (
              <Text style={[styles.errorText, { color: colors.warning }]}>{errors[field.key]}</Text>
            ) : null}
          </View>
        ))}
      </View>

      <View
        style={[
          styles.statusCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.primary,
            borderRadius: theme.layout.radius,
          },
        ]}>
        <Text style={[styles.statusTitle, { color: colors.text }]}>Attached photos</Text>
        <Text style={[styles.statusBody, { color: colors.text }]}>
          Add images from your library and keep them attached to this experiment record.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            if (!form) {
              return;
            }

            void pickExperimentPhotos(form.photoAssets).then((photoAssets) => {
              setForm((current) => (current ? { ...current, photoAssets } : current));
            });
          }}
          style={StyleSheet.flatten([
            styles.secondaryButton,
            {
              backgroundColor: colors.background,
              borderColor: colors.primary,
            },
          ])}>
          <Text style={[styles.secondaryButtonText, { color: colors.text }]}>Add photos</Text>
        </Pressable>
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
                          photoAssets: current.photoAssets.filter((asset) => asset.id !== photo.id),
                        }
                      : current
                  );
                }}
                style={styles.photoCard}>
                <Image
                  source={{ uri: photo.uri }}
                  style={[styles.photoThumb, { borderColor: colors.primary }]}
                />
                <Text style={[styles.removeText, { color: colors.text }]}>Remove</Text>
              </Pressable>
            ))}
          </View>
        ) : null}
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={isSaving}
        onPress={() => {
          void handleSave();
        }}
        style={StyleSheet.flatten([
          styles.primaryButton,
          {
            backgroundColor: colors.primary,
            opacity: isSaving ? 0.7 : 1,
          },
        ])}>
        <Text style={styles.primaryButtonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
      </Pressable>
    </KeyboardAwareScrollView>
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
  eyebrow: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
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
  statusCard: {
    borderWidth: 1,
    gap: 6,
    padding: 16,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '800',
  },
  statusBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  formSection: {
    gap: 12,
  },
  fieldCard: {
    borderWidth: 1,
    gap: 8,
    padding: 16,
  },
  fieldLabel: {
    fontSize: 15,
    fontWeight: '800',
  },
  input: {
    borderRadius: 14,
    borderWidth: 1,
  },
  inputBase: {
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  singleLineInput: {
    minHeight: 50,
  },
  multilineInput: {
    minHeight: 112,
  },
  errorText: {
    fontSize: 13,
    fontWeight: '700',
  },
  primaryButton: {
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  secondaryButton: {
    alignItems: 'center',
    borderRadius: 999,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: '800',
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
  },
  photoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 10,
  },
  photoCard: {
    gap: 6,
  },
  photoThumb: {
    borderRadius: 12,
    borderWidth: 1,
    height: 84,
    width: 84,
  },
  removeText: {
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
  },
  emptyScreen: {
    flex: 1,
    gap: 8,
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '800',
  },
  emptyBody: {
    fontSize: 15,
    lineHeight: 22,
  },
});
