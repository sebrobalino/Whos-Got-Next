import { useState } from "react";
import { loginUser } from "./services/userService";
import { Link,Router, useRouter } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";


export default function LoginPage() {
  // purely for visuals (to show enabled/disabled button states)
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = email.length > 0 && password.length > 0;

  const handleSubmit = async () => {
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);


    try {
      const user = await loginUser({ email, password });

      await AsyncStorage.setItem("user", JSON.stringify(user))

      // Handle successful login (e.g., navigate to home screen)
      router.push("/home");
    } catch (e: any) {
      Alert.alert("Failure", "Username or password incorrect", [
              { text: "OK", onPress:() => console.log("User acknowledged error") }, // change route as you like
            ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={{ flex: 1, padding: 24, gap: 24, justifyContent: "center" }}>
          {/* Header */}
          <View style={{ gap: 8 }}>
            <Text style={{ fontSize: 32, fontWeight: "800", textAlign: "center" }}>
              Who's Got Next 
            </Text>
            <Text style={{ textAlign: "center", color: "#6b7280" }}>
              Sign in to continue
            </Text>
          </View>

          {/* Card */}
          <View
            style={{
              backgroundColor: "#f9fafb",
              padding: 20,
              borderRadius: 16,
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 10,
              shadowOffset: { width: 0, height: 4 },
              gap: 16,
            }}
          >
            {/* Email */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontWeight: "600" }}>Email</Text>
              <TextInput
                placeholder="you@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                value={email}
                onChangeText={setEmail}
                style={{
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "white",
                  padding: 12,
                  borderRadius: 10,
                }}
              />
            </View>

            {/* Password */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontWeight: "600" }}>Password</Text>
              <TextInput
                placeholder="••••••••"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
                style={{
                  borderWidth: 1,
                  borderColor: "#e5e7eb",
                  backgroundColor: "white",
                  padding: 12,
                  borderRadius: 10,
                }}
              />
            </View>

            {/* Forgot link (visual only) */}
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: "#2563eb" }}>Forgot password?</Text>
            </View>

            {/* Submit button (visual only) */}
           <Pressable
                         onPress={handleSubmit}
                         disabled={!canSubmit}
                         style={{
                           backgroundColor: canSubmit ? "#111827" : "#9ca3af",
                           paddingVertical: 14,
                           borderRadius: 12,
                           alignItems: "center",
                           flexDirection: "row",
                           justifyContent: "center",
                           gap: 8,
                         }}
                       >
                         {submitting ? (
                           <ActivityIndicator />
                         ) : (
                           <Text style={{ color: "white", fontWeight: "700" }}>Sign in</Text>
                         )}
                       </Pressable>
          </View>

          {/* Footer */}
          <Text style={{ textAlign: "center", color: "#6b7280" }}>
            New here? <Link href="/register">Create an account</Link>
          </Text>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
