import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Avatar, Text, Button, Card, List, useTheme } from 'react-native-paper';
import { useAuth } from '../context/AuthContext';

const ProfileScreen = () => {
  const { user, logout } = useAuth();
  const theme = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Avatar.Text
          size={80}
          label={user?.name?.substring(0, 2).toUpperCase() || 'U'}
          style={{ backgroundColor: theme.colors.primary }}
        />
        <Text variant="headlineMedium" style={styles.name}>
          {user?.name}
        </Text>
        <Text variant="bodyLarge" style={styles.role}>
          {user?.roles}
        </Text>
      </View>

      <Card style={styles.card}>
        <List.Section>
          <List.Item
            title="Mobile Number"
            description={user?.mobileNumber}
            left={props => <List.Icon {...props} icon="phone" />}
          />
          <List.Item
            title="Email"
            description={user?.email || 'Not provided'}
            left={props => <List.Icon {...props} icon="email" />}
          />
        </List.Section>
      </Card>

      <Button
        mode="outlined"
        onPress={logout}
        style={styles.logoutButton}
        textColor={theme.colors.error}
        icon="logout"
      >
        Logout
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#F8FAFC',
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
    marginTop: 20,
  },
  name: {
    marginTop: 16,
    fontWeight: 'bold',
  },
  role: {
    color: '#64748B',
  },
  card: {
    borderRadius: 16,
    marginBottom: 32,
  },
  logoutButton: {
    borderRadius: 8,
    borderColor: '#EF4444',
  },
});

export default ProfileScreen;
