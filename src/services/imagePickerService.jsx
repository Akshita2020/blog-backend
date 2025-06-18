import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {PermissionsAndroid, Platform, Alert} from 'react-native';

class ImagePickerService {
  async requestCameraPermission() {
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Camera Permission',
            message: 'App needs camera permission to take photos',
            buttonNeutral: 'Ask Me Later',
            buttonNegative: 'Cancel',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true;
  }

  getImagePickerOptions() {
    return {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };
  }

  async openCamera() {
    const hasPermission = await this.requestCameraPermission();
    if (!hasPermission) {
      Alert.alert(
        'Permission Required',
        'Camera permission is required to take photos',
      );
      return null;
    }

    return new Promise(resolve => {
      launchCamera(this.getImagePickerOptions(), response => {
        if (response.didCancel || response.error) {
          resolve(null);
        } else if (response.assets && response.assets[0]) {
          resolve(response.assets[0]);
        } else {
          resolve(null);
        }
      });
    });
  }

  async openGallery() {
    return new Promise(resolve => {
      launchImageLibrary(this.getImagePickerOptions(), response => {
        if (response.didCancel || response.error) {
          resolve(null);
        } else if (response.assets && response.assets[0]) {
          resolve(response.assets[0]);
        } else {
          resolve(null);
        }
      });
    });
  }

  showImagePicker() {
    return new Promise(resolve => {
      Alert.alert('Select Image', 'Choose how you want to select an image', [
        {text: 'Cancel', style: 'cancel', onPress: () => resolve(null)},
        {
          text: 'Camera',
          onPress: async () => {
            const result = await this.openCamera();
            resolve(result);
          },
        },
        {
          text: 'Gallery',
          onPress: async () => {
            const result = await this.openGallery();
            resolve(result);
          },
        },
      ]);
    });
  }
}

export const imagePickerService = new ImagePickerService();
