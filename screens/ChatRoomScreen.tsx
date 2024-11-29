import { useState, useRef, useCallback, useMemo } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { MessageJSON } from "@/types/chat";
import { useChat } from "@/hooks/useChat";
import { MessageGroup } from "@/components/ui/message/MessageGroup";
import { MessageInput } from "@/components/ui/message/MessageInput";
import { ThemedView } from "@/components/ui/themed/ThemedView";

export const ChatRoomScreen = () => {
  const { messages, participants, isLoading, loadOlderMessages } = useChat();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const flashListRef = useRef(null);

  const groupMessages = useCallback(() => {
    const groups: MessageJSON[][] = [];
    let currentGroup: MessageJSON[] = [];

    messages.forEach((message, index) => {
      const previousMessage = messages[index - 1];
      const timeDiff = previousMessage
        ? message.sentAt - previousMessage.sentAt
        : 0;

      if (
        currentGroup.length === 0 ||
        (currentGroup[0].authorUuid === message.authorUuid && timeDiff < 300000) // 5 minutes
      ) {
        currentGroup.push(message);
      } else {
        if (currentGroup.length > 0) {
          groups.push([...currentGroup]);
        }
        currentGroup = [message];
      }
    });

    if (currentGroup.length > 0) {
      groups.push(currentGroup);
    }

    return groups;
  }, [messages]);

  const handleLoadMore = useCallback(async () => {
    if (messages.length === 0 || isLoadingMore) return;

    setIsLoadingMore(true);
    try {
      await loadOlderMessages(messages[messages.length - 1].uuid);
    } catch (error) {
      console.error("Error loading more messages:", error);
    }
    setIsLoadingMore(false);
  }, [messages]);

  if (isLoading) {
    return (
      <ThemedView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </ThemedView>
    );
  }

  const messageGroups = groupMessages();

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
