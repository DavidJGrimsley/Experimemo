import { router } from 'expo-router';
import { startTransition, useState } from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';

import { AppButton } from '@/components/app-button';
import { AppTextField } from '@/components/app-text-field';
import { AppText } from '@/components/app-text';
import { ScreenHeader } from '@/components/screen-header';
import { SurfaceCard } from '@/components/surface-card';
import { useAppTheme } from '@/theme/provider';

import {
  initialExperimentFormState,
  toExperimentInput,
  type ExperimentFormState,
} from '../experiments/experiment-form-types';
import { pickExperimentPhotos } from '../experiments/photo-picker';
import { createExperiment } from '../experiments/experiment-store';

type ExperimentFormTextFieldKey = Exclude<
  keyof ExperimentFormState,
  'photoAssets' | 'resultEntries'
>;

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
    placeholder: 'Plant growth with indirect sunlight',
  },
  {
    key: 'category',
    label: 'Category',
    placeholder: 'Botany, Chemistry, Physics',
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
    placeholder: 'List the setup, materials, and repeatable steps.',
    multiline: true,
  },
  {
    key: 'dataPlan',
    label: 'Data collection plan',
    placeholder: 'What measurements, photos, and observations will you capture?',
    multiline: true,
  },
  {
    key: 'observationsNotes',
    label: 'Observations',
    placeholder: 'You can leave this blank until you start recording observations.',
    multiline: true,
  },
  {
    key: 'notes',
    label: 'Field notes',
    placeholder: 'Capture reminders, context, or setup details.',
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
  const [formVersion, setFormVersion] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    const nextErrors = buildErrors(form);

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setIsSaving(true);

    try {
      await createExperiment(toExperimentInput(form));
      startTransition(() => {
        setForm(initialExperimentFormState);
        setErrors({});
        setFormVersion((current) => current + 1);
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
      <ScreenHeader
        showInfoAction
        subtitle="Capture the plan now, then come back to update observations, notes, and photos as the experiment unfolds."
        title="Create experiment"
      />

      <View style={styles.formSection}>
        {fields.map((field) => (
          <AppTextField
            error={errors[field.key]}
            key={`${formVersion}-${field.key}`}
            keyboardType={field.keyboardType}
            label={field.label}
            multiline={field.multiline}
            onChangeText={(value) => {
              setForm((current) => ({ ...current, [field.key]: value }));
              setErrors((current) => ({ ...current, [field.key]: undefined }));
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
          Photos
        </AppText>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 14,
            lineHeight: 20,
          }}>
          Add photos now or attach them later from the experiment record.
        </AppText>
        <AppButton
          label="Add photos"
          onPress={() => {
            void pickExperimentPhotos(form.photoAssets).then((photoAssets) => {
              setForm((current) => ({ ...current, photoAssets }));
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
              <Image
                key={photo.id}
                source={{ uri: photo.uri }}
                style={[styles.photoThumb, { borderColor: colors.primary }]}
              />
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
          Save and continue later
        </AppText>
        <AppText
          style={{
            color: colors.text,
            fontFamily: theme.typography.fontBody,
            fontSize: 14,
            lineHeight: 20,
          }}>
          Your experiment appears in Track right away so you can keep building it out whenever you
          need to.
        </AppText>
        <View style={styles.actions}>
          <AppButton
            disabled={isSaving}
            label={isSaving ? 'Saving...' : 'Save experiment'}
            onPress={() => {
              void handleSave();
            }}
            style={{
              alignSelf: 'stretch',
              backgroundColor: colors.secondary,
              borderRadius: 999,
              minHeight: 48,
              opacity: isSaving ? 0.7 : 1,
            }}
          />
        </View>
      </SurfaceCard>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  actions: {
    gap: 10,
  },
  content: {
    gap: 16,
    padding: 20,
    paddingBottom: 28,
  },
  formSection: {
    gap: 12,
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
});
