import React from 'react';
import {View, Text, SafeAreaView} from 'react-native';
import {BookOpen} from 'lucide-react-native';
import BlogList from '../../../../components/blog/BlogList/BlogList';
import styles from './styles';


const HomeScreen = () => {
  return (
    <SafeAreaView style={styles.conatiner}>
      <View
        style={styles.appHeader}>
        <BookOpen size={24} color="#6B7280" />
        <Text
          style={styles.appHeaderText}>
          BlogApp
        </Text>
      </View>

      <BlogList />
    </SafeAreaView>
  );
};

export default HomeScreen;
