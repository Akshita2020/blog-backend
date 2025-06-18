import React from 'react';
import {View, Text} from 'react-native';
import styles from './styles'; 

const EmptyState = ({icon, title, description, actionButton, style = {}}) => {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.content}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.description}>{description}</Text>
        {actionButton && (
          <View style={styles.actionContainer}>{actionButton}</View>
        )}
      </View>
    </View>
  );
};


export default EmptyState;
