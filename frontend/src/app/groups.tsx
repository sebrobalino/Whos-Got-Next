import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet, FlatList, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import BottomNav from "./componets/BottomNav";
import JoinQueueModal from "./componets/JoinQueueModal";
import { getGroupById, getGroupCount, getGroupMembers, leaveGroup } from "./services/groupService";

const BottomNavAny: any = BottomNav;

type Court = {
  id: number;
  number: number;
  waiting: number;
  playing: number;
  eta: number;
  status: "open" | "active" | "full";
};

type QueueState = {
  court: Court;
  position: number;
  eta: number;
};

export default function GroupsPage() {
  const [queue, setQueue] = useState<QueueState | null>(null);
  const [joinModalVisible, setJoinModalVisible] = useState(false);

  const params = useLocalSearchParams<{
    courtId?: string;
    groupId?: string;
    groupName?: string;
    groupSize?: string; // expo-router passes strings
    isSolo?: string;
    isGroup?: string;
  }>();



   const [user, setUser] = useState<{name: string, email: string, id: number, group_id: number|null} | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser))
            }
        }
        loadUser();
    }, []);

  const leave = async () => {
    try {
      await AsyncStorage.removeItem("userQueue");
      setQueue(null);
      router.push("/home");
    } catch (e) {
      console.warn("Failed to leave queue", e);
    }
  };

  const [group, setGroup] = useState<any>(null);

  // ——— JoinQueueModal handlers ———
  // const handleSolo = async () => {
  //   // TODO: put your real join logic here
  //   setJoinModalVisible(false);
  // };

  // const handleCreateGroup = async (groupName: string, groupId: string) => {
  //   // TODO: create group then persist queue if needed
  //   setJoinModalVisible(false);
  // };

  // const handleJoinGroup = async (groupId: string) => {
  //   // TODO: join existing group then persist queue if needed
  //   setJoinModalVisible(false);
  // };

 const handleLeaveGroup = async () => {
  if (!user) return;

  try {
    await leaveGroup(user.id); // updates backend
    Alert.alert("Success", "You have left the group.");

    // Update local user state so the UI reacts
    setUser({
      ...user,
      group_id: null,
    });

    // Clear local group info
    setGroup(null);
    setGroupMembers([]);
  } catch (error) {
    console.error("Failed to leave group:", error);
    Alert.alert("Error", "Could not leave the group. Try again.");
  }
};




  const handleGetGroupByID = async (groupId: number) => {
  try {
    const groupData = await getGroupById(groupId);  // calls your API
    setGroup(groupData);                       
    console.log("Loaded group:", groupData);
  } catch (error) {
    console.error("Failed to fetch group:", error);
  }
};




// useEffect(() => {
//   if (user?.group_id) {
//     handleGetGroupByID(user.group_id);
//   }
// }, [user]);


const [groupMembers, setGroupMembers] = useState<any[]>([]);
const loadGroup = async () => {
  if (!user?.group_id) {
    setGroup(null);
    setGroupMembers([]);
    return;
  }

  try {
    const groupData = await getGroupById(user.group_id);
    setGroup(groupData);

    const members = await getGroupMembers(user.group_id);
    setGroupMembers(members);
    setUser({
      ...user,
      group_id: groupData.id,
    });
  } catch (error) {
    console.error("Failed to load group:", error);
    setGroup(null);
    setGroupMembers([]);
  }
} 

