import { View, Text, ActivityIndicator } from "react-native";
import { Link } from "expo-router";
import { getUsers } from "./services/userService";
import { useQuery } from "@tanstack/react-query";
import LoginPage from "./login";
import AboutScreen from "./about";
// 4:02:43

export default function CourtDetails() {

    

    return (
        <Text>Court Details Screen</Text>
  );
}