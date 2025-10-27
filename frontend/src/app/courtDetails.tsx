import { View, Text, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { getUsers } from "./services/userService";
import { useQuery } from "@tanstack/react-query";
import LoginPage from "./login";
import AboutScreen from "./about";

export default function CourtDetails() {

  // const Details = () => {
  //   if (!selected) return null;
  //   return (
  //     courts.map((court) => (
  //     <View style={styles.container}>
  //       <View style={styles.header}>
  //         <Pressable
  //           onPress={() => setCurrent("courts")}
  //           style={styles.backRow}
  //         >
  //           <Ionicons name="chevron-back" size={20} color="#f97316" />
  //           <Text style={styles.backText}>Back</Text>
  //         </Pressable>

  //         <Text style={styles.h1}>Court {court.name}</Text>

  //         <View style={styles.statsCard}>
  //           <View style={{ alignItems: "center", marginBottom: 12 }}>
  //             <Text style={styles.bigOrange}>{selected.waiting}</Text>
  //             <Text style={styles.mediumGray}>players waiting</Text>
  //           </View>

  //           <View style={styles.rowCenter}>
  //             <Ionicons name="time-outline" size={18} color="#4b5563" />
  //             <Text style={styles.mediumGray}> ETA ~{selected.eta}m</Text>
  //           </View>
  //         </View>

  //         <View style={styles.panel}>
  //           <Text style={styles.panelTitle}>Up Next</Text>
  //           <View style={{ gap: 6 }}>
  //             <Text style={styles.mediumGray}>Jay, Marcus, Leo</Text>
  //             <Text style={styles.mediumGray}>DeAndre, Sarah</Text>
  //           </View>
  //         </View>
  //       </View>

  //       <View style={styles.footerButtons}>
  //         <Pressable
  //           onPress={() => setJoinModalVisible(true)}
  //           disabled={selected.status === "full"}
  //           style={[
  //             styles.primaryBtn,
  //             selected.status === "full" && styles.primaryBtnDisabled,
  //           ]}
  //         >
  //           <Text
  //             style={[
  //               styles.primaryBtnText,
  //               selected.status === "full" && { color: "#9ca3af" },
  //             ]}
  //           >
  //             {selected.status === "full" ? "Court Full" : "Join Queue"}
  //           </Text>
  //         </Pressable>

  //         <Pressable
  //           onPress={() => setCurrent("courts")}
  //           style={styles.ghostBtn}
  //         >
  //           <Text style={styles.ghostBtnText}>Cancel</Text>
  //         </Pressable>
  //       </View>
  //     </View>
  //     ))
  //   );
  // };

    return (
        <Text>Court Details Screen</Text>
  );
}