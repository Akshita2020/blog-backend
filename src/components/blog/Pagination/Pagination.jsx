import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {ChevronLeft, ChevronRight} from 'lucide-react-native';
import styles from './styles';


const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  hasNextPage,
  hasPrevPage,
  maxVisiblePages = 5,
  style,
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
  let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

  if (endPage - startPage + 1 < maxVisiblePages) {
    startPage = Math.max(1, endPage - maxVisiblePages + 1);
  }

  // Previous button
  pages.push(
    <TouchableOpacity
      key="prev"
      style={[
        styles.pageButton,
        styles.navButton,
        !hasPrevPage && styles.disabledButton,
      ]}
      onPress={() => hasPrevPage && onPageChange(currentPage - 1)}
      disabled={!hasPrevPage}>
      <ChevronLeft size={16} color={!hasPrevPage ? '#9CA3AF' : '#374151'} />
      <Text style={[styles.navButtonText, !hasPrevPage && styles.disabledText]}>
        Previous
      </Text>
    </TouchableOpacity>,
  );

  // First page
  if (startPage > 1) {
    pages.push(
      <TouchableOpacity
        key={1}
        style={[styles.pageButton, styles.numberButton]}
        onPress={() => onPageChange(1)}>
        <Text style={styles.numberButtonText}>1</Text>
      </TouchableOpacity>,
    );
    if (startPage > 2) {
      pages.push(
        <View key="ellipsis1" style={styles.ellipsis}>
          <Text style={styles.ellipsisText}>...</Text>
        </View>,
      );
    }
  }

  // Page numbers
  for (let i = startPage; i <= endPage; i++) {
    pages.push(
      <TouchableOpacity
        key={i}
        style={[
          styles.pageButton,
          styles.numberButton,
          i === currentPage && styles.activeButton,
        ]}
        onPress={() => onPageChange(i)}>
        <Text
          style={[
            styles.numberButtonText,
            i === currentPage && styles.activeButtonText,
          ]}>
          {i}
        </Text>
      </TouchableOpacity>,
    );
  }

  // Last page
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      pages.push(
        <View key="ellipsis2" style={styles.ellipsis}>
          <Text style={styles.ellipsisText}>...</Text>
        </View>,
      );
    }
    pages.push(
      <TouchableOpacity
        key={totalPages}
        style={[styles.pageButton, styles.numberButton]}
        onPress={() => onPageChange(totalPages)}>
        <Text style={styles.numberButtonText}>{totalPages}</Text>
      </TouchableOpacity>,
    );
  }

  // Next button
  pages.push(
    <TouchableOpacity
      key="next"
      style={[
        styles.pageButton,
        styles.navButton,
        !hasNextPage && styles.disabledButton,
      ]}
      onPress={() => hasNextPage && onPageChange(currentPage + 1)}
      disabled={!hasNextPage}>
      <Text style={[styles.navButtonText, !hasNextPage && styles.disabledText]}>
        Next
      </Text>
      <ChevronRight size={16} color={!hasNextPage ? '#9CA3AF' : '#374151'} />
    </TouchableOpacity>,
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.paginationWrapper}>{pages}</View>
    </View>
  );
};



export default Pagination;
