import * as SQLite from 'expo-sqlite';

import {
  seedExperiments,
  type ExperimentInput,
  type ExperimentRecord,
  type ExperimentStatus,
} from '../features/experiments/experiment-models';

const dbPromise = SQLite.openDatabaseAsync('experiment-tracker.db');
const bootstrapKey = 'experiments_bootstrapped';
let sqliteUnavailable = false;
let memoryExperiments: ExperimentRecord[] = [];
let memoryHasBootstrappedExperiments = false;

function ensureMemoryBootstrapped() {
  if (memoryHasBootstrappedExperiments) {
    return;
  }

  memoryExperiments = [...seedExperiments];
  memoryHasBootstrappedExperiments = true;
}

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

async function setBootstrapSentinel(db: SQLite.SQLiteDatabase) {
  await db.runAsync(
    'INSERT OR REPLACE INTO app_state (key, value) VALUES (?, ?)',
    bootstrapKey,
    'true'
  );
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
    status: record.status === 'complete' ? 'complete' : 'active',
    createdAt: record.created_at,
    updatedAt: record.updated_at,
  };
}

export async function ensureLocalDataReady(): Promise<void> {
  const db = await getDb();

  if (!db) {
    ensureMemoryBootstrapped();
    return;
  }

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS app_state (
        key TEXT PRIMARY KEY NOT NULL,
        value TEXT NOT NULL
      );
    `);

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

    await db.runAsync(`UPDATE experiments SET status = 'active' WHERE status = 'draft'`);

    const bootstrapRow = await db.getFirstAsync<{ value: string }>(
      'SELECT value FROM app_state WHERE key = ?',
      bootstrapKey
    );

    if (bootstrapRow?.value === 'true') {
      return;
    }

    const row = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM experiments'
    );

    if ((row?.count ?? 0) > 0) {
      await setBootstrapSentinel(db);
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

    await setBootstrapSentinel(db);
  } catch {
    sqliteUnavailable = true;
    ensureMemoryBootstrapped();
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
    ensureMemoryBootstrapped();
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
    ensureMemoryBootstrapped();
    return memoryExperiments.find((experiment) => experiment.id === id) ?? null;
  }
}

export async function createExperiment(input: ExperimentInput): Promise<ExperimentRecord> {
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
    status: 'active',
    createdAt: timestamp,
    updatedAt: timestamp,
  };

  if (!db) {
    memoryHasBootstrappedExperiments = true;
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
    memoryHasBootstrappedExperiments = true;
    memoryExperiments = [experiment, ...memoryExperiments];
    return experiment;
  }
}

export async function deleteExperiments(ids: string[]): Promise<void> {
  await ensureLocalDataReady();

  if (ids.length === 0) {
    return;
  }

  const idsToDelete = new Set(ids);
  const db = await getDb();

  if (!db) {
    memoryExperiments = memoryExperiments.filter((experiment) => !idsToDelete.has(experiment.id));
    return;
  }

  try {
    const placeholders = ids.map(() => '?').join(', ');
    await db.runAsync(`DELETE FROM experiments WHERE id IN (${placeholders})`, ...ids);
  } catch {
    sqliteUnavailable = true;
    memoryExperiments = memoryExperiments.filter((experiment) => !idsToDelete.has(experiment.id));
  }
}

export async function resetExperiments(): Promise<void> {
  await ensureLocalDataReady();
  const db = await getDb();

  if (!db) {
    memoryHasBootstrappedExperiments = true;
    memoryExperiments = [];
    return;
  }

  try {
    await db.runAsync('DELETE FROM experiments');
    await setBootstrapSentinel(db);
  } catch {
    sqliteUnavailable = true;
    memoryHasBootstrappedExperiments = true;
    memoryExperiments = [];
  }
}

export async function updateExperiment(
  id: string,
  input: ExperimentInput
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
    status: current.status === 'complete' ? 'complete' : 'active',
  };

  const db = await getDb();

  if (!db) {
    memoryHasBootstrappedExperiments = true;
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
    memoryHasBootstrappedExperiments = true;
    memoryExperiments = memoryExperiments.map((experiment) =>
      experiment.id === id ? updated : experiment
    );
    return updated;
  }
}

export async function updateExperimentStatus(
  id: string,
  status: ExperimentStatus
): Promise<ExperimentRecord | null> {
  await ensureLocalDataReady();
  const current = await getExperimentById(id);

  if (!current) {
    return null;
  }

  const updated: ExperimentRecord = {
    ...current,
    status,
    updatedAt: new Date().toISOString(),
  };

  const db = await getDb();

  if (!db) {
    memoryHasBootstrappedExperiments = true;
    memoryExperiments = memoryExperiments.map((experiment) =>
      experiment.id === id ? updated : experiment
    );
    return updated;
  }

  try {
    await db.runAsync(
      `UPDATE experiments
       SET status = ?, updated_at = ?
       WHERE id = ?`,
      updated.status,
      updated.updatedAt,
      id
    );

    return updated;
  } catch {
    sqliteUnavailable = true;
    memoryHasBootstrappedExperiments = true;
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
  'Resetting or deleting all records does not re-seed starter experiments after the first bootstrap.',
  'A later media step can replace local URI references with a stronger file-storage strategy if needed.',
];
