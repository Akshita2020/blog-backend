import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles'; 


const DateDisplay = ({
  date,
  format = 'short',
  showIcon = true,
  style = {},
  textStyle = {},
  IconComponent,
}) => {
  const formatDate = dateString => {
    try {
      const dateObj = new Date(dateString);

      const formats = {
        short: {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        },
        long: {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        },
        relative: null,
      };

      if (format === 'relative') {
        const now = new Date();
        const diffTime = Math.abs(now - dateObj);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {return 'Yesterday';}
        if (diffDays < 7) {return `${diffDays} days ago`;}
        if (diffDays < 30) {return `${Math.ceil(diffDays / 7)} weeks ago`;}
        if (diffDays < 365) {return `${Math.ceil(diffDays / 30)} months ago`;}
        return `${Math.ceil(diffDays / 365)} years ago`;
      }

      return dateObj.toLocaleDateString('en-US', formats[format]);
    } catch (error) {
      return 'Unknown date';
    }
  };

  return (
    <View style={[styles.container, style]}>
      {showIcon && IconComponent && (
        <View style={styles.icon}>{IconComponent}</View>
      )}
      <Text style={[styles.text, textStyle]}>{formatDate(date)}</Text>
    </View>
  );
};



export default DateDisplay;
