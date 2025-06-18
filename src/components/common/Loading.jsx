import React from 'react';
import {View, ActivityIndicator, Text} from 'react-native';

const Loading = ({message = 'Loading...', size = 'large'}) => {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <ActivityIndicator size={size} color="#3B82F6" />
      <Text className="text-gray-600 mt-4 text-base">{message}</Text>
    </View>
  );
};

export default Loading;
