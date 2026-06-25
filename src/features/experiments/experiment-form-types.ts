import type {
  ExperimentInput,
  ExperimentPhotoAsset,
  ExperimentResultEntry,
} from './experiment-store';

export interface ExperimentFormState {
  title: string;
  category: string;
  hypothesis: string;
  procedure: string;
  dataPlan: string;
  observationsNotes: string;
  resultEntries: ExperimentResultEntry[];
  notes: string;
  conclusionNotes: string;
  plannedAttachmentCount: string;
  photoAssets: ExperimentPhotoAsset[];
}

export const initialExperimentFormState: ExperimentFormState = {
  title: '',
  category: '',
  hypothesis: '',
  procedure: '',
  dataPlan: '',
  observationsNotes: '',
  resultEntries: [],
  notes: '',
  conclusionNotes: '',
  plannedAttachmentCount: '0',
  photoAssets: [],
};

export function toExperimentInput(form: ExperimentFormState): ExperimentInput {
  const parsedCount = Number.parseInt(form.plannedAttachmentCount, 10);

  return {
    title: form.title,
    category: form.category,
    hypothesis: form.hypothesis,
    procedure: form.procedure,
    dataPlan: form.dataPlan,
    observationsNotes: form.observationsNotes,
    resultEntries: form.resultEntries.map((entry) => ({
      ...entry,
      notes: entry.notes.trim(),
    })),
    notes: form.notes,
    conclusionNotes: form.conclusionNotes,
    plannedAttachmentCount: Number.isNaN(parsedCount) ? 0 : Math.max(0, parsedCount),
    photoAssets: form.photoAssets,
  };
}

export function fromExperimentInput(input: ExperimentInput): ExperimentFormState {
  return {
    title: input.title,
    category: input.category,
    hypothesis: input.hypothesis,
    procedure: input.procedure,
    dataPlan: input.dataPlan,
    observationsNotes: input.observationsNotes,
    resultEntries: input.resultEntries,
    notes: input.notes,
    conclusionNotes: input.conclusionNotes,
    plannedAttachmentCount: String(input.plannedAttachmentCount),
    photoAssets: input.photoAssets,
  };
}
