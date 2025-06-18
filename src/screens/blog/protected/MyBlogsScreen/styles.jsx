import {StyleSheet, Dimensions} from 'react-native';

const {width} = Dimensions.get('window');

const colors = {
  primary: '#3B82F6',
  primaryLight: '#EFF6FF',
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
};

const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
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
};

export const styles = StyleSheet.create({
  // Container Styles
  container: {
    flex: 1,
    backgroundColor: colors.gray50,
  },
  scrollContainer: {
    flex: 1,
  },
  contentContainer: {
    padding: spacing.md,
    paddingBottom: spacing.xl,
  },

  // Header Styles
  header: {
    marginBottom: spacing.lg,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.md,
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
  createButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: 44,
  },
  createButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
    marginLeft: spacing.sm,
  },

  // Filter Card Styles
  filterCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.lg,
    ...shadows.md,
  },
  filterRow: {
    flexDirection: 'column',
    gap: spacing.md,
  },
  filterRowTablet: {
    flexDirection: 'row',
  },

  // Search Input Styles
  searchContainer: {
    flex: 1,
    position: 'relative',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
    paddingLeft: spacing.xl + spacing.sm,
    fontSize: 16,
    color: colors.gray900,
    backgroundColor: colors.white,
  },
  searchIcon: {
    position: 'absolute',
    left: spacing.md,
    top: spacing.sm + 6,
    zIndex: 1,
  },

  // Select Styles
  selectContainer: {
    borderWidth: 1,
    borderColor: colors.gray300,
    borderRadius: borderRadius.md,
    backgroundColor: colors.white,
    minWidth: 150,
  },
  selectText: {
    fontSize: 16,
    color: colors.gray900,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm + 2,
  },

  // Blog Card Styles
  blogCard: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  blogCardContent: {
    padding: spacing.md,
  },
  blogHeader: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  blogImage: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  blogImagePlaceholder: {
    width: 60,
    height: 60,
    borderRadius: borderRadius.md,
    backgroundColor: colors.gray200,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  blogContent: {
    flex: 1,
  },
  blogTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.gray900,
    marginBottom: spacing.xs,
    lineHeight: 22,
  },
  blogDescription: {
    fontSize: 14,
    color: colors.gray500,
    lineHeight: 20,
  },
  blogMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing.sm,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.gray100,
  },
  blogDate: {
    fontSize: 12,
    color: colors.gray500,
  },
  blogActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  // Badge Styles
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: borderRadius.sm,
    alignSelf: 'flex-start',
  },
  badgeSuccess: {
    backgroundColor: colors.successLight,
  },
  badgeWarning: {
    backgroundColor: colors.warningLight,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  badgeTextSuccess: {
    color: colors.success,
  },
  badgeTextWarning: {
    color: colors.warning,
  },

  // Action Button Styles
  actionButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 36,
    minHeight: 36,
  },
  actionButtonView: {
    backgroundColor: colors.primaryLight,
  },
  actionButtonEdit: {
    backgroundColor: colors.successLight,
  },
  actionButtonDelete: {
    backgroundColor: colors.dangerLight,
  },

  // Empty State Styles
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
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
  emptyStateButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
  },
  emptyStateButtonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.gray300,
  },
  emptyStateButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  emptyStateButtonTextOutline: {
    color: colors.gray700,
  },

  // Loading Styles
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

  // Stats Footer
  statsContainer: {
    backgroundColor: colors.white,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    marginTop: spacing.md,
    ...shadows.sm,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statsLeft: {
    fontSize: 14,
    color: colors.gray600,
  },
  statsRight: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 14,
    color: colors.gray500,
    marginRight: spacing.xs,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  statValueSuccess: {
    color: colors.success,
  },
  statValueWarning: {
    color: colors.warning,
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
    createButton: {
      alignSelf: 'stretch',
      justifyContent: 'center',
    },
  },
});

// Utility functions
export const getBadgeStyle = variant => [
  styles.badge,
  variant === 'success' && styles.badgeSuccess,
  variant === 'warning' && styles.badgeWarning,
];

export const getBadgeTextStyle = variant => [
  styles.badgeText,
  variant === 'success' && styles.badgeTextSuccess,
  variant === 'warning' && styles.badgeTextWarning,
];

export const getActionButtonStyle = variant => [
  styles.actionButton,
  variant === 'view' && styles.actionButtonView,
  variant === 'edit' && styles.actionButtonEdit,
  variant === 'delete' && styles.actionButtonDelete,
];

export const isTablet = () => width >= 768;
export const isSmallScreen = () => width < 375;

export const theme = {
  colors,
  spacing,
  borderRadius,
  shadows,
};

export default styles;
