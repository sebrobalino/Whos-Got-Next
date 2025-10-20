// app/login.tsx
import { useState } from "react";
import { Link } from "expo-router";
import {
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  View,
  Text,
  TextInput,
  Pressable,
} from "react-native";

export default function RegisterPage() {
  // purely for visuals (to show enabled/disabled button states)
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const canSubmit = email.length > 0 && password.length > 0;

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
              Sign up to continue
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
              <Text style={{ fontWeight: "600" }}>Name</Text>
              <TextInput
                placeholder="Albert Gator"
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

            

            {/* Submit button (visual only) */}
            <Pressable
              disabled={!canSubmit}
              style={{
                backgroundColor: canSubmit ? "#111827" : "#9ca3af",
                paddingVertical: 14,
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "white", fontWeight: "700" }}>Sign up</Text>
            </Pressable>
          </View>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
