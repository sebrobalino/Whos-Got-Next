import React, { use, useEffect, useState } from 'react';
import { Modal, View, Text, Button, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {createGroup, addUserToGroup} from '../services/groupService';
import AsyncStorage from '@react-native-async-storage/async-storage';


export type JoinQueueModalProps = {
  visible: boolean;
  onClose: () => void;
  // onSolo: () => void;
  // onCreateGroup: (groupName: string, groupId: string) => void;
  // onJoinGroup: (groupId: string) => void;
  currentUserName?: string;
  user: any;
  setUser: React.Dispatch<React.SetStateAction<any>>;

};

export default function JoinQueueModal({
  visible,
  onClose,
  // onSolo,
  // onCreateGroup,
  // onJoinGroup,
  currentUserName,
  user,
  setUser,
}: JoinQueueModalProps) {
  const [mode, setMode] = useState<'menu' | 'create' | 'join'>('menu');
  const [joinId, setJoinId] = useState('');

  const placeholderGroupId = 'GROUP-PLACEHOLDER-1234';
  const groupName = `${currentUserName ?? 'Player'}'s group`;

  const close = () => {
    setMode('menu');
    onClose();
  };

     //const [user, setUser] = useState<{name: string, id: number, group_id: number|null} | null>(null);

    // useEffect(() => {
    //     const loadUser = async () => {
    //         const storedUser = await AsyncStorage.getItem("user");
    //         if (storedUser) {
    //             setUser(JSON.parse(storedUser))
    //         }
    //     }
    //     loadUser();
    // }, []);

  const handleCreateGroup = async () => {
  if (!user) return;

  try {
    const newGroup = await createGroup({ group_name: `${user.name}'s Group`, captain_id: user.id });
    console.log('✅ Group created:', newGroup);

    if (newGroup?.id) {
      await addUserToGroup(newGroup.id, user.id);

      const updatedUser = { ...user, group_id: newGroup.id };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser)); // 🟢 persist change

      Alert.alert("Success", "Your group has been created.");
      console.log(`${user.name} added to group ${newGroup.id}`);
    }

    setTimeout(close, 500);
  } catch (error) {
    console.error("❌ Error creating or joining group:", error);
    Alert.alert("Error", "Could not create group.");
  }
};


const handleSolo = async () => {
  if (!user) return;

  try {
    const newGroup = await createGroup({ group_name: `${user.name}` });
    console.log("✅ Solo group created:", newGroup);

    if (newGroup?.id) {
      await addUserToGroup(newGroup.id, user.id);

      const updatedUser = { ...user, group_id: newGroup.id };
      setUser(updatedUser);
      await AsyncStorage.setItem("user", JSON.stringify(updatedUser)); // 🟢 persist change

      Alert.alert("Success", "You have a Solo group.");
      console.log(`${user.name} added to group ${newGroup.id}`);
    }

    setTimeout(close, 500);
  } catch (error) {
    console.error("❌ Error creating solo group:", error);
  }
};


const handleJoinGroup = async () => {
  if (!joinId.trim() || !user) return;

  try {
    const groupId = Number(joinId.trim());
    await addUserToGroup(groupId, user.id);

    const updatedUser = { ...user, group_id: groupId };
    setUser(updatedUser);
    await AsyncStorage.setItem("user", JSON.stringify(updatedUser)); // 🟢 persist change

    Alert.alert("Success", "You have joined the group.");
    console.log("✅ Joined group:", groupId);

    setTimeout(close, 500);
  } catch (error) {
    console.error("❌ Error joining group:", error);
    Alert.alert("Error", "Failed to join group. Please try again.");
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
                {/* <Button title="Create" onPress={() => { onCreateGroup(groupName, placeholderGroupId); setMode('menu'); }} /> */}
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
