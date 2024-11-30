import { StyleSheet, Text } from "react-native";
import { Participant } from "@/types/chat";
import { ThemedText } from "../themed/ThemedText";
import { AppColors } from "@/constants/Colors";
import { useChat } from "@/hooks/useChat";

interface MessageTextProps {
  text: string;
  onMentionPress?: (participant: Participant) => void;
}

export const MessageText = ({ text, onMentionPress }: MessageTextProps) => {
  const { participants } = useChat();
  const parts = text.split(/(@[\w\s]+)/g);

  return (
    <ThemedText style={styles.baseText}>
      {parts.map((part, index) => {
        if (part.startsWith("@")) {
          const name = part.slice(1).trim();
          const participant = participants.find((p) => p.name === name);

          if (participant) {
            return (
              <Text
                key={index}
                onPress={() => onMentionPress?.(participant)}
                style={[styles.baseText, styles.mention]}
              >
                {part}
              </Text>
            );
          }
        }
        return (
          <Text key={index} style={styles.baseText}>
            {part}
          </Text>
        );
      })}
    </ThemedText>
  );
};

const styles = StyleSheet.create({
  baseText: {
    fontSize: 16,
    fontWeight: "400",
    lineHeight: 20,
    color: "white",
  },
  mentionContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  mention: {
    color: AppColors.orange[7],
    fontWeight: "bold",
  },
});
