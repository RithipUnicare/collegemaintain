import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, RefreshControl } from 'react-native';
import {
  Text,
  Card,
  Chip,
  ActivityIndicator,
  useTheme,
  SegmentedButtons,
} from 'react-native-paper';
import { ComplaintService } from '../services/ComplaintService';

const AdminDashboardScreen = ({ navigation }: any) => {
  const [complaints, setComplaints] = useState<any[]>([]);
  const [filteredComplaints, setFilteredComplaints] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const theme = useTheme();

  const fetchAllComplaints = async () => {
    try {
      const data = await ComplaintService.getAllComplaints();
      setComplaints(data);
      applyFilter(data, statusFilter);
    } catch (error) {
      console.error('Error fetching admin complaints:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchAllComplaints();
  }, []);

  const applyFilter = (data: any[], filter: string) => {
    if (filter === 'ALL') {
      setFilteredComplaints(data);
    } else {
      setFilteredComplaints(
        data.filter(c => c.status?.toUpperCase() === filter),
      );
    }
  };

  const handleFilterChange = (value: string) => {
    setStatusFilter(value);
    applyFilter(complaints, value);
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchAllComplaints();
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
        navigation.navigate('Complaint Detail', {
          complaint: item,
          isAdmin: true,
        })
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
        <Text variant="bodySmall" style={styles.reporterText}>
          Reported by: {item.user?.name || 'Unknown'}
        </Text>
        <Text variant="bodySmall" style={styles.locationText}>
          {item.block?.blockName} • Floor {item.floor?.floorNo} • Room{' '}
          {item.room?.roomNo}
        </Text>
        <Text variant="bodyMedium" numberOfLines={2} style={styles.description}>
          {item.description}
        </Text>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.filterContainer}>
        <SegmentedButtons
          value={statusFilter}
          onValueChange={handleFilterChange}
          buttons={[
            { value: 'ALL', label: 'All' },
            { value: 'PENDING', label: 'Pending' },
            { value: 'IN_PROGRESS', label: 'In Progress' },
            { value: 'COMPLETED', label: 'Done' },
          ]}
          style={styles.segmentedButton}
        />
      </View>

      {loading && !refreshing ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : (
        <FlatList
          data={filteredComplaints}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          ListEmptyComponent={
            <View style={styles.centered}>
              <Text variant="bodyLarge">No complaints matching filter</Text>
            </View>
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  filterContainer: {
    padding: 16,
    backgroundColor: 'white',
    elevation: 2,
  },
  segmentedButton: {
    marginBottom: 4,
  },
  listContent: {
    padding: 16,
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
  reporterText: {
    color: '#1E40AF',
    fontWeight: '600',
    marginBottom: 2,
  },
  locationText: {
    color: '#64748B',
    marginBottom: 8,
  },
  description: {
    color: '#334155',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default AdminDashboardScreen;
