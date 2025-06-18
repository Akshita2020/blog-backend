import React from 'react';
import {TextInput} from 'react-native';
import styles from './styles';

const Textarea = ({
  placeholder,
  value,
  onChangeText,
  numberOfLines = 4,
  error,
  style = {},
  maxLength,
  editable = true,
  ...props
}) => {
  return (
    <TextInput
      placeholder={placeholder}
      value={value}
      onChangeText={onChangeText}
      numberOfLines={numberOfLines}
      multiline={true}
      textAlignVertical="top"
      style={[styles.textarea, error && styles.textareaError, style]}
      placeholderTextColor="#9CA3AF"
      maxLength={maxLength}
      editable={editable}
      {...props}
    />
  );
};



export default Textarea;
