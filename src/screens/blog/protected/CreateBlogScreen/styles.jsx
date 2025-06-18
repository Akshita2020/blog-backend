import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const colors = {
  primary: '#3B82F6',
  primaryLight: '#EFF6FF',
  primaryDark: '#1D4ED8',
  secondary: '#6B7280',
  success: '#10B981',
  successLight: '#D1FAE5',
  warning: '#F59E0B',
  warningLight: '#FEF3C7',
  danger: '#EF4444',
  dangerLight: '#FEE2E2',
  gray50: '#F9FAFB',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#D1D5DB',
  gray400: '#9CA3AF',
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  white: '#FFFFFF',
  black: '#000000',
  transparent: 'transparent',
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 9999,
};

const shadows = {
  sm: {
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: {width: 0, height: 10},
    shadowOpacity: 0.15,
    shadowRadius: 15,
    elevation: 5,
  },
};

export const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollContainer: {
    flexGrow: 1,
  },
  contentContainer: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.lg,
    paddingBottom: spacing.xxl,
  },

  // Header Styles
  header: {
    marginBottom: spacing.lg,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.sm,
    marginBottom: spacing.md,
    alignSelf: 'flex-start',
  },
  backButtonText: {
    color: colors.gray700,
    marginLeft: spacing.sm,
    fontSize: 16,
    fontWeight: '500',
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerLeft: {
    flex: 1,
    marginRight: spacing.md,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: spacing.sm,
  },
  subtitle: {
    fontSize: 16,
    color: colors.gray600,
    lineHeight: 24,
  },
  clearButton: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.dangerLight,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.md,
  },
  clearButtonText: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '500',
  },

  // Card Styles
  card: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    ...shadows.md,
  },

  // Form Field Styles
  formField: {
    marginBottom: spacing.lg,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray700,
    marginBottom: spacing.sm,
  },
  labelRequired: {
    color: colors.danger,
  },
  helperText: {
    fontSize: 14,
    color: colors.gray500,
    marginTop: spacing.xs,
    lineHeight: 20,
  },
  errorText: {
    fontSize: 14,
    color: colors.danger,
    marginTop: spacing.xs,
  },

  // Input Styles
  input: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    fontSize: 16,
    color: colors.gray900,
    backgroundColor: colors.white,
  },
  inputError: {
    borderColor: colors.danger,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },

  // Textarea Styles
  textarea: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: 16,
    color: colors.gray900,
    backgroundColor: colors.white,
    textAlignVertical: 'top',
  },
  textareaShort: {
    minHeight: 80,
  },
  textareaLong: {
    minHeight: 200,
  },

  // Image Upload Styles
  imageUploadContainer: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: colors.gray300,
    borderRadius: borderRadius.lg,
    padding: spacing.xl,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.gray50,
    minHeight: 150,
  },
  imageUploadContainerActive: {
    borderColor: colors.primary,
    backgroundColor: colors.primaryLight,
  },
  uploadIcon: {
    marginBottom: spacing.md,
  },
  uploadText: {
    fontSize: 16,
    color: colors.gray600,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  uploadSubtext: {
    fontSize: 14,
    color: colors.gray500,
    textAlign: 'center',
  },
  imagePreviewContainer: {
    position: 'relative',
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
  },
  imagePreview: {
    width: '100%',
    height: 200,
    borderRadius: borderRadius.lg,
  },
  removeImageButton: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    backgroundColor: colors.danger,
    borderRadius: borderRadius.full,
    padding: spacing.xs,
  },

  // Select/Picker Styles
  selectContainer: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
  },
  selectContainerError: {
    borderColor: colors.danger,
  },
  selectText: {
    fontSize: 16,
    color: colors.gray900,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },
  selectPlaceholder: {
    color: colors.gray500,
  },

  // Button Styles
  button: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    minHeight: 44,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonOutline: {
    backgroundColor: colors.transparent,
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  buttonDanger: {
    backgroundColor: colors.danger,
  },
  buttonGhost: {
    backgroundColor: colors.transparent,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  buttonTextPrimary: {
    color: colors.white,
  },
  buttonTextOutline: {
    color: colors.gray700,
  },
  buttonTextDanger: {
    color: colors.white,
  },
  buttonTextGhost: {
    color: colors.gray700,
  },
  buttonIcon: {
    marginRight: spacing.sm,
  },

  // Form Actions
  formActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: spacing.lg,
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
    maxWidth: 120,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray50,
  },
  loadingText: {
    fontSize: 16,
    color: colors.gray600,
    marginTop: spacing.md,
  },

  // Empty State
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    backgroundColor: colors.gray50,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.gray900,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyStateDescription: {
    fontSize: 16,
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.lg,
    lineHeight: 24,
  },

  // Responsive Styles
  smallScreen: {
    title: {
      fontSize: 24,
    },
    headerContent: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
    headerLeft: {
      marginRight: 0,
      marginBottom: spacing.md,
    },
    formActions: {
      flexDirection: 'column',
    },
    actionButton: {
      flex: 0,
      maxWidth: '100%',
      marginBottom: spacing.sm,
    },
  },
});

// Utility functions for dynamic styles
export const getInputStyle = (error, focused) => [
  styles.input,
  error && styles.inputError,
  focused && styles.inputFocused,
];

export const getTextareaStyle = (error, focused, variant = 'short') => [
  styles.textarea,
  variant === 'short' ? styles.textareaShort : styles.textareaLong,
  error && styles.inputError,
  focused && styles.inputFocused,
];

export const getButtonStyle = (variant, disabled = false) => [
  styles.button,
  variant === 'primary' && styles.buttonPrimary,
  variant === 'outline' && styles.buttonOutline,
  variant === 'danger' && styles.buttonDanger,
  variant === 'ghost' && styles.buttonGhost,
  disabled && styles.buttonDisabled,
];

export const getButtonTextStyle = variant => [
  styles.buttonText,
  variant === 'primary' && styles.buttonTextPrimary,
  variant === 'outline' && styles.buttonTextOutline,
  variant === 'danger' && styles.buttonTextDanger,
  variant === 'ghost' && styles.buttonTextGhost,
];

export const getSelectContainerStyle = error => [
  styles.selectContainer,
  error && styles.selectContainerError,
];

// Responsive helper
export const isSmallScreen = () => width < 375;

// Theme object for easy access
export const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
};

export default styles;
