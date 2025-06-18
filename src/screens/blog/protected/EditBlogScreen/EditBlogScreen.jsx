import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {ArrowLeft, Upload, X} from 'lucide-react-native';
import {useSelector} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import Toast from 'react-native-toast-message';
import useBlog from '../../../../hooks/useBlogActions';
import Loading from '../../../../components/common/LoadingSpinner/LoadingSpinner';
import {
  styles,
  getInputStyle,
  getTextareaStyle,
  getButtonStyle,
  getButtonTextStyle,
  getSelectContainerStyle,
  getImageLabelStyle,
  isSmallScreen,
  theme,
} from './styles';

const EditBlogScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {blogId} = route.params;
  const {user, isAuthenticated} = useSelector(state => state.auth);

  const {
    fetchBlogById,
    updateBlog,
    isLoading: isFetchingBlog,
    isUpdating,
    currentBlog,
    error,
  } = useBlog();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);

  // Image state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Fetch blog data on mount
  useEffect(() => {
    if (blogId && user) {
      fetchBlogById(blogId);
    }
  }, [blogId, user]);

  // Update form data when blog is loaded
  useEffect(() => {
    if (currentBlog) {
      setFormData({
        title: currentBlog.title || '',
        shortDescription: currentBlog.shortDescription || '',
        description: currentBlog.description || '',
        status: currentBlog.status || 'active',
      });

      if (currentBlog.image) {
        setExistingImage(currentBlog.image);
      }
    }
  }, [currentBlog]);

  // Track unsaved changes
  useEffect(() => {
    if (currentBlog) {
      const hasChanges =
        formData.title !== (currentBlog.title || '') ||
        formData.shortDescription !== (currentBlog.shortDescription || '') ||
        formData.description !== (currentBlog.description || '') ||
        formData.status !== (currentBlog.status || 'active') ||
        imageFile !== null ||
        removeExistingImage;

      setHasUnsavedChanges(hasChanges);
    }
  }, [formData, imageFile, removeExistingImage, currentBlog]);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.trim().length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Content is required';
    } else if (formData.description.trim().length < 10) {
      newErrors.description = 'Content must be at least 10 characters';
    }

    if (formData.shortDescription && formData.shortDescription.length > 200) {
      newErrors.shortDescription =
        'Short description must be less than 200 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleImagePicker = () => {
    const options = {
      mediaType: 'photo',
      includeBase64: false,
      maxHeight: 2000,
      maxWidth: 2000,
      quality: 0.8,
    };

    launchImageLibrary(options, response => {
      if (response.didCancel || response.error) {
        return;
      }

      if (response.assets && response.assets[0]) {
        const asset = response.assets[0];
        setImageFile(asset);
        setImagePreview(asset.uri);
        setRemoveExistingImage(false);
      }
    });
  };

  const removeNewImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const removeExistingImageHandler = () => {
    setRemoveExistingImage(true);
  };

  const restoreExistingImage = () => {
    setRemoveExistingImage(false);
    setImageFile(null);
    setImagePreview(null);
  };

  const getImageUrl = imagePath => {
    if (!imagePath) return null;
    // Adjust this based on your API base URL
    return imagePath.startsWith('http')
      ? imagePath
      : `${API_BASE_URL}/${imagePath}`;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      Toast.show({
        type: 'error',
        text1: 'Validation Error',
        text2: 'Please fix the form errors',
      });
      return;
    }

    try {
      const blogData = {
        title: formData.title.trim(),
        shortDescription: formData.shortDescription.trim(),
        description: formData.description.trim(),
        status: formData.status,
        removeImage: removeExistingImage,
      };

      await updateBlog(blogId, blogData, imageFile);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Blog updated successfully!',
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to update blog. Please try again.',
      });
    }
  };

  const handleGoBack = () => {
    if (hasUnsavedChanges) {
      Alert.alert(
        'Unsaved Changes',
        'You have unsaved changes. Are you sure you want to go back?',
        [
          {text: 'Stay', style: 'cancel'},
          {
            text: 'Leave',
            style: 'destructive',
            onPress: () => navigation.goBack(),
          },
        ],
      );
    } else {
      navigation.goBack();
    }
  };

  // Check if current user owns this blog
  const isOwner =
    currentBlog?.userId &&
    user?.id &&
    Number(currentBlog.userId) === Number(user.id);

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateTitle}>Authentication Required</Text>
        <Text style={styles.emptyStateDescription}>
          Please log in to edit blog posts
        </Text>
        <TouchableOpacity
          style={getButtonStyle('primary')}
          onPress={() => navigation.navigate('Login')}>
          <Text style={getButtonTextStyle('primary')}>Go to Login</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (isFetchingBlog) {
    return (
      <View style={styles.loadingContainer}>
        <Loading message="Loading blog..." />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Error Loading Blog</Text>
        <Text style={styles.errorDescription}>
          {error || 'Something went wrong'}
        </Text>
        <TouchableOpacity
          style={getButtonStyle('primary')}
          onPress={() => navigation.navigate('MyBlogs')}>
          <Text style={getButtonTextStyle('primary')}>Back to My Blogs</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (currentBlog && !isOwner) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateTitle}>Access Denied</Text>
        <Text style={styles.emptyStateDescription}>
          You don't have permission to edit this blog post
        </Text>
        <TouchableOpacity
          style={getButtonStyle('primary')}
          onPress={() => navigation.navigate('MyBlogs')}>
          <Text style={getButtonTextStyle('primary')}>Back to My Blogs</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const FormField = ({label, required, error, children, helperText}) => (
    <View style={styles.formField}>
      <Text style={styles.label}>
        {label}
        {required && <Text style={styles.labelRequired}> *</Text>}
      </Text>
      {children}
      {error && <Text style={styles.errorText}>{error}</Text>}
      {helperText && <Text style={styles.helperText}>{helperText}</Text>}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={handleGoBack}
            activeOpacity={0.7}>
            <ArrowLeft size={20} color={theme.colors.gray700} />
            <Text style={styles.backButtonText}>Back</Text>
          </TouchableOpacity>

          <Text
            style={[styles.title, isSmallScreen() && styles.smallScreen.title]}>
            Edit Blog
          </Text>
          <Text style={styles.subtitle}>
            Update your blog post - {formData.title || 'Untitled'}
          </Text>
        </View>

        {/* Form Card */}
        <View style={styles.card}>
          {/* Title Field */}
          <FormField label="Title" required error={errors.title}>
            <TextInput
              style={getInputStyle(errors.title, focusedField === 'title')}
              value={formData.title}
              onChangeText={value => handleInputChange('title', value)}
              placeholder="Enter your blog title..."
              placeholderTextColor={theme.colors.gray400}
              onFocus={() => setFocusedField('title')}
              onBlur={() => setFocusedField(null)}
            />
          </FormField>

          {/* Short Description Field */}
          <FormField
            label="Short Description (Optional)"
            error={errors.shortDescription}
            helperText="This will appear in blog previews and search results">
            <TextInput
              style={getTextareaStyle(
                errors.shortDescription,
                focusedField === 'shortDescription',
                'short',
              )}
              value={formData.shortDescription}
              onChangeText={value =>
                handleInputChange('shortDescription', value)
              }
              placeholder="Brief description of your blog post (will be shown in previews)..."
              placeholderTextColor={theme.colors.gray400}
              multiline
              numberOfLines={3}
              onFocus={() => setFocusedField('shortDescription')}
              onBlur={() => setFocusedField(null)}
            />
          </FormField>

          {/* Image Upload Field */}
          <FormField label="Featured Image">
            {/* Show new image preview if selected */}
            {imagePreview && (
              <View style={[styles.imageContainer, {position: 'relative'}]}>
                <Image
                  source={{uri: imagePreview}}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={removeNewImage}
                  activeOpacity={0.7}>
                  <X size={16} color={theme.colors.white} />
                </TouchableOpacity>
                <Text style={getImageLabelStyle('new')}>
                  New Image Selected
                </Text>
              </View>
            )}

            {/* Show existing image */}
            {existingImage && !removeExistingImage && !imagePreview && (
              <View style={[styles.imageContainer, {position: 'relative'}]}>
                <Image
                  source={{uri: getImageUrl(existingImage)}}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <View style={styles.imageOverlay} />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={removeExistingImageHandler}
                  activeOpacity={0.7}>
                  <X size={16} color={theme.colors.white} />
                </TouchableOpacity>
                <Text style={getImageLabelStyle('current')}>Current Image</Text>
              </View>
            )}

            {/* Show removed image notice */}
            {removeExistingImage && !imagePreview && (
              <View style={styles.imageRemovalNotice}>
                <Text style={styles.imageRemovalText}>
                  Current image will be removed when you save.
                </Text>
                <TouchableOpacity
                  style={styles.restoreImageButton}
                  onPress={restoreExistingImage}
                  activeOpacity={0.7}>
                  <Text style={styles.restoreImageText}>
                    Restore current image
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {/* Upload new image area */}
            {!imagePreview && (
              <TouchableOpacity
                style={styles.imageUploadContainer}
                onPress={handleImagePicker}
                activeOpacity={0.7}>
                <Upload
                  size={48}
                  color={theme.colors.gray400}
                  style={styles.uploadIcon}
                />
                <Text style={styles.uploadText}>
                  {existingImage && !removeExistingImage
                    ? 'Tap to replace current image'
                    : 'Tap to upload image'}
                </Text>
                <Text style={styles.uploadSubtext}>
                  PNG, JPG, GIF up to 5MB
                </Text>
              </TouchableOpacity>
            )}
          </FormField>
          {/* Content Field */}
          <FormField label="Content" required error={errors.description}>
            <TextInput
              style={getTextareaStyle(
                errors.description,
                focusedField === 'description',
                'long',
              )}
              value={formData.description}
              onChangeText={value => handleInputChange('description', value)}
              placeholder="Write your blog content here..."
              placeholderTextColor={theme.colors.gray400}
              multiline
              numberOfLines={12}
              onFocus={() => setFocusedField('description')}
              onBlur={() => setFocusedField(null)}
            />
          </FormField>

          {/* Status Field */}
          <FormField
            label="Status"
            helperText="Published blogs will be visible to all users. Drafts are only visible to you.">
            <View style={getSelectContainerStyle()}>
              <Picker
                selectedValue={formData.status}
                onValueChange={value => handleInputChange('status', value)}
                style={styles.selectText}>
                <Picker.Item label="Publish (Active)" value="active" />
                <Picker.Item label="Save as Draft" value="inactive" />
              </Picker>
            </View>
          </FormField>

          {/* Form Actions */}
          <View
            style={[
              styles.formActions,
              isSmallScreen() && styles.smallScreen.formActions,
            ]}>
            <TouchableOpacity
              style={[
                getButtonStyle('outline'),
                styles.actionButton,
                isSmallScreen() && styles.smallScreen.actionButton,
              ]}
              onPress={handleGoBack}
              activeOpacity={0.7}>
              <Text style={getButtonTextStyle('outline')}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                getButtonStyle('primary', isUpdating),
                styles.actionButton,
                isSmallScreen() && styles.smallScreen.actionButton,
              ]}
              onPress={handleSubmit}
              disabled={isUpdating}
              activeOpacity={0.7}>
              <Text style={getButtonTextStyle('primary')}>
                {isUpdating ? 'Updating...' : 'Update Blog'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default EditBlogScreen;
