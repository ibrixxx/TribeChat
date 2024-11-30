import { RefObject, useMemo } from "react";
import { StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";
import { Reaction, Participant } from "@/types/chat";
import { ThemedText } from "../themed/ThemedText";
import { ThemedView } from "../themed/ThemedView";

interface ReactionDetailsSheetProps {
  bottomSheetRef: RefObject<BottomSheetModal>;
  reactions: Reaction[];
  participants: Participant[];
}

export const MessageReactionSheet = ({
  bottomSheetRef,
  reactions,
  participants,
}: ReactionDetailsSheetProps) => {
  const snapPoints = useMemo(() => ["60"], []);

  const renderItem = ({ item }: { item: Reaction }) => {
    const participant = participants.find(
      (p) => p.uuid === item.participantUuid
    );

    return (
      <ThemedView style={styles.reactionItem}>
        <ThemedText style={styles.emoji}>{item.value}</ThemedText>
        <ThemedText style={styles.participantName}>
          {participant?.name || "Unknown"}
        </ThemedText>
      </ThemedView>
    );
  };

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      backgroundStyle={styles.bottomSheet}
      enablePanDownToClose
      enableDismissOnClose
    >
      <ThemedText style={styles.header}>Reactions</ThemedText>
      <BottomSheetFlatList
        data={reactions}
        keyExtractor={(item) => item.uuid}
        renderItem={renderItem}
        contentContainerStyle={styles.content}
      />
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    backgroundColor: "#fff",
    borderRadius: 24,
  },
  header: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  content: {
    padding: 16,
  },
  reactionItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  participantName: {
    fontSize: 16,
  },
});
