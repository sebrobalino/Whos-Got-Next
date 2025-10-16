import { View, Text, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { getUsers } from "./services/userService";
import { useQuery } from "@tanstack/react-query";
// 4:02:43

export default function HomeScreen() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['users'],
        queryFn: () =>getUsers(),
    });

    if (isLoading) {
        return <ActivityIndicator style={{ marginTop: '20%' }} />;
    };

    if (error) {
        return <Text style={{ marginTop: '20%' }}> {error.message}</Text>;
    };

    const user = data[0];

    return (
        <View>
            <Text> {user.name}</Text>
            <Text> {user.email}</Text>
            <Link href="about">
                Hello, world!
            </Link>
    </View>
  );
}