export type ExperimentStatus = 'draft' | 'active' | 'complete';

export interface ExperimentPhotoAsset {
  id: string;
  uri: string;
  fileName: string | null;
  mimeType: string | null;
  width: number;
  height: number;
}

export interface ExperimentRecord {
  id: string;
  title: string;
  category: string;
  hypothesis: string;
  procedure: string;
  dataPlan: string;
  resultsNotes: string;
  notes: string;
  plannedAttachmentCount: number;
  photoAssets: ExperimentPhotoAsset[];
  status: ExperimentStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ExperimentDraftInput {
  title: string;
  category: string;
  hypothesis: string;
  procedure: string;
  dataPlan: string;
  resultsNotes: string;
  notes: string;
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
    resultsNotes: 'Window tray currently shows slightly faster growth after the first 48 hours.',
    notes: 'Need clearer labels for tray photos before the next measurement cycle.',
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
    resultsNotes: 'Draft setup ready; first timed run has not been started yet.',
    notes: 'Bring insulated gloves and set up tripod before running measurements.',
    plannedAttachmentCount: 0,
    photoAssets: [],
    status: 'draft',
    createdAt: '2026-06-15T13:00:00.000Z',
    updatedAt: '2026-06-15T13:00:00.000Z',
  },
];
