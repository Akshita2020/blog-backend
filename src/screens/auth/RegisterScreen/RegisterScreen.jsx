import React from 'react';
import {View, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import RegisterForm from '../../../components/auth/RegisterForm/RegisterForm';
import styles from './styles';

const RegisterScreen = () => {
  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}>
          <RegisterForm />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default RegisterScreen;
