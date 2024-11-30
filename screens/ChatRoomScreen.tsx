import { useState, useRef, useMemo, useCallback } from "react";
import { StyleSheet, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useChat } from "@/hooks/useChat";
import { MessageInput } from "@/components/ui/message/MessageInput";
import { ThemedView } from "@/components/ui/themed/ThemedView";
import { groupMessages } from "@/utils/groupMessages";
import MessageGroup from "@/components/ui/message/MessageGroup";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { Participant, Reaction } from "@/types/chat";
import { ChatParticipantsSheet } from "@/components/ui/sheet/ChatParticipantsSheet";
import { MessageReactionSheet } from "@/components/ui/sheet/MessageReactionSheet";
import ImageView from "react-native-image-viewing";

export const ChatRoomScreen = () => {
  const { messages, participants, isLoading, loadOlderMessages } = useChat();
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const flashListRef = useRef(null);
  const reactionSheetRef = useRef<BottomSheetModal>(null);
  const participantSheetRef = useRef<BottomSheetModal>(null);
  const [selectedReactions, setSelectedReactions] = useState<Reaction[]>([]);
  const [selectedParticipant, setSelectedParticipant] =
    useState<Participant | null>(null);

  const [selectedImage, setSelectedImage] = useState<string | undefined>(
    undefined
  );

  const handleImagePress = useCallback((imageUrl: string) => {
    setSelectedImage(imageUrl);
  }, []);

  const handleReactionPress = useCallback((reactions: Reaction[]) => {
    setSelectedReactions(reactions);
    reactionSheetRef.current?.present();
  }, []);

  const handleParticipantPress = useCallback(
    (participant: Participant) => {
      setSelectedParticipant(participant);
      participantSheetRef.current?.present();
    },
    [participantSheetRef]
  );

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
            onReactionPress={handleReactionPress}
            onParticipantPress={handleParticipantPress}
            onImagePress={handleImagePress}
          />
        )}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        inverted
        ListFooterComponent={isLoadingMore ? <ActivityIndicator /> : null}
      />
      <MessageInput />

      <ImageView
        images={[{ uri: selectedImage }]}
        imageIndex={0}
        visible={selectedImage !== undefined}
        onRequestClose={() => setSelectedImage(undefined)}
        swipeToCloseEnabled={true}
        doubleTapToZoomEnabled
      />

      <MessageReactionSheet
        bottomSheetRef={reactionSheetRef}
        reactions={selectedReactions}
        participants={participants}
      />
      <ChatParticipantsSheet
        bottomSheetRef={participantSheetRef}
        participant={selectedParticipant}
      />
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
