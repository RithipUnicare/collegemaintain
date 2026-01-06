import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Text, TextInput, Button, Card, useTheme } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const LoginScreen = ({ navigation }: any) => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const theme = useTheme();

  const handleLogin = async () => {
    if (!mobileNumber || !password) {
      Alert.alert('Error', 'Please enter both mobile number and password');
      return;
    }
    setLoading(true);
    try {
      await login(mobileNumber, password);
    } catch (error: any) {
      Alert.alert(
        'Login Failed',
        error?.response?.data?.message || 'Invalid credentials',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text variant="headlineLarge" style={styles.title}>
            Welcome Back
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            Log in to manage campus facilities
          </Text>
        </View>

        <Card style={styles.card}>
          <Card.Content>
            <TextInput
              label="Mobile Number"
              value={mobileNumber}
              onChangeText={setMobileNumber}
              mode="outlined"
              keyboardType="phone-pad"
              style={styles.input}
              left={<TextInput.Icon icon="phone" />}
            />
            <TextInput
              label="Password"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry
              style={styles.input}
              left={<TextInput.Icon icon="lock" />}
            />
            <Button
              mode="contained"
              onPress={handleLogin}
              loading={loading}
              disabled={loading}
              style={styles.button}
              contentStyle={styles.buttonContent}
            >
              Login
            </Button>
            <Button
              mode="text"
              onPress={() => navigation.navigate('Signup')}
              style={styles.linkButton}
            >
              Don't have an account? Sign Up
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  subtitle: {
    color: '#64748B',
    marginTop: 8,
  },
  card: {
    elevation: 4,
    borderRadius: 16,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
  },
  buttonContent: {
    height: 48,
  },
  linkButton: {
    marginTop: 8,
  },
});

export default LoginScreen;
