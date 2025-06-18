import React, {useState} from 'react';
import {View, Text, TouchableOpacity, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {Eye, EyeOff, User, Mail, Lock, UserPlus} from 'lucide-react-native';
import useAuth from '../../../hooks/useAuth';
import {registerSchema} from '../../../Validation/validation';
import styles from './styles';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const navigation = useNavigation();
  const {register, isLoading, error} = useAuth();

  const handleChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async () => {
    const result = registerSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = {};
      result.error.errors.forEach(err => {
        fieldErrors[err.path[0]] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setErrors({});

    try {
      const registerResult = await register(result.data);
      if (registerResult) {
        console.log('Registration successful');
      }
    } catch (registerError) {
      setErrors({
        general:
          registerError.message || 'Registration failed. Please try again.',
      });
    }
  };

  const navigateToLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.iconContainer}>
          <UserPlus size={32} color="#FFFFFF" />
        </View>
        <Text style={styles.title}>Create Account</Text>
        <Text style={styles.subtitle}>Join our community today</Text>
      </View>

      {/* Form Card */}
      <View style={styles.formCard}>
        {/* General Error */}
        {(errors.general || error) && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errors.general || error}</Text>
          </View>
        )}
        {/* Name Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Full Name</Text>
          <View
            style={[styles.inputContainer, errors.name && styles.inputError]}>
            <User size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.name}
              onChangeText={value => handleChange('name', value)}
              placeholder="Enter your full name"
              placeholderTextColor="#9CA3AF"
              autoCapitalize="words"
              autoComplete="name"
            />
          </View>
          {errors.name && <Text style={styles.fieldError}>{errors.name}</Text>}
        </View>

        {/* Email Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email Address</Text>
          <View
            style={[styles.inputContainer, errors.email && styles.inputError]}>
            <Mail size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              value={formData.email}
              onChangeText={value => handleChange('email', value)}
              placeholder="Enter your email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />
          </View>
          {errors.email && (
            <Text style={styles.fieldError}>{errors.email}</Text>
          )}
        </View>

        {/* Password Field */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View
            style={[
              styles.inputContainer,
              errors.password && styles.inputError,
            ]}>
            <Lock size={20} color="#9CA3AF" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, styles.passwordInput]}
              value={formData.password}
              onChangeText={value => handleChange('password', value)}
              placeholder="Create a password"
              placeholderTextColor="#9CA3AF"
              secureTextEntry={!showPassword}
              autoComplete="new-password"
            />
            <TouchableOpacity
              style={styles.eyeButton}
              onPress={() => setShowPassword(!showPassword)}
              activeOpacity={0.7}>
              {showPassword ? (
                <EyeOff size={20} color="#9CA3AF" />
              ) : (
                <Eye size={20} color="#9CA3AF" />
              )}
            </TouchableOpacity>
          </View>
          {errors.password && (
            <Text style={styles.fieldError}>{errors.password}</Text>
          )}
        </View>

        {/* Submit Button */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            isLoading && styles.submitButtonDisabled,
          ]}
          onPress={handleSubmit}
          disabled={isLoading}
          activeOpacity={0.8}>
          <Text style={styles.submitButtonText}>
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </Text>
        </TouchableOpacity>

        {/* Login Link */}
        <View style={styles.linkContainer}>
          <Text style={styles.linkText}>
            Already have an account?{' '}
            <Text style={styles.link} onPress={navigateToLogin}>
              Sign in here
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
};

export default RegisterForm;
