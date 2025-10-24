import React, { useState } from 'react';
import { Modal, View, Text, Button, TextInput, StyleSheet, TouchableOpacity } from 'react-native';

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

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.backdrop}>
        <View style={styles.container}>
          {mode === 'menu' && (
            <>
              <Text style={styles.title}>Join Queue</Text>
              <TouchableOpacity style={styles.option} onPress={() => { onSolo(); }}>
                <Text style={styles.optionText}>Solo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.option} onPress={() => setMode('create')}>
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
                <Button title="Join" onPress={() => { if (joinId.trim()) { onJoinGroup(joinId.trim()); setMode('menu'); } }} />
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
