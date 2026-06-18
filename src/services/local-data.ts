import {
  seedExperiments,
  type ExperimentDraftInput,
  type ExperimentRecord,
} from '../features/experiments/experiment-models';

let experiments: ExperimentRecord[] = [...seedExperiments];

export async function ensureLocalDataReady(): Promise<void> {
  experiments = experiments.length > 0 ? experiments : [...seedExperiments];
}

export async function listExperiments(): Promise<ExperimentRecord[]> {
  await ensureLocalDataReady();
  return [...experiments].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getExperimentById(id: string): Promise<ExperimentRecord | null> {
  await ensureLocalDataReady();
  return experiments.find((experiment) => experiment.id === id) ?? null;
}

export async function createExperimentDraft(
  input: ExperimentDraftInput
): Promise<ExperimentRecord> {
  await ensureLocalDataReady();
  const timestamp = new Date().toISOString();
  const experiment: ExperimentRecord = {
    id: `experiment-${Date.now()}`,
    title: input.title.trim(),
    category: input.category.trim() || 'General',
    hypothesis: input.hypothesis.trim(),
    procedure: input.procedure.trim(),
    dataPlan: input.dataPlan.trim(),
    resultsNotes: input.resultsNotes.trim(),
    notes: input.notes.trim(),
    plannedAttachmentCount: input.plannedAttachmentCount,
    photoAssets: input.photoAssets,
    status: input.resultsNotes.trim() ? 'active' : 'draft',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  experiments = [experiment, ...experiments];
  return experiment;
}

export async function updateExperiment(
  id: string,
  input: ExperimentDraftInput
): Promise<ExperimentRecord | null> {
  await ensureLocalDataReady();
  const existing = experiments.find((experiment) => experiment.id === id);

  if (!existing) {
    return null;
  }

  const updated: ExperimentRecord = {
    ...existing,
    title: input.title.trim(),
    category: input.category.trim() || 'General',
    hypothesis: input.hypothesis.trim(),
    procedure: input.procedure.trim(),
    dataPlan: input.dataPlan.trim(),
    resultsNotes: input.resultsNotes.trim(),
    notes: input.notes.trim(),
    plannedAttachmentCount: input.plannedAttachmentCount,
    photoAssets: input.photoAssets,
    updatedAt: new Date().toISOString(),
    status: input.resultsNotes.trim() ? 'active' : existing.status,
  };

  experiments = experiments.map((experiment) => (experiment.id === id ? updated : experiment));
  return updated;
}

export const experimentDataBoundaryNotes = [
  'This default adapter is web-safe and keeps generated apps runnable immediately.',
  'Native builds use local-data.native.ts for the Expo SQLite implementation.',
  'Keep experiment screens behind this adapter boundary so SQLite or Supabase can be swapped later.',
  'Attached photos are stored as local picker URI metadata on the experiment record.',
  'A later media step can replace local URI references with a stronger file-storage strategy if needed.',
];
