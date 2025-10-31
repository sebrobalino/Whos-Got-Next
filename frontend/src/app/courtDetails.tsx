import React, { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable, Alert, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { globalStyles as styles } from "./styles/globalStyles";
import {getQueuedCourtsByID, getActiveCourtsByID,} from "./services/courtService";
import { joinCourt, leaveCourt } from "./services/groupService";

type QueuedGroup = {
  id: number;
  group_name: string;
  court_id: number;
  priority: boolean;
  created_at: string;
  status: string;
  queued_at: string | null;
};

type ActiveGroup = {
  id: number;
  group_name: string;
  court_id: number;
  priority: boolean;
  created_at: string;
  status: string;
  queued_at: string | null;
};

type StoredUser = { name: string; email: string; group_id: number };

export default function CourtDetails() {
  const router = useRouter();
  const { court: courtParam } = useLocalSearchParams();

  // Parse court from route param
  const court = useMemo(() => {
    try {
      const raw = Array.isArray(courtParam) ? courtParam[0] : courtParam;
      return raw ? JSON.parse(raw as string) : null;
    } catch {
      return null;
    }
  }, [courtParam]);

  const [user, setUser] = useState<StoredUser | null>(null);
  const [queuedGroups, setQueuedGroups] = useState<QueuedGroup[]>([]);
  const [activeGroups, setActiveGroups] = useState<ActiveGroup[]>([]);
  const [loadingQueued, setLoadingQueued] = useState(false);
  const [errorQueued, setErrorQueued] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [leaving, setLeaving] = useState(false);

  // const activeGroups = React.useMemo(
  //   () => queuedGroups.filter((g) => g.status === "active").slice(0, 2),
  //   [queuedGroups]
  // );

  // Load user (to get group_id)
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (e) {
        console.warn("Failed to load user from storage", e);
        setUser(null);
      }
    };
    loadUser();
  }, []);

  // Fetch queued groups for this court
  const getGroupsQueued = async () => {
    if (!court?.id) return;
    try {
      setLoadingQueued(true);
      setErrorQueued(null);
      const data = await getQueuedCourtsByID(Number(court.id));
      const asArray: QueuedGroup[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.rows)
        ? (data as any).rows
        : Array.isArray((data as any)?.data)
        ? (data as any).data
        : [];
      setQueuedGroups(asArray);
    } catch (err: any) {
      setErrorQueued(err?.message || "Failed to load queued groups");
    } finally {
      setLoadingQueued(false);
    }
  };

  const getGroupsActive = async () => {
    if (!court?.id) return;
    try {
      setLoadingQueued(true);
      setErrorQueued(null);
      const data = await getActiveCourtsByID(Number(court.id));
      const asArray: ActiveGroup[] = Array.isArray(data)
        ? data
        : Array.isArray((data as any)?.rows)
        ? (data as any).rows
        : Array.isArray((data as any)?.data)
        ? (data as any).data
        : [];
      setActiveGroups(asArray);
    } catch (err: any) {
      setErrorQueued(err?.message || "Failed to load active groups");
    } finally {
      setLoadingQueued(false);
    }
  };

  // Join queue
  const handleJoinQueue = async () => {
    if (!court?.id) {
      Alert.alert("Error", "Missing court ID");
      return;
    }
    const groupId = user?.group_id;
    if (typeof groupId !== "number") {
      Alert.alert("Error", "Missing group ID (user.group_id)");
      return;
    }

    console.log("[JOIN] pressed with", { groupId, courtId: court.id });
    try {
      setJoining(true);
      const res = await joinCourt(groupId, court.id);
      Alert.alert("Joined Queue", res?.message || "OK");
      getGroupsQueued();
      getGroupsActive();
    } catch (err: any) {
      console.error("[JOIN] failed:", err);
      Alert.alert("Join failed", String(err?.message || err));
    } finally {
      setJoining(false);
    }
  };

  // Leave queue
  const handleLeaveQueue = async () => {
    const groupId = user?.group_id;
    if (typeof groupId !== "number") {
      Alert.alert("Error", "Missing group ID (user.group_id)");
      return;
    }

    console.log("[LEAVE] pressed with", { groupId });
    try {
      setLeaving(true);
      const res = await leaveCourt(groupId);
      Alert.alert("Left Queue", res?.message || "OK");
      getGroupsQueued(); // refresh list
      getGroupsActive();
    } catch (err: any) {
      console.error("[LEAVE] failed:", err);
      Alert.alert("Leave failed", String(err?.message || err));
    } finally {
      setLeaving(false);
    }
  };

  // Initial load / refresh on court change
  useEffect(() => {
    getGroupsQueued();
    getGroupsActive();
  }, [court?.id]);

  // No court guard
  if (!court) {
    return (
      <View style={[styles.container, { padding: 24 }]}>
        <Pressable onPress={() => router.back()} style={styles.backRow}>
          <Ionicons name="chevron-back" size={20} color="#f97316" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>
        <Text style={styles.h1}>Court</Text>
        <Text style={styles.mediumGray}>Missing court data.</Text>
      </View>
    );
  }

  return (
    <View>
      <ScrollView>
      <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backRow}>
          <Ionicons name="chevron-back" size={20} color="#f97316" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.h1}>Court {court.name}</Text>

        {/* Debug info */}
        {/* <Text style={[styles.mediumGray, { marginTop: 6 }]}>
          Debug • courtId: {court?.id ?? "-"} • groupId: {user?.group_id ?? "-"}
        </Text> */}

        {/* Active Groups Panel */}
        <View style={[styles.panel, { marginTop: 12 }]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.panelTitle}>Playing Now</Text>
            <Pressable onPress={getGroupsActive} disabled={loadingQueued}>
              <Text
                style={[styles.ghostBtnText, loadingQueued && { opacity: 0.5 }]}
              >
                {loadingQueued ? "Refreshing..." : "Refresh"}
              </Text>
            </Pressable>
          </View>

          {errorQueued && (
            <Text style={{ color: "#ef4444", marginTop: 6 }}>
              {errorQueued}
            </Text>
          )}

          {!loadingQueued && !errorQueued && activeGroups.length === 0 && (
            <Text style={[styles.mediumGray, { marginTop: 6 }]}>
              Court is empty.
            </Text>
          )}

          {activeGroups.map((g, idx) => (
            <View
              key={`active-${g.id}`}
              style={[styles.rowItem, g.priority && styles.rowItemDanger]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "800", color: "#111827" }}>
                  {idx + 1}. {g.group_name}
                </Text>
                <Text style={{ fontWeight: "700", color: "#6b7280" }}>
                  ACTIVE
                </Text>
              </View>
              {/* No "Queued at" for active groups */}
            </View>
          ))}
        </View>

        {/* Queued Groups Panel */}
        <View style={[styles.panel, { marginTop: 12 }]}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Text style={styles.panelTitle}>Queued Groups</Text>
            <Pressable onPress={getGroupsQueued} disabled={loadingQueued}>
              <Text
                style={[styles.ghostBtnText, loadingQueued && { opacity: 0.5 }]}
              >
                {loadingQueued ? "Refreshing..." : "Refresh"}
              </Text>
            </Pressable>
          </View>

          {errorQueued && (
            <Text style={{ color: "#ef4444", marginTop: 6 }}>
              {errorQueued}
            </Text>
          )}

          {!loadingQueued && !errorQueued && queuedGroups.length === 0 && (
            <Text style={[styles.mediumGray, { marginTop: 6 }]}>
              No groups currently queued.
            </Text>
          )}

          {queuedGroups.map((g, idx) => (
            <View
              key={g.id}
              style={[styles.rowItem, g.priority && styles.rowItemDanger]}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ fontWeight: "800", color: "#111827" }}>
                  {idx + 1}. {g.group_name}
                </Text>
                <Text style={{ fontWeight: "700", color: "#6b7280" }}>
                  {g.status?.toUpperCase?.() ?? "QUEUED"}
                </Text>
              </View>
              <Text style={styles.mediumGray}>
                Queued at:{" "}
                {g.queued_at ? new Date(g.queued_at).toLocaleString() : "-"}
              </Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        <View style={{ gap: 12, marginTop: 12 }}>
          {/* Join */}
          <Pressable
            onPress={handleJoinQueue}
            style={[
              styles.primaryBtn,
              (joining || leaving) && { backgroundColor: "#e5e7eb" },
            ]}
            disabled={joining || leaving || !user?.group_id || !court?.id}
          >
            <Text
              style={[
                styles.primaryBtnText,
                (joining || leaving) && { color: "#9ca3af" },
              ]}
            >
              {joining
                ? "Joining..."
                : `Join Queue`}
            </Text>
          </Pressable>

          {/* Leave */}
          <Pressable
            onPress={handleLeaveQueue}
            style={[styles.leaveBtn, leaving && { opacity: 0.6 }]}
            disabled={leaving || !user?.group_id}
          >
            <Text style={styles.leaveBtnText}>
              {leaving
                ? "Leaving..."
                : `Leave Queue`}
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
    </ScrollView>
    </View>
  );
}
