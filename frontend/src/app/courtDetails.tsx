import React, { useEffect, useMemo, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { View, Text, Pressable } from "react-native";
import { globalStyles as styles } from "./styles/globalStyles";
import { getQueuedCourtsByID } from "./services/courtService";

type QueuedGroup = {
  id: number;
  group_name: string;
  court_id: number;
  priority: boolean;
  created_at: string;
  status: string;
  queued_at: string;
};

export default function CourtDetails() {
  const router = useRouter();
  const { court: courtParam } = useLocalSearchParams();

  // Parse court safely (string | string[])
  const court = useMemo(() => {
    try {
      const raw = Array.isArray(courtParam) ? courtParam[0] : courtParam;
      return raw ? JSON.parse(raw as string) : null;
    } catch {
      return null;
    }
  }, [courtParam]);

  const [queuedGroups, setQueuedGroups] = useState<QueuedGroup[]>([]);
  const [loadingQueued, setLoadingQueued] = useState(false);
  const [errorQueued, setErrorQueued] = useState<string | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const handleGroupsQueued = async () => {
    if (!court?.id) {
      setDebugInfo("No court?.id; skipping fetch.");
      return;
    }
    try {
      setLoadingQueued(true);
      setErrorQueued(null);

      // Call your service
      const data = await getQueuedCourtsByID(Number(court.id));

      // 🔎 Normalize: handle both array and wrapped shapes
      const asArray: QueuedGroup[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.rows)
        ? data.rows
        : Array.isArray(data?.data)
        ? data.data
        : [];

      setQueuedGroups(asArray);

      // Debug snapshot (shows what actually came back)
      setDebugInfo(
        `Fetched for court.id=${court.id}. ` +
          `Type=${Array.isArray(data) ? "array" : typeof data}, ` +
          `len=${asArray.length}.`
      );

      // Console logs for deeper debugging while you test
      console.log("[CourtDetails] court.id:", court.id);
      console.log("[CourtDetails] raw response:", data);
      console.log("[CourtDetails] normalized length:", asArray.length);
    } catch (err: any) {
      setErrorQueued(err?.message || "Failed to load queued groups");
      setDebugInfo(`Error for court.id=${court?.id}: ${err?.message}`);
      console.warn("[CourtDetails] fetch error:", err);
    } finally {
      setLoadingQueued(false);
    }
  };

  useEffect(() => {
    handleGroupsQueued();
  }, [court?.id]);

  // Sort oldest first (front of queue at top)
  const sorted = useMemo(
    () =>
      [...queuedGroups].sort(
        (a, b) =>
          new Date(a.queued_at).getTime() - new Date(b.queued_at).getTime()
      ),
    [queuedGroups]
  );

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

  const fmtTime = (iso?: string) => {
    try { return iso ? new Date(iso).toLocaleString() : "-"; } catch { return "-"; }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backRow}>
          <Ionicons name="chevron-back" size={20} color="#f97316" />
          <Text style={styles.backText}>Back</Text>
        </Pressable>

        <Text style={styles.h1}>Court {court.name}</Text>

        <View style={[styles.panel, { marginTop: 8 }]}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
            <Text style={styles.panelTitle}>Queued Groups</Text>
            <Pressable onPress={handleGroupsQueued} disabled={loadingQueued}>
              <Text style={[styles.ghostBtnText, loadingQueued && { opacity: 0.5 }]}>
                {loadingQueued ? "Refreshing..." : "Refresh"}
              </Text>
            </Pressable>
          </View>

          {/* DEBUG: shows court.id and fetch snapshot */}
          <Text style={[styles.mediumGray, { marginTop: 6 }]}>
            Court ID: {String(court.id)} • {debugInfo}
          </Text>

          {errorQueued && <Text style={{ color: "#ef4444" }}>{errorQueued}</Text>}

          {!loadingQueued && !errorQueued && sorted.length === 0 && (
            <Text style={styles.mediumGray}>No groups currently queued.</Text>
          )}

          {!errorQueued && sorted.length > 0 && (
            <View style={{ gap: 10, marginTop: 8 }}>
              {sorted.map((g, idx) => (
                <View
                  key={g.id}
                  style={[styles.rowItem, g.priority && styles.rowItemDanger]}
                >
                  <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <Text style={{ fontWeight: "800", color: "#111827" }}>
                      {idx + 1}. {g.group_name}
                    </Text>
                    <Text style={{ fontWeight: "700", color: "#6b7280" }}>
                      {g.status?.toUpperCase?.() ?? "QUEUED"}
                    </Text>
                  </View>
                  <Text style={styles.mediumGray}>Queued at: {fmtTime(g.queued_at)}</Text>
                  {g.priority && (
                    <Text style={{ color: "#ef4444", fontWeight: "700", marginTop: 4 }}>
                      PRIORITY
                    </Text>
                  )}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}