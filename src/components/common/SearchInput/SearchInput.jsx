import React from 'react';
import {View, TextInput, TouchableOpacity} from 'react-native';
import styles from './styles';

const SearchInput = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search...',
  style = {},
  showClearButton = true,
  SearchIcon,
  ClearIcon,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.searchIconContainer}>{SearchIcon}</View>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        style={styles.input}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
      {showClearButton && value && (
        <TouchableOpacity
          onPress={onClear}
          style={styles.clearButton}
          hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
          {ClearIcon}
        </TouchableOpacity>
      )}
    </View>
  );
};



export default SearchInput;
