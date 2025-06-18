import React from 'react';
import {TouchableOpacity, Text, View, ActivityIndicator} from 'react-native';
import {
  BUTTON_VARIANTS,
  BUTTON_VARIANT_STYLES,
  BUTTON_SIZE_STYLES,
  SIZES,
} from '../../../constants/index';
import styles from './styles';

const Button = ({
  children,
  title, // Add title prop
  variant = BUTTON_VARIANTS?.PRIMARY || 'primary',
  size = SIZES?.MD || 'md',
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  onPress,
  style = {},
  textStyle = {},
  ...props
}) => {
  // Safely get variant and size styles with fallbacks
  const variantStyle = BUTTON_VARIANT_STYLES?.[variant] || {
    container: {backgroundColor: '#3B82F6'},
    text: {color: '#FFFFFF'},
    activityIndicator: '#ffffff',
  };
  
  const sizeStyle = BUTTON_SIZE_STYLES?.[size] || {
    container: {paddingVertical: 12, paddingHorizontal: 16},
    text: {fontSize: 16},
  };

  const renderContent = () => (
    <View style={styles.content}>
      {loading && (
        <ActivityIndicator
          size="small"
          color={variantStyle.activityIndicator || '#ffffff'}
          style={styles.loader}
        />
      )}
      {icon && iconPosition === 'left' && !loading && (
        <View style={styles.iconLeft}>{icon}</View>
      )}
      <Text style={[styles.text, variantStyle.text, sizeStyle.text, textStyle]}>
        {title || children}
      </Text>
      {icon && iconPosition === 'right' && !loading && (
        <View style={styles.iconRight}>{icon}</View>
      )}
    </View>
  );

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[
        styles.button,
        variantStyle.container,
        sizeStyle.container,
        (disabled || loading) && styles.disabled,
        style,
      ]}
      activeOpacity={0.8}
      {...props}>
      {renderContent()}
    </TouchableOpacity>
  );
};

export default Button;
