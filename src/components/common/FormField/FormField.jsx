import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles';
const FormField = ({
  label,
  error,
  required = false,
  children,
  style = {},
  ...props
}) => {
  return (
    <View style={[styles.container, style]}>
      {label && (
        <Text style={styles.label}>
          {label} {required && <Text style={styles.required}>*</Text>}
        </Text>
      )}
      {children}
      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};



export default FormField;
