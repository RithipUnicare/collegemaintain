import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  Card,
  Chip,
  ActivityIndicator,
  useTheme,
  FAB,
} from 'react-native-paper';
import { ComplaintService } from '../services/ComplaintService';

const MyComplaintsScreen = ({ navigation }: any) => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();

  const fetchComplaints = async () => {
    try {
      const data = await ComplaintService.getMyComplaints();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching my complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchComplaints();
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return '#F59E0B';
      case 'IN_PROGRESS':
        return '#3B82F6';
      case 'COMPLETED':
        return '#10B981';
      default:
        return '#64748B';
    }
  };

  const renderItem = ({ item }: any) => (
    <Card
      style={styles.card}
      onPress={() =>
        navigation.navigate('Complaint Detail', { complaint: item })
      }
    >
      <Card.Content>
        <View style={styles.cardHeader}>
          <Text variant="titleMedium" style={styles.cardTitle}>
            {item.title}
          </Text>
          <Chip
            textStyle={{ color: 'white', fontSize: 10 }}
            style={{ backgroundColor: getStatusColor(item.status), height: 24 }}
          >
            {item.status}
          </Chip>
        </View>
        <Text variant="bodySmall" style={styles.locationText}>
          {item.block?.blockName} • Floor {item.floor?.floorNo} • Room{' '}
          {item.room?.roomNo}
        </Text>
        <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
        <View style={styles.cardFooter}>
          <Text variant="bodySmall" style={styles.dateText}>
            {new Date(item.createdAt).toLocaleDateString()}
          </Text>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={complaints}
        renderItem={renderItem}
        keyExtractor={item => item.id.toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.centered}>
            <Text variant="bodyLarge">No complaints found</Text>
          </View>
        }
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('Report')}
        label="Report Issue"
      />
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
    paddingBottom: 80,
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardTitle: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  locationText: {
    color: '#64748B',
    marginBottom: 8,
  },
  description: {
    color: '#334155',
    marginBottom: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  dateText: {
    color: '#94A3B8',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#1E40AF',
  },
});

export default MyComplaintsScreen;
