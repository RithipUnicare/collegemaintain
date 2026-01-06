import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import {
  Text,
  Card,
  Chip,
  Button,
  TextInput,
  useTheme,
  Divider,
  ActivityIndicator,
} from 'react-native-paper';
import { ComplaintService } from '../services/ComplaintService';

const ComplaintDetailScreen = ({ route, navigation }: any) => {
  const { complaint: initialComplaint, isAdmin } = route.params;
  const [complaint, setComplaint] = useState(initialComplaint);
  const [statusLoading, setStatusLoading] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [feedbackLoading, setFeedbackLoading] = useState(false);

  const theme = useTheme();

  const handleUpdateStatus = async (newStatus: string) => {
    setStatusLoading(true);
    try {
      await ComplaintService.updateStatus(complaint.id, newStatus);
      setComplaint({ ...complaint, status: newStatus });
      Alert.alert('Success', `Status updated to ${newStatus}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to update status');
    } finally {
      setStatusLoading(false);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback) {
      Alert.alert('Error', 'Please enter a comment');
      return;
    }
    setFeedbackLoading(true);
    try {
      await ComplaintService.submitFeedback(complaint.id, {
        rating,
        comment: feedback,
      });
      Alert.alert('Success', 'Feedback submitted');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Failed to submit feedback');
    } finally {
      setFeedbackLoading(false);
    }
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

  return (
    <ScrollView style={styles.container}>
      <Card style={styles.card}>
        {complaint.imageUrl && (
          <Card.Cover
            source={{ uri: complaint.imageUrl }}
            style={styles.image}
          />
        )}
        <Card.Content style={styles.content}>
          <View style={styles.header}>
            <Text variant="headlineSmall" style={styles.title}>
              {complaint.title}
            </Text>
            <Chip
              textStyle={{ color: 'white' }}
              style={{ backgroundColor: getStatusColor(complaint.status) }}
            >
              {complaint.status}
            </Chip>
          </View>

          <Text variant="bodySmall" style={styles.date}>
            Reported on {new Date(complaint.createdAt).toLocaleString()}
          </Text>

          <Divider style={styles.divider} />

          <Text variant="titleMedium" style={styles.label}>
            Location
          </Text>
          <Text variant="bodyLarge" style={styles.value}>
            {complaint.block?.blockName} • Floor {complaint.floor?.floorNo} •
            Room {complaint.room?.roomNo}
          </Text>

          <Text variant="titleMedium" style={[styles.label, { marginTop: 16 }]}>
            Description
          </Text>
          <Text variant="bodyLarge" style={styles.value}>
            {complaint.description}
          </Text>

          {isAdmin && (
            <View style={styles.adminSection}>
              <Divider style={styles.divider} />
              <Text variant="titleMedium" style={styles.label}>
                Admin Actions
              </Text>
              <View style={styles.buttonGroup}>
                <Button
                  mode="outlined"
                  onPress={() => handleUpdateStatus('IN_PROGRESS')}
                  disabled={statusLoading || complaint.status === 'IN_PROGRESS'}
                  style={styles.actionButton}
                >
                  Start Work
                </Button>
                <Button
                  mode="contained"
                  onPress={() => handleUpdateStatus('COMPLETED')}
                  disabled={statusLoading || complaint.status === 'COMPLETED'}
                  style={styles.actionButton}
                >
                  Complete
                </Button>
              </View>
              {statusLoading && <ActivityIndicator style={{ marginTop: 8 }} />}
            </View>
          )}

          {!isAdmin && complaint.status === 'COMPLETED' && (
            <View style={styles.feedbackSection}>
              <Divider style={styles.divider} />
              <Text variant="titleMedium" style={styles.label}>
                Feedback
              </Text>
              <TextInput
                label="Your experience"
                value={feedback}
                onChangeText={setFeedback}
                mode="outlined"
                multiline
                numberOfLines={3}
                style={styles.feedbackInput}
              />
              <Button
                mode="contained"
                onPress={handleSubmitFeedback}
                loading={feedbackLoading}
                style={styles.feedbackButton}
              >
                Submit Feedback
              </Button>
            </View>
          )}
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  card: {
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
  },
  image: {
    height: 250,
  },
  content: {
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  title: {
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  date: {
    color: '#64748B',
    marginBottom: 16,
  },
  divider: {
    marginVertical: 16,
  },
  label: {
    fontWeight: '600',
    color: '#1E40AF',
    marginBottom: 4,
  },
  value: {
    color: '#334155',
  },
  adminSection: {
    marginTop: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 0.48,
    borderRadius: 8,
  },
  feedbackSection: {
    marginTop: 8,
  },
  feedbackInput: {
    marginTop: 8,
    marginBottom: 12,
  },
  feedbackButton: {
    borderRadius: 8,
  },
});

export default ComplaintDetailScreen;
