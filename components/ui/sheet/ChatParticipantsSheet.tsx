import { RefObject, useMemo } from "react";
import { Image, StyleSheet } from "react-native";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { Participant } from "@/types/chat";
import { ThemedText } from "../themed/ThemedText";
import { useTheme } from "@/hooks/useTheme";
import { Colors } from "@/constants/Colors";

interface ParticipantDetailsSheetProps {
  bottomSheetRef: RefObject<BottomSheetModal>;
  participant: Participant | null;
}

export const ChatParticipantsSheet = ({
  bottomSheetRef,
  participant,
}: ParticipantDetailsSheetProps) => {
  const snapPoints = useMemo(() => ["50%"], []);

  const { theme } = useTheme();

  return (
    <BottomSheetModal
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      backgroundStyle={[
        styles.bottomSheet,
        { backgroundColor: Colors[theme!].headerBackground },
      ]}
    >
      <BottomSheetView style={styles.content}>
        <Image source={{ uri: participant?.avatarUrl }} style={styles.avatar} />
        <ThemedText style={styles.name}>{participant?.name}</ThemedText>
        {participant?.jobTitle && (
          <ThemedText style={styles.jobTitle}>
            {participant.jobTitle}
          </ThemedText>
        )}
        {participant?.bio && (
          <ThemedText style={styles.bio}>{participant.bio}</ThemedText>
        )}
        {participant?.email && (
          <ThemedText style={styles.email}>{participant.email}</ThemedText>
        )}
      </BottomSheetView>
    </BottomSheetModal>
  );
};

const styles = StyleSheet.create({
  bottomSheet: {
    borderRadius: 24,
  },
  content: {
    padding: 16,
    alignItems: "center",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 16,
  },
  name: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    marginBottom: 16,
  },
  bio: {
    fontSize: 14,
    textAlign: "center",
    marginBottom: 16,
  },
  email: {
    fontSize: 14,
  },
});
