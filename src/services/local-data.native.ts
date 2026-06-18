import * as SQLite from 'expo-sqlite';

import {
  seedExperiments,
  type ExperimentDraftInput,
  type ExperimentRecord,
} from '../features/experiments/experiment-models';

const dbPromise = SQLite.openDatabaseAsync('experiment-tracker.db');
let sqliteUnavailable = false;
let memoryExperiments: ExperimentRecord[] = [...seedExperiments];

async function getDb() {
  if (sqliteUnavailable) {
    return null;
  }

  try {
    return await dbPromise;
  } catch {
    sqliteUnavailable = true;
    return null;
  }
}

function sortExperiments(experiments: ExperimentRecord[]) {
  return [...experiments].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

function normalizeRecord(record: {
  id: string;
  title: string;
  category: string;
  hypothesis: string;
  procedure: string;
  data_plan: string;
  results_notes: string;
  notes: string;
  planned_attachment_count: number;
  photo_assets: string;
  status: ExperimentRecord['status'];
  created_at: string;
  updated_at: string;
}): ExperimentRecord {
  return {
    id: record.id,
    title: record.title,
    category: record.category,
    hypothesis: record.hypothesis,
    procedure: record.procedure,
    dataPlan: record.data_plan,
    resultsNotes: record.results_notes,
    notes: record.notes,
    plannedAttachmentCount: record.planned_attachment_count,
    photoAssets: JSON.parse(record.photo_assets || '[]') as ExperimentRecord['photoAssets'],
    status: record.status,
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export async function ensureLocalDataReady(): Promise<void> {
  const db = await getDb();

  if (!db) {
    return;
  }

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS experiments (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        category TEXT NOT NULL,
        hypothesis TEXT NOT NULL,
        procedure TEXT NOT NULL,
        data_plan TEXT NOT NULL,
        results_notes TEXT NOT NULL,
        notes TEXT NOT NULL,
        planned_attachment_count INTEGER NOT NULL DEFAULT 0,
        photo_assets TEXT NOT NULL DEFAULT '[]',
        status TEXT NOT NULL,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );
    `);

    try {
      await db.execAsync(`
        ALTER TABLE experiments
        ADD COLUMN photo_assets TEXT NOT NULL DEFAULT '[]';
      `);
    } catch {
      // Older installs may already have this column, so the migration can noop safely.
    }

    const row = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM experiments'
    );

    if ((row?.count ?? 0) > 0) {
      return;
    }

    for (const experiment of seedExperiments) {
      await db.runAsync(
        `INSERT INTO experiments (
          id,
          title,
          category,
          hypothesis,
          procedure,
          data_plan,
          results_notes,
          notes,
          planned_attachment_count,
          photo_assets,
          status,
          created_at,
          updated_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        experiment.id,
        experiment.title,
        experiment.category,
        experiment.hypothesis,
        experiment.procedure,
        experiment.dataPlan,
        experiment.resultsNotes,
        experiment.notes,
        experiment.plannedAttachmentCount,
        JSON.stringify(experiment.photoAssets),
        experiment.status,
        experiment.createdAt,
        experiment.updatedAt
      );
    }
  } catch {
    sqliteUnavailable = true;
  }
}

export async function listExperiments(): Promise<ExperimentRecord[]> {
  await ensureLocalDataReady();
  const db = await getDb();

  if (!db) {
    return sortExperiments(memoryExperiments);
  }

  try {
    const records = await db.getAllAsync<{
      id: string;
      title: string;
      category: string;
      hypothesis: string;
      procedure: string;
      data_plan: string;
      results_notes: string;
      notes: string;
      planned_attachment_count: number;
      photo_assets: string;
      status: ExperimentRecord['status'];
      created_at: string;
      updated_at: string;
    }>('SELECT * FROM experiments ORDER BY updated_at DESC');

    return records.map(normalizeRecord);
  } catch {
    sqliteUnavailable = true;
    return sortExperiments(memoryExperiments);
  }
}

export async function getExperimentById(id: string): Promise<ExperimentRecord | null> {
  await ensureLocalDataReady();
  const db = await getDb();

  if (!db) {
    return memoryExperiments.find((experiment) => experiment.id === id) ?? null;
  }

  try {
    const record = await db.getFirstAsync<{
      id: string;
      title: string;
      category: string;
      hypothesis: string;
      procedure: string;
      data_plan: string;
      results_notes: string;
      notes: string;
      planned_attachment_count: number;
      photo_assets: string;
      status: ExperimentRecord['status'];
      created_at: string;
      updated_at: string;
    }>('SELECT * FROM experiments WHERE id = ?', id);

    return record ? normalizeRecord(record) : null;
  } catch {
    sqliteUnavailable = true;
    return memoryExperiments.find((experiment) => experiment.id === id) ?? null;
  }
}

export async function createExperimentDraft(
  input: ExperimentDraftInput
): Promise<ExperimentRecord> {
  await ensureLocalDataReady();
  const db = await getDb();
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

  if (!db) {
    memoryExperiments = [experiment, ...memoryExperiments];
    return experiment;
  }

  try {
    await db.runAsync(
      `INSERT INTO experiments (
        id,
        title,
        category,
        hypothesis,
        procedure,
        data_plan,
        results_notes,
        notes,
        planned_attachment_count,
        photo_assets,
        status,
        created_at,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      experiment.id,
      experiment.title,
      experiment.category,
      experiment.hypothesis,
      experiment.procedure,
      experiment.dataPlan,
      experiment.resultsNotes,
      experiment.notes,
      experiment.plannedAttachmentCount,
      JSON.stringify(experiment.photoAssets),
      experiment.status,
      experiment.createdAt,
      experiment.updatedAt
    );

    return experiment;
  } catch {
    sqliteUnavailable = true;
    memoryExperiments = [experiment, ...memoryExperiments];
    return experiment;
  }
}

export async function updateExperiment(
  id: string,
  input: ExperimentDraftInput
): Promise<ExperimentRecord | null> {
  await ensureLocalDataReady();
  const current = await getExperimentById(id);

  if (!current) {
    return null;
  }

  const updated: ExperimentRecord = {
    ...current,
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
    status: input.resultsNotes.trim() ? 'active' : current.status,
  };

  const db = await getDb();

  if (!db) {
    memoryExperiments = memoryExperiments.map((experiment) =>
      experiment.id === id ? updated : experiment
    );
    return updated;
  }

  try {
    await db.runAsync(
      `UPDATE experiments
       SET title = ?, category = ?, hypothesis = ?, procedure = ?, data_plan = ?,
           results_notes = ?, notes = ?, planned_attachment_count = ?, photo_assets = ?, status = ?, updated_at = ?
       WHERE id = ?`,
      updated.title,
      updated.category,
      updated.hypothesis,
      updated.procedure,
      updated.dataPlan,
      updated.resultsNotes,
      updated.notes,
      updated.plannedAttachmentCount,
      JSON.stringify(updated.photoAssets),
      updated.status,
      updated.updatedAt,
      id
    );

    return updated;
  } catch {
    sqliteUnavailable = true;
    memoryExperiments = memoryExperiments.map((experiment) =>
      experiment.id === id ? updated : experiment
    );
    return updated;
  }
}

export const experimentDataBoundaryNotes = [
  'Native builds store experiment records in the local Expo SQLite database.',
  'If SQLite is unavailable, the service falls back to in-memory dummy records so the app still runs.',
  'Feature screens read and write through this boundary instead of speaking to SQLite directly.',
  'Attached photos are stored as local picker URI metadata on the experiment record.',
  'A later media step can replace local URI references with a stronger file-storage strategy if needed.',
];
