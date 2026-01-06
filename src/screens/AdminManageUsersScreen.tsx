import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  RefreshControl,
} from 'react-native';
import {
  Text,
  List,
  Avatar,
  IconButton,
  ActivityIndicator,
  useTheme,
  Card,
} from 'react-native-paper';
import { UserService } from '../services/UserService';
import { AuthService } from '../services/AuthService';

const AdminManageUsersScreen = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const fetchUsers = async () => {
    try {
      const data = await UserService.getAllUsers();
      setUsers(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch users');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = (id: number) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this user?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserService.deleteUser(id);
              fetchUsers();
            } catch (e) {
              Alert.alert('Error', 'Failed to delete user');
            }
          },
        },
      ],
    );
  };

  const handleUpdateRole = async (
    mobileNumber: string,
    currentRoles: string,
  ) => {
    const newRole = currentRoles.includes('ROLE_ADMIN')
      ? 'ROLE_USER'
      : 'ROLE_ADMIN';
    try {
      await AuthService.updateRole(mobileNumber, newRole);
      Alert.alert('Success', `User updated to ${newRole}`);
      fetchUsers();
    } catch (e) {
      Alert.alert('Error', 'Failed to update role');
    }
  };

  const renderItem = ({ item }: any) => (
    <Card style={styles.card}>
      <List.Item
        title={item.name}
        description={`${item.mobileNumber} • ${item.roles}`}
        left={props => (
          <Avatar.Text
            {...props}
            size={40}
            label={item.name.substring(0, 2).toUpperCase()}
          />
        )}
        right={props => (
          <View style={styles.actions}>
            <IconButton
              icon={
                item.roles?.includes('ROLE_ADMIN')
                  ? 'shield-account'
                  : 'account-outline'
              }
              onPress={() => handleUpdateRole(item.mobileNumber, item.roles)}
            />
            <IconButton
              icon="delete-outline"
              iconColor={theme.colors.error}
              onPress={() => handleDeleteUser(item.id)}
            />
          </View>
        )}
      />
    </Card>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              fetchUsers();
            }}
          />
        }
        ListEmptyComponent={
          !loading ? (
            <View style={styles.centered}>
              <Text>No users found</Text>
            </View>
          ) : null
        }
      />
      {loading && !refreshing && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 12,
  },
  actions: {
    flexDirection: 'row',
  },
  centered: {
    flex: 1,
    padding: 20,
    alignItems: 'center',
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminManageUsersScreen;
