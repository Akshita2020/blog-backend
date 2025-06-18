import React from 'react';
import {View, TextInput} from 'react-native';
import styles from './styles';

const Input = ({
  placeholder,
  value,
  onChangeText,
  error,
  icon,
  style = {},
  inputStyle = {},
  secureTextEntry = false,
  keyboardType = 'default',
  multiline = false,
  numberOfLines = 1,
  editable = true,
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {icon && <View style={styles.iconContainer}>{icon}</View>}
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        style={[
          styles.input,
          icon && styles.inputWithIcon,
          error && styles.inputError,
          inputStyle,
        ]}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        editable={editable}
        placeholderTextColor="#9CA3AF"
        {...props}
      />
    </View>
  );
};



export default Input;
