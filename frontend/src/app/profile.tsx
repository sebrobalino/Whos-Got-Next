// app/profile.tsx
import React, { useEffect, useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
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
        <View style={styles.container}>
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
                        <Text style={[styles.rowItemText, { color: "#ef4444" }]}>
                            Log Out
                        </Text>
                    </Pressable>
                </View>
            </View>
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
});
