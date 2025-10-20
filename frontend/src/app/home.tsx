import React, { useState } from "react";
import { View, Text, ScrollView, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CourtStatus = "open" | "active" | "full";
type Screen = "courts" | "details" | "myrun" | "profile";

type Court = {
  id: number;
  number: number;
  waiting: number;
  eta: number; // minutes
  status: CourtStatus;
};

type QueueState = {
  court: Court;
  position: number;
  eta: number; // minutes
};

const COURTS: Court[] = [
  { id: 1, number: 1, waiting: 4, eta: 8, status: "open" },
  { id: 2, number: 2, waiting: 8, eta: 16, status: "active" },
  { id: 3, number: 3, waiting: 2, eta: 4, status: "open" },
  { id: 4, number: 4, waiting: 12, eta: 24, status: "full" },
  { id: 5, number: 5, waiting: 6, eta: 12, status: "active" },
  { id: 6, number: 6, waiting: 0, eta: 0, status: "open" },
];

const statusColor = (status: CourtStatus) => {
  switch (status) {
    case "open":
      return "#10B981"; // green
    case "active":
      return "#F59E0B"; // amber
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
  const [userQueue, setUserQueue] = useState<QueueState | null>(null);

  const joinQueue = () => {
    if (!selected) return;
    setUserQueue({
      court: selected,
      position: selected.waiting + 1,
      eta: selected.eta + 2,
    });
    setCurrent("myrun");
  };

  const Courts = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1}>Who’s Got Next?</Text>
        <Text style={styles.subtle}>Select your court to queue up.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.gridWrap}>
        <View style={styles.grid}>
          {COURTS.map((court) => (
            <Pressable
              key={court.id}
              onPress={() => {
                setSelected(court);
                setCurrent("details");
              }}
              style={styles.card}
            >
              <Text style={styles.cardTitle}>Court {court.number}</Text>

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
                <Text style={styles.pillText}>{statusLabel(court.status)}</Text>
              </View>

              <View
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
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );

  const Details = () => {
    if (!selected) return null;
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => setCurrent("courts")} style={styles.backRow}>
            <Ionicons name="chevron-back" size={20} color="#f97316" />
            <Text style={styles.backText}>Back</Text>
          </Pressable>

          <Text style={styles.h1}>Court {selected.number}</Text>

          <View style={styles.statsCard}>
            <View style={{ alignItems: "center", marginBottom: 12 }}>
              <Text style={styles.bigOrange}>{selected.waiting}</Text>
              <Text style={styles.mediumGray}>players waiting</Text>
            </View>

            <View style={styles.rowCenter}>
              <Ionicons name="time-outline" size={18} color="#4b5563" />
              <Text style={styles.mediumGray}> ETA ~{selected.eta}m</Text>
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Up Next</Text>
            <View style={{ gap: 6 }}>
              <Text style={styles.mediumGray}>Jay, Marcus, Leo</Text>
              <Text style={styles.mediumGray}>DeAndre, Sarah</Text>
            </View>
          </View>
        </View>

        <View style={styles.footerButtons}>
          <Pressable
            onPress={joinQueue}
            disabled={selected.status === "full"}
            style={[
              styles.primaryBtn,
              selected.status === "full" && styles.primaryBtnDisabled,
            ]}
          >
            <Text
              style={[
                styles.primaryBtnText,
                selected.status === "full" && { color: "#9ca3af" },
              ]}
            >
              {selected.status === "full" ? "Court Full" : "Join Queue"}
            </Text>
          </Pressable>

          <Pressable onPress={() => setCurrent("courts")} style={styles.ghostBtn}>
            <Text style={styles.ghostBtnText}>Cancel</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const MyRun = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1}>My Run</Text>

        {userQueue ? (
          <View>
            <View style={styles.banner}>
              <Text style={styles.bannerCourt}>Court {userQueue.court.number}</Text>
              <Text style={styles.bannerPos}>You’re #{userQueue.position}</Text>

              <View style={styles.rowCenter}>
                <Ionicons name="time-outline" size={18} color="#fff" />
                <Text style={styles.bannerEta}> ETA ~{userQueue.eta} minutes</Text>
              </View>

              <View style={styles.progressTrack}>
                <View style={styles.progressFill} />
              </View>
            </View>

            {userQueue.position <= 2 && (
              <View style={styles.soonCard}>
                <Text style={styles.soonTitle}>You’re Up Soon!</Text>
                <Text style={styles.soonText}>Get ready to play</Text>
              </View>
            )}

            <Pressable
              onPress={() => {
                setUserQueue(null);
                setCurrent("courts");
              }}
              style={styles.leaveBtn}
            >
              <Text style={styles.leaveBtnText}>Leave Queue</Text>
            </Pressable>
          </View>
        ) : (
          <View style={styles.emptyWrap}>
            <Text style={{ fontSize: 64, marginBottom: 8 }}>🏀</Text>
            <Text style={styles.emptyTitle}>Not in Queue</Text>
            <Text style={styles.mediumGray}>Join a court to start playing</Text>

            <Pressable onPress={() => setCurrent("courts")} style={styles.findBtn}>
              <Text style={styles.findBtnText}>Find Courts</Text>
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );

  const Profile = () => (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.h1}>Profile</Text>

        <View style={styles.avatar}>
          <Text style={styles.avatarText}>JD</Text>
        </View>
        <Text style={styles.profileName}>Jordan Davis</Text>
        <Text style={styles.subtle}>jordan@email.com</Text>

        <View style={{ gap: 12, marginTop: 24 }}>
          <Pressable style={styles.rowItem}>
            <Text style={styles.rowItemText}>Queue History</Text>
          </Pressable>
          <Pressable style={styles.rowItem}>
            <Text style={styles.rowItemText}>Notifications</Text>
          </Pressable>
          <Pressable style={[styles.rowItem, styles.rowItemDanger]}>
            <Text style={[styles.rowItemText, { color: "#ef4444" }]}>Log Out</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );

  const BottomNav = () => (
    <View style={styles.navBar}>
      <Pressable onPress={() => setCurrent("courts")} style={styles.navItem}>
        <Text style={{ fontSize: 22, opacity: current === "courts" ? 1 : 0.4 }}>🏀</Text>
        <Text style={[styles.navLabel, current === "courts" ? styles.navActive : null]}>
          Courts
        </Text>
      </Pressable>

      <Pressable onPress={() => setCurrent("myrun")} style={styles.navItem}>
        <Ionicons
          name="time-outline"
          size={26}
          color={current === "myrun" ? "#f97316" : "#d1d5db"}
        />
        <Text style={[styles.navLabel, current === "myrun" ? styles.navActive : null]}>
          My Run
        </Text>
      </Pressable>

      <Pressable onPress={() => setCurrent("profile")} style={styles.navItem}>
        <View
          style={[
            styles.navAvatar,
            current === "profile" ? { backgroundColor: "#f97316" } : { backgroundColor: "#d1d5db" },
          ]}
        >
          <Text style={{ fontWeight: "700", color: current === "profile" ? "#fff" : "#6b7280" }}>
            JD
          </Text>
        </View>
        <Text style={[styles.navLabel, current === "profile" ? styles.navActive : null]}>
          Profile
        </Text>
      </Pressable>
    </View>
  );

  return (
    <View style={styles.screenWrap}>
      <View style={{ flex: 1 }}>
        {current === "courts" && <Courts />}
        {current === "details" && <Details />}
        {current === "myrun" && <MyRun />}
        {current === "profile" && <Profile />}
      </View>
      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
    rowItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    backgroundColor: "#fff",
  },
  rowItemText: {
    color: "#111827",
    fontWeight: "600",
  },
  rowItemDanger: {
    borderColor: "#ef4444",
  },

  screenWrap: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  h1: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 8,
  },
  subtle: { color: "#6b7280" },
  gridWrap: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
  },
  cardTitle: { fontSize: 16, fontWeight: "700", color: "#111827", marginBottom: 12 },
  waitingNum: { fontSize: 40, fontWeight: "800", marginBottom: 4 },
  waitingLabel: { fontSize: 12, color: "#6b7280", fontWeight: "600" },
  pill: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
    marginBottom: 12,
  },
  pillText: { fontSize: 11, fontWeight: "800", color: "#fff" },
  joinBtn: {
    width: "100%",
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: "center",
  },
  joinText: { fontWeight: "800" },

  backRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  backText: { color: "#f97316", fontWeight: "600", marginLeft: 2 },

  statsCard: {
    backgroundColor: "#f9fafb",
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  bigOrange: { fontSize: 48, fontWeight: "900", color: "#f97316", marginBottom: 4 },
  mediumGray: { color: "#4b5563", fontWeight: "500" },
  rowCenter: { flexDirection: "row", alignItems: "center" },

  panel: {
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e5e7eb",
    borderRadius: 16,
    padding: 16,
  },
  panelTitle: { fontWeight: "800", color: "#111827", marginBottom: 8 },

  footerButtons: { paddingHorizontal: 24, paddingBottom: 24, gap: 12 },
  primaryBtn: {
    backgroundColor: "#f97316",
    paddingVertical: 16,
    borderRadius: 999,
    alignItems: "center",
  },
  primaryBtnDisabled: {
    backgroundColor: "#e5e7eb",
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "800" },
  ghostBtn: { alignItems: "center", paddingVertical: 16 },
  ghostBtnText: { color: "#6b7280", fontWeight: "600" },

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
  emptyTitle: { fontSize: 18, fontWeight: "800", color: "#111827", marginBottom: 4 },
  findBtn: {
    marginTop: 12,
    backgroundColor: "#f97316",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 999,
  },
  findBtnText: { color: "#fff", fontWeight: "800" },

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

  avatar: {
    width: 96,
    height: 96,
    backgroundColor: "#f97316",
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginVertical: 16,
  },
  avatarText: { color: "#fff", fontWeight: "900", fontSize: 28 },
  profileName: {
    fontSize: 22,
    fontWeight: "900",
    color: "#111827",
    textAlign: "center",
  },
});
