import { StyleSheet } from "react-native";
import React from "react";
import { ThemedView } from "@/components/default/ThemedView";
import { ThemedText } from "@/components/default/ThemedText";
import ThemeSwitch from "@/components/switch/ThemeSwitch";

const ChatRoom = () => {
  return (
    <ThemedView
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <ThemedText>index</ThemedText>
      <ThemeSwitch />
    </ThemedView>
  );
};

export default ChatRoom;

const styles = StyleSheet.create({});
