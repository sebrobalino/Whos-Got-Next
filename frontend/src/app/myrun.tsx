import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import BottomNav from "./componets/BottomNav";
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

export default function MyRunPage() {
  const [queue, setQueue] = useState<QueueState | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem("userQueue");
        if (raw) setQueue(JSON.parse(raw));
      } catch (e) {
        console.warn("Failed to load queue", e);
      }
    };
    load();
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

  return (
    <View style={styles.screenWrap}>
      <View style={{ flex: 1 }}>
        <View style={styles.header}>
          <Text style={styles.h1}>My Run</Text>

        {queue ? (
          <View>
            <View style={styles.banner}>
              <Text style={styles.bannerCourt}>Court {queue.court.number}</Text>
              <Text style={styles.bannerPos}>You’re #{queue.position}</Text>

              <View style={styles.rowCenter}>
                <Ionicons name="time-outline" size={18} color="#fff" />
                <Text style={styles.bannerEta}> ETA ~{queue.eta} minutes</Text>
              </View>

              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
            </View>

            {queue.position <= 2 && (
              <View style={styles.soonCard}>
                <Text style={styles.soonTitle}>You’re Up Soon!</Text>
                <Text style={styles.soonText}>Get ready to play</Text>
              </View>
            )}

            <Pressable onPress={leave} style={styles.leaveBtn}>
              <Text style={styles.leaveBtnText}>Leave Queue</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 64, marginBottom: 8 }}>🏀</Text>
            <Text style={styles.emptyTitle}>Not in Queue</Text>
            <Text style={styles.mediumGray}>Join a court to start playing</Text>

            <Pressable onPress={() => router.push("/home")} style={styles.findBtn}>
              <Text style={styles.findBtnText}>Find Courts</Text>
            </Pressable>
          </View>
        )}
        </View>
      </View>

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
  bannerCourt: { color: "#fff", fontWeight: "600", opacity: 0.9, marginBottom: 6 },
  bannerPos: { color: "#fff", fontSize: 32, fontWeight: "900", marginBottom: 12 },
  bannerEta: { color: "#fff", fontSize: 16 },

  progressTrack: {
    marginTop: 12,
    backgroundColor: "rgba(255,255,255,0.25)",
    borderRadius: 999,
    height: 8,
    overflow: "hidden",
  },
  progressFill: { width: "35%", height: 8, backgroundColor: "#fff", borderRadius: 999 },

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

  leaveBtn: { borderWidth: 2, borderColor: "#ef4444", borderRadius: 999, paddingVertical: 16, alignItems: "center" },
  leaveBtnText: { color: "#ef4444", fontWeight: "800" },

  emptyWrap: { alignItems: "center", paddingVertical: 40, gap: 8 },
  emptyTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 4 },
  findBtn: { marginTop: 12, backgroundColor: "#f97316", paddingVertical: 12, paddingHorizontal: 24, borderRadius: 999 },
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
  navAvatar: { width: 28, height: 28, borderRadius: 999, alignItems: "center", justifyContent: "center" },
});
