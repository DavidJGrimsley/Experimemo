import type { ExperimentDraftInput, ExperimentPhotoAsset } from './experiment-store';

export interface ExperimentFormState {
  title: string;
  category: string;
  hypothesis: string;
  procedure: string;
  dataPlan: string;
  resultsNotes: string;
  notes: string;
  plannedAttachmentCount: string;
  photoAssets: ExperimentPhotoAsset[];
}

export const initialExperimentFormState: ExperimentFormState = {
  title: '',
  category: '',
  hypothesis: '',
  procedure: '',
  dataPlan: '',
  resultsNotes: '',
  notes: '',
  plannedAttachmentCount: '0',
  photoAssets: [],
};

export function toExperimentDraftInput(form: ExperimentFormState): ExperimentDraftInput {
  const parsedCount = Number.parseInt(form.plannedAttachmentCount, 10);

  return {
    title: form.title,
    category: form.category,
    hypothesis: form.hypothesis,
    procedure: form.procedure,
    dataPlan: form.dataPlan,
    resultsNotes: form.resultsNotes,
    notes: form.notes,
    plannedAttachmentCount: Number.isNaN(parsedCount) ? 0 : Math.max(0, parsedCount),
    photoAssets: form.photoAssets,
  };
}

export function fromExperimentDraftInput(input: ExperimentDraftInput): ExperimentFormState {
  return {
    title: input.title,
    category: input.category,
    hypothesis: input.hypothesis,
    procedure: input.procedure,
    dataPlan: input.dataPlan,
    resultsNotes: input.resultsNotes,
    notes: input.notes,
    plannedAttachmentCount: String(input.plannedAttachmentCount),
    photoAssets: input.photoAssets,
  };
}
