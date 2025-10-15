import { View, Text } from "react-native";
import { Link } from "expo-router";
// 4:02:43

export default function HomeScreen() {
  return (
    <View>
      <Link href="about">
	      Hello, world!
      </Link>
    </View>
  );
}