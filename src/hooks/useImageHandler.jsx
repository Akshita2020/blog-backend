import {useState} from 'react';
import Toast from 'react-native-toast-message';
import {launchImageLibrary, launchCamera} from 'react-native-image-picker';
import {Alert} from 'react-native';
import {imageSchema} from '../Validation/validation';

const useImageHandler = () => {
  const [imageUri, setImageUri] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);

  const getImageUrl = imagePath => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    return `http://localhost:5000${imagePath}`;
  };

  const validateImage = imageData => {
    try {
      // Adapt validation for React Native image structure
      const validationData = {
        file: {
          uri: imageData.uri,
          type: imageData.type,
          size: imageData.fileSize,
        },
      };

      imageSchema.parse(validationData);
      return true;
    } catch (error) {
      if (error.errors) {
        const firstError = error.errors[0];
        Toast.show({
          type: 'error',
          text1: 'Image Validation Error',
          text2: firstError.message,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Invalid Image',
          text2: 'Please select a valid image file',
        });
      }
      return false;
    }
  };

  const showImagePicker = () => {
    Alert.alert('Select Image', 'Choose an option', [
      {text: 'Camera', onPress: openCamera},
      {text: 'Gallery', onPress: openGallery},
      {text: 'Cancel', style: 'cancel'},
    ]);
  };

  const openCamera = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchCamera(options, handleImageResponse);
  };

  const openGallery = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.8,
      maxWidth: 1024,
      maxHeight: 1024,
    };

    launchImageLibrary(options, handleImageResponse);
  };

  const handleImageResponse = response => {
    if (response.didCancel || response.error) {
      return;
    }

    if (response.assets && response.assets[0]) {
      const imageData = response.assets[0];

      if (validateImage(imageData)) {
        setImageUri(imageData.uri);
        setImagePreview(imageData.uri);
        setRemoveExistingImage(false);
      }
    }
  };

  const handleImageChange = imageData => {
    if (!imageData) return;

    if (validateImage(imageData)) {
      setImageUri(imageData.uri);
      setImagePreview(imageData.uri);
      setRemoveExistingImage(false);
    }
  };

  const removeNewImage = () => {
    setImageUri(null);
    setImagePreview(null);
  };

  const removeExistingImageHandler = () => {
    setExistingImage(null);
    setRemoveExistingImage(true);
  };

  const restoreExistingImage = originalImage => {
    setExistingImage(originalImage);
    setRemoveExistingImage(false);
  };

  const resetImages = () => {
    setImageUri(null);
    setImagePreview(null);
    setExistingImage(null);
    setRemoveExistingImage(false);
  };

  const getCurrentImage = () => {
    if (imageUri) return imageUri;
    if (existingImage && !removeExistingImage)
      return getImageUrl(existingImage);
    return null;
  };

  const hasImage = () => {
    return !!(imageUri || (existingImage && !removeExistingImage));
  };

  return {
    // State
    imageUri,
    imagePreview,
    existingImage,
    removeExistingImage,

    // Computed
    currentImage: getCurrentImage(),
    hasImage: hasImage(),

    // Actions
    showImagePicker,
    openCamera,
    openGallery,
    handleImageChange,
    removeNewImage,
    removeExistingImageHandler,
    restoreExistingImage,
    resetImages,

    // Utilities
    getImageUrl,
    setExistingImage,
  };
};

export default useImageHandler;
