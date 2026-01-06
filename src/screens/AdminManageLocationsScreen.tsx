import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import {
  Text,
  TextInput,
  Button,
  Card,
  List,
  Portal,
  Modal,
  FAB,
  useTheme,
} from 'react-native-paper';
import { MasterService } from '../services/MasterService';
import { Dropdown } from 'react-native-element-dropdown';

const AdminManageLocationsScreen = () => {
  const [blocks, setBlocks] = useState<any[]>([]);
  const [floors, setFloors] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal states
  const [blockModal, setBlockModal] = useState(false);
  const [floorModal, setFloorModal] = useState(false);
  const [roomModal, setRoomModal] = useState(false);

  // Form states
  const [newBlockName, setNewBlockName] = useState('');
  const [newBlockDesc, setNewBlockDesc] = useState('');

  const [selectedBlockId, setSelectedBlockId] = useState<any>(null);
  const [newFloorNo, setNewFloorNo] = useState('');

  const [selectedFloorId, setSelectedFloorId] = useState<any>(null);
  const [newRoomNo, setNewRoomNo] = useState('');

  const theme = useTheme();

  useEffect(() => {
    fetchBlocks();
  }, []);

  const fetchBlocks = async () => {
    setLoading(true);
    try {
      const data = await MasterService.getAllBlocks();
      setBlocks(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch blocks');
    } finally {
      setLoading(false);
    }
  };

  const handleAddBlock = async () => {
    if (!newBlockName) return;
    try {
      await MasterService.createBlock({
        blockName: newBlockName,
        description: newBlockDesc,
      });
      setBlockModal(false);
      setNewBlockName('');
      setNewBlockDesc('');
      fetchBlocks();
    } catch (e) {
      Alert.alert('Error', 'Failed to create block');
    }
  };

  const handleAddFloor = async () => {
    if (!selectedBlockId || !newFloorNo) return;
    try {
      await MasterService.createFloor({
        blockId: selectedBlockId,
        floorNo: parseInt(newFloorNo),
      });
      setFloorModal(false);
      setNewFloorNo('');
      Alert.alert('Success', 'Floor added');
    } catch (e) {
      Alert.alert('Error', 'Failed to create floor');
    }
  };

  const handleAddRoom = async () => {
    if (!selectedFloorId || !newRoomNo) return;
    try {
      await MasterService.createRoom({
        floorId: selectedFloorId,
        roomNo: newRoomNo,
      });
      setRoomModal(false);
      setNewRoomNo('');
      Alert.alert('Success', 'Room added');
    } catch (e) {
      Alert.alert('Error', 'Failed to create room');
    }
  };

  const onBlockSelectForFloor = async (blockId: any) => {
    setSelectedBlockId(blockId);
  };

  const onBlockSelectForRoom = async (blockId: any) => {
    try {
      const data = await MasterService.getFloorsByBlock(blockId);
      setFloors(data);
    } catch (e) {
      Alert.alert('Error', 'Failed to fetch floors for this block');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text variant="headlineSmall" style={styles.title}>
          Manage Infrastructure
        </Text>

        <Card style={styles.card}>
          <Card.Title title="Blocks" subtitle="All campus blocks" />
          <Card.Content>
            {blocks.map((block: any) => (
              <List.Item
                key={block.id}
                title={block.blockName}
                description={block.description}
                left={props => <List.Icon {...props} icon="office-building" />}
              />
            ))}
            <Button
              mode="outlined"
              onPress={() => setBlockModal(true)}
              style={styles.addButton}
            >
              Add New Block
            </Button>
          </Card.Content>
        </Card>

        <View style={styles.actionRow}>
          <Button
            mode="contained"
            onPress={() => setFloorModal(true)}
            style={styles.actionButton}
          >
            Add Floor
          </Button>
          <Button
            mode="contained"
            onPress={() => setRoomModal(true)}
            style={styles.actionButton}
          >
            Add Room
          </Button>
        </View>
      </ScrollView>

      <Portal>
        {/* Block Modal */}
        <Modal
          visible={blockModal}
          onDismiss={() => setBlockModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            New Block
          </Text>
          <TextInput
            label="Block Name"
            value={newBlockName}
            onChangeText={setNewBlockName}
            mode="outlined"
            style={styles.modalInput}
          />
          <TextInput
            label="Description"
            value={newBlockDesc}
            onChangeText={setNewBlockDesc}
            mode="outlined"
            style={styles.modalInput}
            multiline
          />
          <Button mode="contained" onPress={handleAddBlock}>
            Save Block
          </Button>
        </Modal>

        {/* Floor Modal */}
        <Modal
          visible={floorModal}
          onDismiss={() => setFloorModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Add Floor
          </Text>
          <Dropdown
            style={styles.dropdown}
            data={blocks}
            labelField="blockName"
            valueField="id"
            placeholder="Select Block"
            onChange={item => setSelectedBlockId(item.id)}
          />
          <TextInput
            label="Floor Number"
            value={newFloorNo}
            onChangeText={setNewFloorNo}
            keyboardType="numeric"
            mode="outlined"
            style={styles.modalInput}
          />
          <Button mode="contained" onPress={handleAddFloor}>
            Save Floor
          </Button>
        </Modal>

        {/* Room Modal */}
        <Modal
          visible={roomModal}
          onDismiss={() => setRoomModal(false)}
          contentContainerStyle={styles.modal}
        >
          <Text variant="titleLarge" style={styles.modalTitle}>
            Add Room
          </Text>
          <Dropdown
            style={styles.dropdown}
            data={blocks}
            labelField="blockName"
            valueField="id"
            placeholder="Select Block"
            onChange={item => onBlockSelectForRoom(item.id)}
          />
          <Dropdown
            style={styles.dropdown}
            data={floors}
            labelField="floorNo"
            valueField="id"
            placeholder="Select Floor"
            onChange={item => setSelectedFloorId(item.id)}
          />
          <TextInput
            label="Room Number/Name"
            value={newRoomNo}
            onChangeText={setNewRoomNo}
            mode="outlined"
            style={styles.modalInput}
          />
          <Button mode="contained" onPress={handleAddRoom}>
            Save Room
          </Button>
        </Modal>
      </Portal>
    </View>
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
  title: {
    marginBottom: 20,
    fontWeight: 'bold',
    color: '#1E40AF',
  },
  card: {
    marginBottom: 16,
    borderRadius: 12,
  },
  addButton: {
    marginTop: 8,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  actionButton: {
    flex: 0.48,
  },
  modal: {
    backgroundColor: 'white',
    padding: 24,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  modalInput: {
    marginBottom: 16,
  },
  dropdown: {
    height: 50,
    borderColor: '#E2E8F0',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
  },
});

export default AdminManageLocationsScreen;
