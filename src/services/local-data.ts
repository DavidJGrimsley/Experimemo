import {
  seedExperiments,
  type ExperimentInput,
  type ExperimentRecord,
  type ExperimentStatus,
} from '../features/experiments/experiment-models';

let experiments: ExperimentRecord[] = [];
let hasBootstrappedExperiments = false;

export async function ensureLocalDataReady(): Promise<void> {
  if (hasBootstrappedExperiments) {
    return;
  }

  experiments = [...seedExperiments];
  hasBootstrappedExperiments = true;
}

export async function listExperiments(): Promise<ExperimentRecord[]> {
  await ensureLocalDataReady();
  return [...experiments].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function getExperimentById(id: string): Promise<ExperimentRecord | null> {
  await ensureLocalDataReady();
  return experiments.find((experiment) => experiment.id === id) ?? null;
}

export async function createExperiment(input: ExperimentInput): Promise<ExperimentRecord> {
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
    status: 'active',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  experiments = [experiment, ...experiments];
  return experiment;
}

export async function deleteExperiments(ids: string[]): Promise<void> {
  await ensureLocalDataReady();

  if (ids.length === 0) {
    return;
  }

  const idsToDelete = new Set(ids);
  experiments = experiments.filter((experiment) => !idsToDelete.has(experiment.id));
}

export async function resetExperiments(): Promise<void> {
  await ensureLocalDataReady();
  experiments = [];
}

export async function updateExperiment(
  id: string,
  input: ExperimentInput
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
    status: existing.status === 'complete' ? 'complete' : 'active',
  };

  experiments = experiments.map((experiment) => (experiment.id === id ? updated : experiment));
  return updated;
}

export async function updateExperimentStatus(
  id: string,
  status: ExperimentStatus
): Promise<ExperimentRecord | null> {
  await ensureLocalDataReady();
  const existing = experiments.find((experiment) => experiment.id === id);

  if (!existing) {
    return null;
  }

  const updated: ExperimentRecord = {
    ...existing,
    status,
    updatedAt: new Date().toISOString(),
  };

  experiments = experiments.map((experiment) => (experiment.id === id ? updated : experiment));
  return updated;
}

export const experimentDataBoundaryNotes = [
  'This default adapter is web-safe and keeps generated apps runnable immediately.',
  'Native builds use local-data.native.ts for the Expo SQLite implementation.',
  'Keep experiment screens behind this adapter boundary so SQLite or Supabase can be swapped later.',
  'Attached photos are stored as local picker URI metadata on the experiment record.',
  'Resetting or deleting all records does not re-seed starter experiments in the same app session.',
  'A later media step can replace local URI references with a stronger file-storage strategy if needed.',
];
