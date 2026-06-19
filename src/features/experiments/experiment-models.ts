export type ExperimentStatus = 'active' | 'complete';

export interface ExperimentPhotoAsset {
  id: string;
  uri: string;
  fileName: string | null;
  mimeType: string | null;
  width: number;
  height: number;
}

export interface ExperimentResultEntry {
  id: string;
  recordedAt: string;
  notes: string;
  photoAssets: ExperimentPhotoAsset[];
}

export interface ExperimentRecord {
  id: string;
  title: string;
  category: string;
  hypothesis: string;
  procedure: string;
  dataPlan: string;
  observationsNotes: string;
  resultEntries: ExperimentResultEntry[];
  notes: string;
  conclusionNotes: string;
  plannedAttachmentCount: number;
  photoAssets: ExperimentPhotoAsset[];
  status: ExperimentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExperimentInput {
  title: string;
  category: string;
  hypothesis: string;
  procedure: string;
  dataPlan: string;
  observationsNotes: string;
  resultEntries: ExperimentResultEntry[];
  notes: string;
  conclusionNotes: string;
  plannedAttachmentCount: number;
  photoAssets: ExperimentPhotoAsset[];
}

export const seedExperiments: ExperimentRecord[] = [
  {
    id: 'experiment-seed-1',
    title: 'Bean sprouts under different light conditions',
    category: 'Botany',
    hypothesis:
      'Bean sprouts exposed to indirect daylight will grow taller than sprouts kept under a desk lamp for the same duration.',
    procedure:
      'Plant matching bean seeds in two trays, water them equally, place one tray near a window and the other under a desk lamp, then measure height every 24 hours.',
    dataPlan: 'Record height, color changes, and moisture level once per day for seven days.',
    observationsNotes:
      'Window tray currently shows slightly faster growth after the first 48 hours.',
    resultEntries: [
      {
        id: 'result-seed-1',
        recordedAt: '2026-06-16T17:10:00.000Z',
        notes:
          'Window tray stems are taller and greener than the desk lamp tray after the first measurement cycle.',
        photoAssets: [],
      },
    ],
    notes: 'Need clearer labels for tray photos before the next measurement cycle.',
    conclusionNotes: '',
    plannedAttachmentCount: 2,
    photoAssets: [],
    status: 'active',
    createdAt: '2026-06-14T09:30:00.000Z',
    updatedAt: '2026-06-16T17:10:00.000Z',
  },
  {
    id: 'experiment-seed-2',
    title: 'Cooling rate of metal versus glass containers',
    category: 'Physics',
    hypothesis:
      'Water stored in a metal container will lose heat faster than water stored in a glass container of the same size.',
    procedure:
      'Fill matched containers with hot water, measure initial temperature, then log temperature every five minutes for thirty minutes.',
    dataPlan: 'Track time, temperature, room conditions, and any handling disturbances.',
    observationsNotes: 'Draft setup ready; first timed run has not been started yet.',
    resultEntries: [],
    notes: 'Bring insulated gloves and set up tripod before running measurements.',
    conclusionNotes: '',
    plannedAttachmentCount: 0,
    photoAssets: [],
    status: 'active',
    createdAt: '2026-06-15T13:00:00.000Z',
    updatedAt: '2026-06-15T13:00:00.000Z',
  },
];
