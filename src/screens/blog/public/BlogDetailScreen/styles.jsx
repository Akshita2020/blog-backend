import {StyleSheet, Dimensions} from 'react-native';

const {width, height} = Dimensions.get('window');

const colors = {
  primary: '#3B82F6',
  primaryLight: '#EFF6FF',
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
  gray500: '#6B7280',
  gray600: '#4B5563',
  gray700: '#374151',
  gray800: '#1F2937',
  gray900: '#111827',
  white: '#FFFFFF',
  black: '#000000',
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
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.black,
    shadowOffset: {
      width: 0,
      height: 10,
    },
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
    paddingBottom: spacing.xl,
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.white,
    ...shadows.sm,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: borderRadius.md,
  },
  backButtonText: {
    color: colors.gray700,
    marginLeft: spacing.sm,
    fontWeight: '500',
    fontSize: 16,
  },
  shareButton: {
    backgroundColor: colors.primaryLight,
    padding: spacing.sm,
    borderRadius: borderRadius.full,
  },

  // Image Styles
  featuredImage: {
    width: width,
    height: width * 0.6,
  },
  imageContainer: {
    overflow: 'hidden',
  },

  // Card Styles
  card: {
    backgroundColor: colors.white,
    marginHorizontal: spacing.md,
    marginTop: spacing.md,
    borderRadius: borderRadius.lg,
    overflow: 'hidden',
    ...shadows.md,
  },
  cardContent: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
  },

  // Owner Controls
  ownerControls: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.full,
    marginLeft: spacing.sm,
  },
  editButton: {
    backgroundColor: colors.primaryLight,
  },
  deleteButton: {
    backgroundColor: colors.dangerLight,
  },

  // Status Badge
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  statusBadgeActive: {
    backgroundColor: colors.successLight,
  },
  statusBadgeDraft: {
    backgroundColor: colors.warningLight,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  statusBadgeTextActive: {
    color: colors.success,
  },
  statusBadgeTextDraft: {
    color: colors.warning,
  },

  // Title
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.gray900,
    textAlign: 'center',
    marginBottom: spacing.md,
    lineHeight: 32,
  },

  // Meta Information
  metaContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: spacing.md,
    marginBottom: spacing.sm,
  },
  metaText: {
    color: colors.gray500,
    fontSize: 14,
    marginLeft: spacing.xs,
  },

  // Category Badge
  categoryContainer: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  categoryBadge: {
    backgroundColor: colors.primaryLight,
    paddingHorizontal: spacing.sm + 2,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
  },
  categoryBadgeText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '600',
  },

  // Short Description
  shortDescriptionContainer: {
    backgroundColor: colors.gray50,
    padding: spacing.md,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.lg,
  },
  shortDescriptionText: {
    color: colors.gray700,
    fontSize: 16,
    lineHeight: 24,
  },

  // Main Content
  contentContainer: {
    marginBottom: spacing.lg,
  },
  contentText: {
    color: colors.gray900,
    fontSize: 16,
    lineHeight: 28,
    textAlign: 'justify',
  },

  // Tags Section
  tagsSection: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: spacing.lg,
  },
  tagsTitle: {
    color: colors.gray600,
    fontWeight: '600',
    marginBottom: spacing.sm,
    fontSize: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tagBadge: {
    backgroundColor: colors.gray100,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.full,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  tagBadgeText: {
    color: colors.gray700,
    fontSize: 12,
    fontWeight: '500',
  },

  // Footer
  footer: {
    borderTopWidth: 1,
    borderTopColor: colors.gray200,
    paddingTop: spacing.md,
    marginTop: spacing.lg,
  },
  footerText: {
    color: colors.gray500,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Bottom Actions
  bottomActions: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButtonLeft: {
    flex: 1,
    marginRight: spacing.sm,
  },
  actionButtonRight: {
    flex: 1,
  },
  singleActionButton: {
    width: '100%',
  },

  // Error State
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    backgroundColor: colors.gray50,
  },
  errorTitle: {
    color: colors.danger,
    textAlign: 'center',
    marginBottom: spacing.md,
    fontSize: 18,
    fontWeight: '600',
  },
  errorSubtitle: {
    color: colors.gray600,
    textAlign: 'center',
    marginBottom: spacing.lg,
    fontSize: 16,
    lineHeight: 24,
  },
  errorActions: {
    flexDirection: 'row',
  },
  errorActionLeft: {
    marginRight: spacing.sm,
  },

  // Loading State
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.gray50,
  },

  // Button Variants
  button: {
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 44,
  },
  buttonPrimary: {
    backgroundColor: colors.primary,
  },
  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray300,
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
  buttonDisabled: {
    opacity: 0.6,
  },

  // Responsive Styles
  smallScreen: {
    cardContent: {
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.md,
    },
    title: {
      fontSize: 20,
      lineHeight: 28,
    },
  },

  // Animation Styles
  fadeIn: {
    opacity: 1,
  },
  fadeOut: {
    opacity: 0,
  },

  // Accessibility Styles
  accessibilityFocus: {
    borderWidth: 2,
    borderColor: colors.primary,
  },
});

// Utility functions for dynamic styles
export const getStatusBadgeStyle = status => [
  styles.statusBadge,
  status === 'active' ? styles.statusBadgeActive : styles.statusBadgeDraft,
];

export const getStatusBadgeTextStyle = status => [
  styles.statusBadgeText,
  status === 'active'
    ? styles.statusBadgeTextActive
    : styles.statusBadgeTextDraft,
];

export const getButtonStyle = (variant, disabled = false) => [
  styles.button,
  variant === 'primary' ? styles.buttonPrimary : styles.buttonOutline,
  disabled && styles.buttonDisabled,
];

export const getButtonTextStyle = variant => [
  styles.buttonText,
  variant === 'primary' ? styles.buttonTextPrimary : styles.buttonTextOutline,
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
