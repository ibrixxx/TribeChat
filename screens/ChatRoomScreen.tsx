import { useState, useRef, useMemo, useCallback } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useChat } from "@/hooks/useChat";
import { MessageGroup } from "@/components/ui/message/MessageGroup";
import { MessageInput } from "@/components/ui/message/MessageInput";
import { ThemedView } from "@/components/ui/themed/ThemedView";
import { groupMessages } from "@/utils/groupMessages";

export const ChatRoomScreen = () => {
  const { messages, participants, isLoading, loadOlderMessages } = useChat();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const flashListRef = useRef(null);

  const handleLoadMore = useCallback(async () => {
    if (messages.length === 0 || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await loadOlderMessages(messages[messages.length - 1].uuid);
    } catch (error) {
      console.error("Error loading more messages:", error);
    }
    setIsLoadingMore(false);
  }, [isLoadingMore, loadOlderMessages, messages]);

  const messageGroups = useMemo(() => groupMessages(messages), [messages]);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <FlashList
        ref={flashListRef}
        data={messageGroups}
        estimatedItemSize={100}
        renderItem={({ item }) => (
          <MessageGroup
            messages={item}
            participant={participants.find(
              (p) => p.uuid === item[0].authorUuid
            )}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        inverted
        ListFooterComponent={isLoadingMore ? <ActivityIndicator /> : null}
      />
      <MessageInput />
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
