import {StyleSheet} from 'react-native';
const styles = StyleSheet.create({
  baseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#F3F4F6',
  },

  // Shadow variations
  shadowSm: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },

  shadowMd: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  shadowLg: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },

  shadowXl: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },

  // Padding variations
  paddingXs: {
    padding: 8,
  },

  paddingSm: {
    padding: 12,
  },

  paddingMd: {
    padding: 16,
  },

  paddingLg: {
    padding: 20,
  },

  paddingXl: {
    padding: 24,
  },

  // Hover effect
  hoverable: {
    transform: [{scale: 1}],
  },
});

export default styles;