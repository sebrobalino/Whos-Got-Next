// app/profile.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import BottomNav from "./componets/BottomNav";
const BottomNavAny: any = BottomNav;
import AsyncStorage from "@react-native-async-storage/async-storage";


export default function ProfilePage() {

    const [user, setUser] = useState<{name: string, email: string} | null>(null);

    useEffect(() => {
        const loadUser = async () => {
            const storedUser = await AsyncStorage.getItem("user");
            if (storedUser) {
                setUser(JSON.parse(storedUser))
            }
        }
        loadUser();
    }, []);
    

    return (
        <View style={styles.screenWrap}>
            <View style={{ flex: 1 }}>
                <View style={styles.header}>
                    <Text style={styles.h1}>Profile</Text>

                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{user?.name[0]}</Text>
                    </View>
                    <Text style={styles.profileName}>{user?.name}</Text>
                    <Text style={styles.subtle}>{user?.email}</Text>

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
            <BottomNavAny />
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
    rowItemText: { color: "#111827", fontWeight: "600" },
    rowItemDanger: { borderColor: "#ef4444" },

    container: { flex: 1, backgroundColor: "#fff" },
    screenWrap: { flex: 1, backgroundColor: "#fff" },
    header: { paddingHorizontal: 24, paddingTop: 24, paddingBottom: 16 },
    h1: { fontSize: 28, fontWeight: "800", color: "#111827", marginBottom: 8 },
    subtle: { color: "#6b7280" },

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
