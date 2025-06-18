import React from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import LoginForm from '../../../components/auth/LoginForm/LoginForm';
import styles from './styles';

const LoginScreen = () => {
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <LoginForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default LoginScreen;
