import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import BottomNav from "./componets/BottomNav";
import { Ionicons } from "@expo/vector-icons";
import JoinQueueModal from "./componets/JoinQueueModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  Image,
} from "react-native";
import { getCourts } from "./services/courtService";
import { globalStyles as styles } from "./styles/globalStyles";

const BottomNavAny: any = BottomNav;

type CourtStatus = "open" | "active" | "full";
type Screen = "courts" | "details" | "myrun";

type Court = {
  name: string;
  location: string;
  id: number;
  number: number;
  waiting: number;
  playing: number;
  eta: number; // minutes
  status: CourtStatus;
  queuedAt?: string | null;
};

type QueueState = {
  court: Court;
  position: number;
  eta: number; // minutes
};

const statusColor = (status: CourtStatus) => {
  switch (status) {
    case "open":
      return "#10B981"; // green
    case "active":
      return "#4858edff"; // amber
    case "full":
      return "#EF4444"; // red
    default:
      return "#10B981";
  }
};

const statusLabel = (status: CourtStatus) => {
  switch (status) {
    case "open":
      return "OPEN";
    case "active":
      return "ACTIVE";
    case "full":
      return "FULL";
    default:
      return "OPEN";
  }
};

export default function HomeScreen() {
  const [current, setCurrent] = useState<Screen>("courts");
  const [selected, setSelected] = useState<Court | null>(null);
  const [joinModalVisible, setJoinModalVisible] = useState(false);
  const currentUserName = "Player";
  const currentUserId = "me-123456"; // TODO: replace with real auth user id
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCourts() {
      try {
        setLoading(true);
        const data = await getCourts(); // ✅ using imported function
        setCourts(data);
      } catch (err: any) {
        setError(err.message || "Failed to load courts");
      } finally {
        setLoading(false);
      }
    }

    loadCourts();
  }, []);

  const joinQueue = async () => {
    if (!selected) return;
    const queue: QueueState = {
      court: selected,
      position: selected.waiting + 1,
      eta: selected.eta + 2,
    };
    try {
      await AsyncStorage.setItem("userQueue", JSON.stringify(queue));
    } catch (e) {
      console.warn("Failed to persist queue", e);
    }
    // navigation handled by the specific action handlers (solo/group)
  };

  // Handlers for modal actions
  const handleSolo = async () => {
    // Reuse local join logic, then navigate with group params
    await joinQueue();
    setJoinModalVisible(false);
    const soloSuffix = (currentUserId || "user")
      .toString()
      .slice(0, 6)
      .toUpperCase();
    const groupId = `GROUP-SOLO-${soloSuffix}`;
    router.push({
      pathname: "/myrun",
      params: {
        courtId: selected ? String(selected.id) : "",
        isSolo: "true",
        isGroup: "false",
        groupId,
        groupName: currentUserName,
        groupSize: "1",
      },
    });
  };

  const handleCreateGroup = async (groupName: string, groupId: string) => {
    if (!selected) return;
    // Reuse same local queue behavior and augment navigation with group params
    const queue: QueueState = {
      court: selected,
      position: selected.waiting + 1,
      eta: selected.eta + 2,
    };
    try {
      await AsyncStorage.setItem("userQueue", JSON.stringify(queue));
    } catch (e) {
      console.warn("Failed to persist queue (group create)", e);
    }
    setJoinModalVisible(false);
    router.push({
      pathname: "/myrun",
      params: {
        courtId: String(selected.id),
        isSolo: "false",
        isGroup: "true",
        groupId,
        groupName,
        groupSize: "1",
      },
    });
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!selected) return;
    const queue: QueueState = {
      court: selected,
      position: selected.waiting + 1,
      eta: selected.eta + 2,
    };
    try {
      await AsyncStorage.setItem("userQueue", JSON.stringify(queue));
    } catch (e) {
      console.warn("Failed to persist queue (group join)", e);
    }
    setJoinModalVisible(false);
    router.push({
      pathname: "/myrun",
      params: {
        courtId: String(selected.id),
        isSolo: "false",
        isGroup: "true",
        groupId,
        groupName: `${currentUserName}'s group`,
        groupSize: "3",
      },
    });
  };

  const Courts = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/gator.png")}
          style={styles.topIcon}
        />
        <Text style={styles.h1}>Who’s Got Next?</Text>
        <Text style={styles.subtle}>Select your court to queue up.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridWrap}>
        <View style={styles.grid}>
          {loading ? (
            <Text>Loading courts...</Text>
          ) : error ? (
            <Text style={{ color: "red" }}>{error}</Text>
          ) : (
            courts.map((court) => (
              <Pressable
                key={court.id}
                onPress={() => {
                  if (court.status !== "full") {
                    router.push({
                      pathname: "/courtDetails",
                      params: {
                        court: JSON.stringify({
                          id: court.id,
                          name: court.name,
                          location: court.location,
                          // eta: court.eta,
                          status: court.status,
                          queuedAt: court.queuedAt,
                          // waiting: court.waiting,
                          // playing: court.playing,
                          number: court.number,
                        }),
                      },
                    });
                  }
                }}
                style={styles.card}
              >
                <Text style={styles.cardTitle}>Court {court.name}</Text>
                <Text>{court.location}</Text>

                <View style={{ marginBottom: 12 }}>
                  <Text
                    style={[
                      styles.waitingNum,
                      { color: court.waiting === 0 ? "#10B981" : "#FF7A00" },
                    ]}
                  >
                    {court.waiting}
                  </Text>
                  <Text style={styles.waitingLabel}>Waiting</Text>
                </View>

                <View
                  style={[
                    styles.pill,
                    { backgroundColor: statusColor(court.status) },
                  ]}
                >
                  <Text style={styles.pillText}>
                    {statusLabel(court.status)}
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    if (court.status !== "full") {
                      router.push({
                        pathname: "/courtDetails",
                        params: {
                        court: JSON.stringify({
                          id: court.id,
                          name: court.name,
                          location: court.location,
                          status: court.status,
                          queuedAt: court.queuedAt,
                          number: court.number,
                        }),
                      },
                      });
                    }
                  }}
                  disabled={court.status === "full"}
                  style={[
                    styles.joinBtn,
                    court.status === "full"
                      ? { backgroundColor: "#e5e7eb" }
                      : { backgroundColor: "#f97316" },
                  ]}
                >
                  <Text
                    style={[
                      styles.joinText,
                      court.status === "full"
                        ? { color: "#9ca3af" }
                        : { color: "#fff" },
                    ]}
                  >
                    {court.status === "full" ? "FULL" : "JOIN"}
                  </Text>
                </Pressable>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );

  const BottomNav = () => (
    <View style={styles.navBar}>
      <Pressable onPress={() => setCurrent("courts")} style={styles.navItem}>
        <Text style={{ fontSize: 22, opacity: current === "courts" ? 1 : 0.4 }}>
          🏀
        </Text>
        <Text
          style={[
            styles.navLabel,
            current === "courts" ? styles.navActive : null,
          ]}
        >
          Courts
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/myrun")} style={styles.navItem}>
        <Ionicons
          name="time-outline"
          size={26}
          color={current === "myrun" ? "#f97316" : "#d1d5db"}
        />
        <Text
          style={[
            styles.navLabel,
            current === "myrun" ? styles.navActive : null,
          ]}
        >
          My Run
        </Text>
      </Pressable>

      <Pressable onPress={() => router.push("/profile")} style={styles.navItem}>
        <View style={[styles.navAvatar, { backgroundColor: "#d1d5db" }]}>
          <Text style={{ fontWeight: "700", color: "#6b7280" }}>JDs</Text>
        </View>
        <Text style={styles.navLabel}>Profile</Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.screenWrap}>
      <View style={{ flex: 1 }}>
        {current === "courts" && <Courts />}
        {/* {current === "details" && <Details />} */}
        {/* Profile handled by separate /profile route */}
      </View>
      <BottomNavAny homeTab={current} />
      {/* Join Queue Modal */}
      <JoinQueueModal
        visible={joinModalVisible}
        onClose={() => setJoinModalVisible(false)}
        onSolo={handleSolo}
        onCreateGroup={handleCreateGroup}
        onJoinGroup={handleJoinGroup}
        currentUserName={currentUserName}
      />
    </View>
  );
}