useEffect(() => {
  const loadGroupInfo = async () => {
    if (!user?.group_id) {
      setGroup(null);
      setGroupMembers([]);
      return;
    }

    try {
      const groupData = await getGroupById(user.group_id);
      setGroup(groupData);

      const members = await getGroupMembers(user.group_id);
      setGroupMembers(members);
    } catch (error) {
      console.error("Failed to load group:", error);
      setGroup(null);
      setGroupMembers([]);
    }
  };

  loadGroupInfo();
}, [user?.group_id]); 

  return (
    <View style={styles.screenWrap}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.h1}>{"Group Name: " + group?.group_name}</Text>
          <Text style={styles.h1}>{"Group Code: " + group?.id}</Text>
          

          {user?.group_id ? (
            <View>
              

             
              <View style={styles.banner}>
                
                {/* <Text style={styles.bannerCourt}>Court {queue.court.number}</Text>
                <Text style={styles.bannerPos}>You’re #{queue.position}</Text> */}

                <View style={styles.rowCenter}>
                  {/* <Ionicons name="time-outline" size={18} color="#fff" /> */}
                  {/* <Text style={styles.bannerEta}> ETA ~{queue.eta} minutes</Text> */}
                </View>
                <FlatList
                  data={groupMembers}
                  keyExtractor={(item) => item.id.toString()}
                  renderItem={({ item }) => (
                    <Text style={{ color: '#047857' }}>{item.name}</Text>
                  )}
                />
                

                {/* <View style={styles.progressTrack}>
                  <View style={styles.progressFill} />
                </View> */}
              </View>

              

              <Pressable onPress={handleLeaveGroup} style={styles.leaveBtn}>
                <Text style={styles.leaveBtnText}>Leave Group</Text>
                
              </Pressable>
            </View>
          ) : (
            <View style={styles.emptyWrap}>
              <Text style={{ fontSize: 64, marginBottom: 8 }}>🏀</Text>
              <Text style={styles.emptyTitle}>Not in Group</Text>

              <Pressable
                onPress={() => setJoinModalVisible(true)}
                style={styles.findBtn}
              >
                <Text style={styles.findBtnText}>Join / Create Group</Text>
              </Pressable>
              <Text style={styles.h1}>{group?.group_name}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Mount the modal ONCE and drive it with state */}
      <JoinQueueModal
        // visible={joinModalVisible}
        // onClose={() => setJoinModalVisible(false)}
        // // onSolo={handleSolo}
        // // onCreateGroup={handleCreateGroup}
        // // onJoinGroup={handleJoinGroup}
        // currentUserName={"Player"}
        // setUser={setUser}
        // user={user}
        visible={joinModalVisible}
         onClose={() => {
          setJoinModalVisible(false);
          if (user?.group_id) loadGroup(); // 👈 force refresh after closing
        }}
        
        currentUserName={"Player"}
        setUser={setUser}
        user={user}
      />

      <BottomNavAny />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  screenWrap: { flex: 1, backgroundColor: "#fff" },
  header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
  h1: { fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 8 },
  mediumGray: { color: "#4b5563", fontWeight: "500" },

  banner: {
    backgroundColor: "#f97316",
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  bannerCourt: {
    color: "#fff",
    fontWeight: "600",
    opacity: 0.9,
    marginBottom: 6,
  },
  bannerPos: {
    color: "#fff",
    fontSize: 32,
    fontWeight: "900",
    marginBottom: 12,
  },
  bannerEta: { color: "#fff", fontSize: 16 },

  progressTrack: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
  },
  progressFill: {
    width: "35%",
    height: 8,
    backgroundColor: "#fff",
    borderRadius: 999,
  },

  soonCard: {
    backgroundColor: "#ecfdf5",
    borderWidth: 2,
    borderColor: "#10B981",
    borderRadius: 16,
    padding: 12,
    marginBottom: 16,
    alignItems: "center",
  },
  soonTitle: { color: "#047857", fontWeight: "800", fontSize: 16 },
  soonText: { color: "#059669", fontSize: 12 },

  leaveBtn: {
    borderWidth: 2,
    borderColor: "#ef4444",
    borderRadius: 999,
    paddingVertical: 16,
    alignItems: "center",
  },
  leaveBtnText: { color: "#ef4444", fontWeight: "800" },

  emptyWrap: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 4,
  },
  findBtn: {
    marginTop: 12,
    backgroundColor: "#f97316",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  findBtnText: { color: "#fff", fontWeight: "800" },

  rowCenter: { flexDirection: "row", alignItems: "center" },

  navBar: {
    borderTopWidth: 2,
    borderTopColor: "#f3f4f6",
    paddingHorizontal: 24,
    paddingVertical: 12,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "#fff",
  },
  navItem: { alignItems: "center", minWidth: 60, gap: 4 },
  navLabel: { fontSize: 11, fontWeight: "800", color: "#9ca3af" },
  navActive: { color: "#f97316" },
  navAvatar: {
    width: 28,
    height: 28,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },

  groupInfo: { marginBottom: 16, paddingVertical: 8 },
  groupTitle: { fontSize: 18, fontWeight: "bold" },
  groupId: { marginTop: 2, color: "#4b5563" },
});
