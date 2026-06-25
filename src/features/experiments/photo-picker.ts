import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

import type { ExperimentPhotoAsset } from './experiment-models';

type PhotoSource = 'camera' | 'library';

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

function mapPickerAssets(assets: ImagePicker.ImagePickerAsset[]): ExperimentPhotoAsset[] {
  const capturedAt = Date.now();
  return assets.map((asset, index) => ({
    id: asset.assetId ?? `${capturedAt}-${index}`,
    uri: asset.uri,
    fileName: asset.fileName ?? null,
    mimeType: asset.mimeType ?? null,
    width: asset.width,
    height: asset.height,
  }));
}

function appendPickedAssets(
  currentPhotos: ExperimentPhotoAsset[],
  assets: ImagePicker.ImagePickerAsset[] | null | undefined
) {
  if (!assets?.length) {
    return currentPhotos;
  }

  return uniqueByUri([...currentPhotos, ...mapPickerAssets(assets)]);
}

function choosePhotoSource(): Promise<PhotoSource | null> {
  return new Promise((resolve) => {
    let didResolve = false;
    const resolveOnce = (source: PhotoSource | null) => {
      if (didResolve) {
        return;
      }

      didResolve = true;
      resolve(source);
    };

    Alert.alert(
      'Add photos',
      'Choose how to add experiment photos.',
      [
        {
          text: 'Take Photo',
          onPress: () => resolveOnce('camera'),
        },
        {
          text: 'Choose from Library',
          onPress: () => resolveOnce('library'),
        },
        {
          text: 'Cancel',
          style: 'cancel',
          onPress: () => resolveOnce(null),
        },
      ],
      {
        cancelable: true,
        onDismiss: () => resolveOnce(null),
      }
    );
  });
}

async function captureExperimentPhoto(currentPhotos: ExperimentPhotoAsset[]) {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    return currentPhotos;
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    mediaTypes: 'images',
    quality: 0.8,
  });

  if (result.canceled) {
    return currentPhotos;
  }

  return appendPickedAssets(currentPhotos, result.assets);
}

async function chooseExperimentPhotosFromLibrary(currentPhotos: ExperimentPhotoAsset[]) {
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

  if (result.canceled) {
    return currentPhotos;
  }

  return appendPickedAssets(currentPhotos, result.assets);
}

export async function pickExperimentPhotos(
  currentPhotos: ExperimentPhotoAsset[]
): Promise<ExperimentPhotoAsset[]> {
  const source = await choosePhotoSource();

  if (!source) {
    return currentPhotos;
  }

  if (source === 'camera') {
    return captureExperimentPhoto(currentPhotos);
  }

  return chooseExperimentPhotosFromLibrary(currentPhotos);
}
