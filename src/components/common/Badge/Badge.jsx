import React from 'react';
import {Text, View} from 'react-native';
import {
  BADGE_VARIANTS,
  BADGE_VARIANT_STYLES,
  BADGE_SIZE_STYLES,
  SIZES,
} from '../../../constants/index';
import styles from './styles';

const Badge = ({
  children,
  variant = BADGE_VARIANTS.DEFAULT,
  size = SIZES.MD,
  style = {},
}) => {
  const variantStyle =
    BADGE_VARIANT_STYLES[variant] ||
    BADGE_VARIANT_STYLES[BADGE_VARIANTS.DEFAULT];
  const sizeStyle = BADGE_SIZE_STYLES[size] || BADGE_SIZE_STYLES[SIZES.MD];

  return (
    <View
      style={[
        styles.badge,
        variantStyle.container,
        sizeStyle.container,
        style,
      ]}>
      <Text style={[styles.text, variantStyle.text, sizeStyle.text]}>
        {children}
      </Text>
    </View>
  );
};



export default Badge;
