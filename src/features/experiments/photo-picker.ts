import * as ImagePicker from 'expo-image-picker';

import type { ExperimentPhotoAsset } from './experiment-models';

function uniqueByUri(assets: ExperimentPhotoAsset[]) {
  const seen = new Set<string>();
  return assets.filter((asset) => {
    if (seen.has(asset.uri)) {
      return false;
    }
    seen.add(asset.uri);
    return true;
  });
}

export async function pickExperimentPhotos(
  currentPhotos: ExperimentPhotoAsset[]
): Promise<ExperimentPhotoAsset[]> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    return currentPhotos;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    allowsMultipleSelection: true,
    mediaTypes: 'images',
    quality: 0.8,
    selectionLimit: 0,
  });

  if (result.canceled || !result.assets) {
    return currentPhotos;
  }

  const selectedPhotos: ExperimentPhotoAsset[] = result.assets.map((asset, index) => ({
    id: asset.assetId ?? `${Date.now()}-${index}`,
    uri: asset.uri,
    fileName: asset.fileName ?? null,
    mimeType: asset.mimeType ?? null,
    width: asset.width,
    height: asset.height,
  }));

  return uniqueByUri([...currentPhotos, ...selectedPhotos]);
}
