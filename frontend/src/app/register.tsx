// app/login.tsx (your RegisterPage component)
import { useState } from "react";
import { Link, useRouter } from "expo-router";
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
import { createUser } from "./services/userService"; // <-- adjust path if needed

export default function RegisterPage() {
  const router = useRouter();

  const [name, setName] = useState("");       // added
  const [email, setEmail] = useState("");     // keep
  const [password, setPassword] = useState(""); // keep

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = !!name && !!email && !!password && !submitting;

  const onSignUp = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError(null);
    try {
      await createUser({ name: name.trim(), email: email.trim(), password });
      Alert.alert("Success", "Account created!", [
        { text: "OK", onPress: () => router.replace("/login") }, // change route as you like
      ]);
    } catch (e: any) {
      setError(e?.message ?? "Sign up failed");
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
            {/* Name */}
            <View style={{ gap: 8 }}>
              <Text style={{ fontWeight: "600" }}>Name</Text>
              <TextInput
                placeholder="Albert Gator"
                value={name}
                onChangeText={setName}
                autoCapitalize="words"
                autoCorrect={false}
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

            {/* Error (if any) */}
            {error ? (
              <Text style={{ color: "#dc2626" }}>{error}</Text>
            ) : null}

            {/* Submit */}
            <Pressable
              onPress={onSignUp}
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
                <Text style={{ color: "white", fontWeight: "700" }}>Sign up</Text>
              )}
            </Pressable>

            {/* Already have an account */}
            <Text style={{ textAlign: "center", color: "#6b7280" }}>
              Already have an account? <Link href="/login">Sign in</Link>
            </Text>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
