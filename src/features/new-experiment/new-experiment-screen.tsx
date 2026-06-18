import { Link, router } from 'expo-router';
import { startTransition, useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import {
  initialExperimentFormState,
  toExperimentDraftInput,
  type ExperimentFormState,
} from '../experiments/experiment-form-types';
import { pickExperimentPhotos } from '../experiments/photo-picker';
import { createExperimentDraft } from '../experiments/experiment-store';
import { useAppTheme } from '../../theme/provider';

type ExperimentFormTextFieldKey = Exclude<keyof ExperimentFormState, 'photoAssets'>;

const fields: {
  key: ExperimentFormTextFieldKey;
  label: string;
  placeholder: string;
  multiline?: boolean;
  keyboardType?: 'default' | 'number-pad';
}[] = [
  {
    key: 'title',
    label: 'Experiment title',
    placeholder: 'Ex. Plant growth with indirect sunlight',
  },
  {
    key: 'category',
    label: 'Folder or category',
    placeholder: 'Ex. Botany, Chemistry, Physics',
  },
  {
    key: 'hypothesis',
    label: 'Hypothesis',
    placeholder: 'What do you expect to happen?',
    multiline: true,
  },
  {
    key: 'procedure',
    label: 'Procedure',
    placeholder: 'Outline the setup, materials, and repeatable steps.',
    multiline: true,
  },
  {
    key: 'dataPlan',
    label: 'Data collection plan',
    placeholder: 'What measurements, photos, and observations will you capture?',
    multiline: true,
  },
  {
    key: 'resultsNotes',
    label: 'Results and observations',
    placeholder:
      'Record what actually happened, early observations, or leave this for later updates.',
    multiline: true,
  },
  {
    key: 'notes',
    label: 'Field notes',
    placeholder: 'Add quick reminders, context, or photo plans.',
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
    nextErrors.hypothesis = 'Capture the question or expectation you are testing.';
  }
  if (!form.procedure.trim()) {
    nextErrors.procedure = 'Add the repeatable steps before saving.';
  }

  return nextErrors;
}

export default function NewExperimentScreen() {
  const theme = useAppTheme();
  const colors = theme.activeColors;
  const [form, setForm] = useState(initialExperimentFormState);
  const [errors, setErrors] = useState<Partial<Record<keyof ExperimentFormState, string>>>({});
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    const nextErrors = buildErrors(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);

    try {
      await createExperimentDraft(toExperimentDraftInput(form));
      startTransition(() => {
        setForm(initialExperimentFormState);
        setErrors({});
      });
      router.push('/track');
    } finally {
      setIsSaving(false);
    }
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
          First Core Flow
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
          Create an experiment
        </Text>
        <Text style={[styles.subtitle, { color: colors.text }]}>
          Start the experiment with the core setup, then update the results and observations later
          from the experiment record.
        </Text>
      </View>

      <View
        style={[
          styles.highlightCard,
          {
            backgroundColor: colors.primary,
            borderRadius: theme.layout.radius,
          },
        ]}>
        <Text style={styles.highlightTitle}>What the results field means</Text>
        <Text style={styles.highlightBody}>
          This is where you record what actually happened. If you have not run the experiment yet,
          you can leave it blank and fill it in later from the Track tab.
        </Text>
      </View>

      <View style={styles.formSection}>
        {fields.map((field) => (
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
                setForm((current) => ({ ...current, [field.key]: value }));
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
          styles.noteCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.primary,
            borderRadius: theme.layout.radius,
          },
        ]}>
        <Text style={[styles.noteTitle, { color: colors.text }]}>Photos</Text>
        <Text style={[styles.noteBody, { color: colors.text }]}>
          Attach experiment photos now, or save first and add more later from the experiment record.
        </Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => {
            void pickExperimentPhotos(form.photoAssets).then((photoAssets) => {
              setForm((current) => ({ ...current, photoAssets }));
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
              <Image
                key={photo.id}
                source={{ uri: photo.uri }}
                style={[styles.photoThumb, { borderColor: colors.primary }]}
              />
            ))}
          </View>
        ) : null}
      </View>

      <View
        style={[
          styles.noteCard,
          {
            backgroundColor: colors.surface,
            borderColor: colors.primary,
            borderRadius: theme.layout.radius,
          },
        ]}>
        <Text style={[styles.noteTitle, { color: colors.text }]}>After saving</Text>
        <Text style={[styles.noteBody, { color: colors.text }]}>
          The record appears in Track immediately, where you can reopen it to edit procedure,
          results, notes, attached photos, and the photo plan.
        </Text>
        <View style={styles.actions}>
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
          <Link href="/track" asChild>
            <Pressable
              accessibilityRole="button"
              style={StyleSheet.flatten([
                styles.secondaryButton,
                {
                  backgroundColor: colors.background,
                  borderColor: colors.primary,
                },
              ])}>
              <Text style={[styles.secondaryButtonText, { color: colors.text }]}>
                View existing experiments
              </Text>
            </Pressable>
          </Link>
        </View>
      </View>
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
  highlightCard: {
    gap: 8,
    padding: 18,
  },
  highlightTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '800',
  },
  highlightBody: {
    color: '#ebfef0',
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
  noteCard: {
    borderWidth: 1,
    gap: 10,
    padding: 16,
  },
  noteTitle: {
    fontSize: 17,
    fontWeight: '800',
  },
  noteBody: {
    fontSize: 14,
    lineHeight: 20,
  },
  actions: {
    gap: 10,
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
  primaryButton: {
    alignItems: 'center',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
  primaryButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '800',
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
});
