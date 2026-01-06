import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Alert,
  Image,
  TouchableOpacity,
} from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  useTheme,
  ActivityIndicator,
} from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { MasterService } from '../services/MasterService';
import { ComplaintService } from '../services/ComplaintService';

const ReportComplaintScreen = ({ navigation }: any) => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [rooms, setRooms] = useState<any[]>([]);

  const [selectedBlock, setSelectedBlock] = useState<any>(null);
  const [selectedFloor, setSelectedFloor] = useState<any>(null);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [fetchingData, setFetchingData] = useState(true);

  const theme = useTheme();

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    try {
      const data = await MasterService.getAllBlocks();
      setBlocks(data);
    } catch (error) {
      console.error('Error fetching blocks:', error);
    } finally {
      setFetchingData(false);
    }
  };

  const handleBlockChange = async (item: any) => {
    setSelectedBlock(item);
    setSelectedFloor(null);
    setSelectedRoom(null);
    setFetchingData(true);
    try {
      const data = await MasterService.getFloorsByBlock(item.id);
      setFloors(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch floors');
    } finally {
      setFetchingData(false);
    }
  };

  const handleFloorChange = async (item: any) => {
    setSelectedFloor(item);
    setSelectedRoom(null);
    setFetchingData(true);
    try {
      const data = await MasterService.getRoomsByFloor(item.id);
      setRooms(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch rooms');
    } finally {
      setFetchingData(false);
    }
  };

  const handlePickImage = () => {
    Alert.alert('Attachment', 'Select image source', [
      { text: 'Camera', onPress: () => captureImage() },
      { text: 'Gallery', onPress: () => chooseImage() },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const captureImage = () => {
    launchCamera({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.assets && response.assets[0].uri) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const chooseImage = () => {
    launchImageLibrary({ mediaType: 'photo', quality: 0.8 }, response => {
      if (response.assets && response.assets[0].uri) {
        setImageUri(response.assets[0].uri);
      }
    });
  };

  const handleSubmit = async () => {
    if (
      !selectedBlock ||
      !selectedFloor ||
      !selectedRoom ||
      !title ||
      !description
    ) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const complaint = await ComplaintService.createComplaint({
        blockId: selectedBlock.id,
        floorId: selectedFloor.id,
        roomId: selectedRoom.id,
        title,
        description,
      });

      if (imageUri) {
        await ComplaintService.uploadImage(complaint.id, imageUri);
      }

      Alert.alert('Success', 'Complaint submitted successfully', [
        { text: 'OK', onPress: () => navigation.navigate('My Complaints') },
      ]);
    } catch (error: any) {
      Alert.alert(
        'Error',
        error?.response?.data?.message || 'Failed to submit complaint',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scrollContent}
    >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.sectionTitle}>
            Location Details
          </Text>

          <Dropdown
            style={styles.dropdown}
            data={blocks}
            labelField="blockName"
            valueField="id"
            placeholder="Select Block"
            value={selectedBlock}
            onChange={handleBlockChange}
          />

          <Dropdown
            style={styles.dropdown}
            data={floors}
            labelField="floorNo"
            valueField="id"
            placeholder="Select Floor"
            value={selectedFloor}
            onChange={handleFloorChange}
            disable={!selectedBlock}
          />

          <Dropdown
            style={styles.dropdown}
            data={rooms}
            labelField="roomNo"
            valueField="id"
            placeholder="Select Room"
            value={selectedRoom}
            onChange={item => setSelectedRoom(item)}
            disable={!selectedFloor}
          />

          <Text
            variant="titleLarge"
            style={[styles.sectionTitle, { marginTop: 16 }]}
          >
            Issue Details
          </Text>

          <TextInput
            label="Title"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Describe the issue"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <TouchableOpacity
            style={styles.imagePicker}
            onPress={handlePickImage}
          >
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
            ) : (
              <View style={styles.imagePlaceholder}>
                <TextInput.Icon icon="camera" size={40} color="#64748B" />
                <Text variant="bodyMedium" style={{ color: '#64748B' }}>
                  Add photo evidence
                </Text>
              </View>
            )}
          </TouchableOpacity>

          <Button
            mode="contained"
            onPress={handleSubmit}
            loading={loading}
            disabled={loading || fetchingData}
            style={styles.submitButton}
          >
            Submit Complaint
          </Button>
        </Card.Content>
      </Card>
      {fetchingData && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator
            animating={true}
            color={theme.colors.primary}
            size="large"
          />
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    borderRadius: 16,
    elevation: 2,
  },
  sectionTitle: {
    marginBottom: 12,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  dropdown: {
    height: 50,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: 'white',
  },
  input: {
    marginBottom: 16,
  },
  imagePicker: {
    height: 180,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F1F5F9',
    overflow: 'hidden',
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  submitButton: {
    borderRadius: 8,
    paddingVertical: 6,
  },
  loadingOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255,255,255,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ReportComplaintScreen;
