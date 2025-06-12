import React from "react";
import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";
import { ModalProvider } from "../context/ModalContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <AuthProvider>
      <ModalProvider>
        <StatusBar style="auto" />
        <Stack
          screenOptions={{
            headerShown: false, // Hide default headers
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="signup" />
          <Stack.Screen name="dashboard" />
        </Stack>
      </ModalProvider>
    </AuthProvider>
  );
}
