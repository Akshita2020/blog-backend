import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  paginationWrapper: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  pageButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    backgroundColor: '#FFFFFF',
    // backgroundColor: '#000000',
    minWidth: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    gap: 4,
  },
  numberButton: {
    minWidth: 40,
  },
  activeButton: {
    // backgroundColor: '#3B82F6',
    backgroundColor: '#000000',

    borderColor: '#3B82F6',
  },
  disabledButton: {
    backgroundColor: '#F9FAFB',
    borderColor: '#E5E7EB',
  },
  navButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  numberButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
  },
  activeButtonText: {
    color: '#FFFFFF',
  },
  disabledText: {
    color: '#9CA3AF',
  },
  ellipsis: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  ellipsisText: {
    fontSize: 14,
    color: '#6B7280',
  },
});

export default styles;