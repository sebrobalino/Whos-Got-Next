import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, useSegments } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
  homeTab?: "courts" | "details" | "myrun";
};

export default function BottomNav({ homeTab }: Props) {
  const segments = useSegments();
  const [initials, setInitials] = useState<string>("JDs");

  useEffect(() => {
    const load = async () => {
      try {
        const raw = await AsyncStorage.getItem("user");
        if (raw) {
          const user = JSON.parse(raw);
          const name: string = user?.name || "";
          if (name.length === 0) return setInitials("JDs");
          const parts = name.trim().split(" ");
          const initialsStr = parts.length === 1
            ? parts[0].slice(0, 2).toUpperCase()
            : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
          setInitials(initialsStr);
        }
      } catch (e) {
        // keep default
      }
    };
    load();
  }, []);

  // Determine active states. If on the Home route, allow parent to pass homeTab
  const segArr = segments as string[];
  const onHomeRoute = segArr.length === 0 || segArr[0] === "home";
  const activeCourts = homeTab ? (homeTab === "courts" || homeTab === "details") : onHomeRoute;
  const activeMyRun = homeTab ? homeTab === "myrun" : segArr.includes("myrun");
  const activeProfile = segArr.includes("profile");

  return (
    <View style={styles.navBar}>
      <Pressable onPress={() => router.push("/home")} style={styles.navItem}>
        <Text style={{ fontSize: 22, opacity: activeCourts ? 1 : 0.4 }}>🏀</Text>
        <Text style={[styles.navLabel, activeCourts ? styles.navActive : null]}>Courts</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/myrun")} style={styles.navItem}>
        <Ionicons name="time-outline" size={26} color={activeMyRun ? "#f97316" : "#d1d5db"} />
        <Text style={[styles.navLabel, activeMyRun ? styles.navActive : null]}>My Run</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/profile")} style={styles.navItem}>
        <View style={[styles.navAvatar, activeProfile ? { backgroundColor: "#f97316" } : { backgroundColor: "#d1d5db" }]}>
          <Text style={{ fontWeight: "700", color: activeProfile ? "#fff" : "#6b7280" }}>{initials}</Text>
        </View>
        <Text style={[styles.navLabel, activeProfile ? styles.navActive : null]}>Profile</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
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
});
