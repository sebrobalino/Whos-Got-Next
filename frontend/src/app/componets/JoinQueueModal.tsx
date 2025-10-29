import React, { useEffect, useState } from 'react';
import { Modal, View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import {createGroup, addUserToGroup} from '../services/groupService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type JoinQueueModalProps = {
  visible: boolean;
  onClose: () => void;
  onSolo: () => void;
  onCreateGroup: (groupName: string, groupId: string) => void;
  onJoinGroup: (groupId: string) => void;
  currentUserName?: string;
};

export default function JoinQueueModal({
  visible,
  onClose,
  onSolo,
  onCreateGroup,
  onJoinGroup,
  currentUserName,
}: JoinQueueModalProps) {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [joinId, setJoinId] = useState('');

  const placeholderGroupId = 'GROUP-PLACEHOLDER-1234';
  const groupName = `${currentUserName ?? 'Player'}'s group`;

  const close = () => {
    setMode('menu');
    onClose();
  };

     const [user, setUser] = useState<{name: string, email: string, id: number} | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser))
            }
        }
        loadUser();
    }, []);

  const handleCreateGroup = async () => {
  if (!user) return;

  try {
    // 1️⃣ Create the group
    const newGroup = await createGroup({ group_name: `${user.name}'s Group` });
    console.log('✅ Group created:', newGroup);

    // 2️⃣ Automatically add the creator to their group
    // Assuming newGroup has an 'id' property
    if (newGroup?.id) {
      await addUserToGroup(newGroup.id, user.id);
      console.log(` ${user.name} added to group ${newGroup.id}`);
    }

    setMode('menu');
  } catch (error) {
    console.error('Error creating or joining group:', error);
  }
};


 const handleSolo = async () => {
   if (!user) return;

  try {
    // 1️⃣ Create the group
    const newGroup = await createGroup({ group_name: `${user.name}` });
    console.log('✅ Group created:', newGroup);

    // 2️⃣ Automatically add the creator to their group
    // Assuming newGroup has an 'id' property
    if (newGroup?.id) {
      await addUserToGroup(newGroup.id, user.id);
      console.log(` ${user.name} added to group ${newGroup.id}`);
    }

    setMode('menu');
  } catch (error) {
    console.error('Error creating or joining group:', error);
  }
  };

const handleJoinGroup = async () => {
  if (!joinId.trim()) return;

  try {
    await addUserToGroup(Number(joinId.trim()), Number(user?.id));
    console.log('✅ Joined group:', joinId);
    setMode('menu');
  } catch (error) {
    console.error(' Error joining group:', error);
  }
};


  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {mode === 'menu' && (
            <>
              <Text style={styles.title}>Join Queue</Text>
              <TouchableOpacity style={styles.option} onPress={() => { handleSolo() }}>
                <Text style={styles.optionText}>Solo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={() => handleCreateGroup() }>
                <Text style={styles.optionText}>New Group</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={() => setMode('join')}>
                <Text style={styles.optionText}>Join Group</Text>
              </TouchableOpacity>
              <Button title="Cancel" onPress={close} />
            </>
          )}

          {mode === 'create' && (
            <>
              <Text style={styles.title}>Create Group</Text>
              <Text style={styles.info}>Group name:</Text>
              <Text style={styles.bold}>{groupName}</Text>
              <Text style={styles.info}>Group id (placeholder):</Text>
              <Text style={styles.bold}>{placeholderGroupId}</Text>
              <View style={styles.rowGutter}>
                <Button title="Back" onPress={() => setMode('menu')} />
                <Button title="Create" onPress={() => { onCreateGroup(groupName, placeholderGroupId); setMode('menu'); }} />
              </View>
            </>
          )}

          {mode === 'join' && (
            <>
              <Text style={styles.title}>Join Group</Text>
              <TextInput
                placeholder="Enter group id"
                value={joinId}
                onChangeText={setJoinId}
                style={styles.input}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <View style={styles.rowGutter}>
                <Button title="Back" onPress={() => setMode('menu')} />
                <Button title="Join" onPress={() => { if (joinId.trim()) { handleJoinGroup(); setMode('menu'); } }} />
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  container: { width: '85%', backgroundColor: '#fff', padding: 20, borderRadius: 8 },
  title: { fontSize: 20, fontWeight: '600', marginBottom: 12 },
  option: { padding: 12, borderRadius: 6, backgroundColor: '#eee', marginBottom: 8 },
  optionText: { fontSize: 16 },
  info: { marginTop: 8 },
  bold: { fontWeight: '700', marginBottom: 12 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 8, marginBottom: 12, borderRadius: 4 },
  rowGutter: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
});
