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
import {useNavigation} from '@react-navigation/native';
import {ArrowLeft, Upload, X} from 'lucide-react-native';
import {useSelector} from 'react-redux';
import {Picker} from '@react-native-picker/picker';
import {launchImageLibrary} from 'react-native-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
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
  isSmallScreen,
  theme,
} from './styles';

const FORM_STORAGE_KEY = 'createBlogFormData';

const CreateBlogScreen = () => {
  const navigation = useNavigation();
  const {user, isAuthenticated} = useSelector(state => state.auth);
  const {createBlog, isCreating} = useBlog();

  // Form state
  const [formData, setFormData] = useState({
    title: '',
    shortDescription: '',
    description: '',
    status: 'active',
  });
  const [errors, setErrors] = useState({});
  const [focusedField, setFocusedField] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load saved form data on mount
  useEffect(() => {
    loadSavedFormData();
  }, []);

  // Save form data whenever it changes
  useEffect(() => {
    saveFormData();
  }, [formData, imageFile]);

  const loadSavedFormData = async () => {
    try {
      const savedData = await AsyncStorage.getItem(FORM_STORAGE_KEY);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        setFormData(parsedData.formData || formData);
        if (parsedData.imagePreview) {
          setImagePreview(parsedData.imagePreview);
        }
      }
    } catch (error) {
      console.error('Error loading saved form data:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveFormData = async () => {
    try {
      const dataToSave = {
        formData,
        imagePreview,
      };
      await AsyncStorage.setItem(FORM_STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  };

  const clearSavedFormData = async () => {
    try {
      await AsyncStorage.removeItem(FORM_STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing saved form data:', error);
    }
  };

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
      }
    });
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
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
      };

      await createBlog(blogData, imageFile);

      // Clear form data on success
      await clearSavedFormData();
      setFormData({
        title: '',
        shortDescription: '',
        description: '',
        status: 'active',
      });
      setImageFile(null);
      setImagePreview(null);

      Toast.show({
        type: 'success',
        text1: 'Success',
        text2: 'Blog created successfully!',
      });

      navigation.goBack();
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create blog. Please try again.',
      });
    }
  };

  const clearFormData = () => {
    Alert.alert('Clear Form', 'Are you sure you want to clear all form data?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Clear',
        style: 'destructive',
        onPress: async () => {
          setFormData({
            title: '',
            shortDescription: '',
            description: '',
            status: 'active',
          });
          setImageFile(null);
          setImagePreview(null);
          setErrors({});
          await clearSavedFormData();
        },
      },
    ]);
  };

  const handleGoBack = () => {
    const hasUnsavedChanges =
      formData.title ||
      formData.shortDescription ||
      formData.description ||
      imageFile;

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

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Loading message="Loading..." />
      </View>
    );
  }

  if (!isAuthenticated || !user) {
    return (
      <View style={styles.emptyStateContainer}>
        <Text style={styles.emptyStateTitle}>Authentication Required</Text>
        <Text style={styles.emptyStateDescription}>
          Please log in to create a blog post
        </Text>
        <TouchableOpacity
          style={getButtonStyle('primary')}
          onPress={() => navigation.navigate('Login')}>
          <Text style={getButtonTextStyle('primary')}>Go to Login</Text>
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

  const hasFormData = formData.title || formData.description || imageFile;

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

          <View
            style={[
              styles.headerContent,
              isSmallScreen() && styles.smallScreen.headerContent,
            ]}>
            <View
              style={[
                styles.headerLeft,
                isSmallScreen() && styles.smallScreen.headerLeft,
              ]}>
              <Text
                style={[
                  styles.title,
                  isSmallScreen() && styles.smallScreen.title,
                ]}>
                Create New Blog
              </Text>
              <Text style={styles.subtitle}>
                Welcome, {user?.name}! Share your thoughts with the world
              </Text>
            </View>

            {hasFormData && (
              <TouchableOpacity
                style={styles.clearButton}
                onPress={clearFormData}
                activeOpacity={0.7}>
                <Text style={styles.clearButtonText}>Clear Form</Text>
              </TouchableOpacity>
            )}
          </View>
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
          <FormField label="Featured Image (Optional)">
            {!imagePreview ? (
              <TouchableOpacity
                style={styles.imageUploadContainer}
                onPress={handleImagePicker}
                activeOpacity={0.7}>
                <Upload
                  size={48}
                  color={theme.colors.gray400}
                  style={styles.uploadIcon}
                />
                <Text style={styles.uploadText}>Tap to upload image</Text>
                <Text style={styles.uploadSubtext}>
                  PNG, JPG, GIF up to 5MB
                </Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.imagePreviewContainer}>
                <Image
                  source={{uri: imagePreview}}
                  style={styles.imagePreview}
                  resizeMode="cover"
                />
                <TouchableOpacity
                  style={styles.removeImageButton}
                  onPress={removeImage}
                  activeOpacity={0.7}>
                  <X size={16} color={theme.colors.white} />
                </TouchableOpacity>
              </View>
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
                getButtonStyle('primary', isCreating),
                styles.actionButton,
                isSmallScreen() && styles.smallScreen.actionButton,
              ]}
              onPress={handleSubmit}
              disabled={isCreating}
              activeOpacity={0.7}>
              <Text style={getButtonTextStyle('primary')}>
                {isCreating ? 'Creating...' : 'Create Blog'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CreateBlogScreen;
