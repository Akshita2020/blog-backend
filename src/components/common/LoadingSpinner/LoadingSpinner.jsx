import React from 'react';
import {View, ActivityIndicator, Text} from 'react-native';
import {SIZES, SPINNER_SIZE_STYLES} from '../../../constants/index';
import styles from './styles';


const LoadingSpinner = ({
  size = SIZES.MD,
  color = 'blue',
  text,
  style = {},
}) => {
  const sizeValue = SPINNER_SIZE_STYLES[size] || SPINNER_SIZE_STYLES[SIZES.MD];

  const colorValues = {
    blue: '#2563EB',
    black: '#000000',
    gray: '#6B7280',
    red: '#EF4444',
    green: '#10B981',
  };

  const spinnerColor = colorValues[color] || colorValues.blue;

  return (
    <View style={[styles.container, style]}>
      <ActivityIndicator size={sizeValue} color={spinnerColor} />
      {text && <Text style={styles.text}>{text}</Text>}
    </View>
  );
};


export default LoadingSpinner;
