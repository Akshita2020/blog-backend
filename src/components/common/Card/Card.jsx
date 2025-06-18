import React from 'react';
import {View, TouchableOpacity} from 'react-native';
import styles from './styles';

const Card = ({
  children,
  style,
  onPress,
  disabled = false,
  shadow = 'lg',
  padding = 'md',
  hover = false,
  backgroundColor = '#FFFFFF',
  borderRadius = 12,
  ...props
}) => {
  const getCardStyle = () => {
    let cardStyle = [styles.baseCard];

    // Add shadow styles
    if (shadow) {
      cardStyle.push(
        styles[`shadow${shadow.charAt(0).toUpperCase() + shadow.slice(1)}`],
      );
    }

    // Add padding styles
    if (padding) {
      cardStyle.push(
        styles[`padding${padding.charAt(0).toUpperCase() + padding.slice(1)}`],
      );
    }

    // Add hover effect if enabled
    if (hover && onPress) {
      cardStyle.push(styles.hoverable);
    }

    // Custom background color
    if (backgroundColor !== '#FFFFFF') {
      cardStyle.push({backgroundColor});
    }

    // Custom border radius
    if (borderRadius !== 12) {
      cardStyle.push({borderRadius});
    }

    // Custom styles
    if (style) {
      cardStyle.push(style);
    }

    return cardStyle;
  };

  // If onPress is provided, use TouchableOpacity
  if (onPress) {
    return (
      <TouchableOpacity
        style={getCardStyle()}
        onPress={onPress}
        disabled={disabled}
        activeOpacity={hover ? 0.95 : 0.8}
        {...props}>
        {children}
      </TouchableOpacity>
    );
  }

  // Otherwise, use regular View
  return (
    <View style={getCardStyle()} {...props}>
      {children}
    </View>
  );
};

export default Card;
