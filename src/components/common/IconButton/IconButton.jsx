import React from 'react';
import {TouchableOpacity, ActivityIndicator} from 'react-native';
import {
  ICON_BUTTON_VARIANTS,
  ICON_BUTTON_VARIANT_STYLES,
  ICON_BUTTON_SIZE_STYLES,
  SIZES,
} from '../../../constants/index';
import styles from './styles';


const IconButton = ({
  icon,
  onPress,
  variant = ICON_BUTTON_VARIANTS.GHOST,
  size = SIZES.MD,
  disabled = false,
  loading = false,
  style = {},
  ...props
}) => {
  const variantStyle =
    ICON_BUTTON_VARIANT_STYLES[variant] ||
    ICON_BUTTON_VARIANT_STYLES[ICON_BUTTON_VARIANTS.GHOST];
  const sizeStyle =
    ICON_BUTTON_SIZE_STYLES[size] || ICON_BUTTON_SIZE_STYLES[SIZES.MD];

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
      activeOpacity={0.7}
      {...props}>
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variantStyle.activityIndicator || '#6B7280'}
        />
      ) : (
        icon
      )}
    </TouchableOpacity>
  );
};



export default IconButton;
