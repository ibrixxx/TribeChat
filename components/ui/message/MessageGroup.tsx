import { memo } from "react";
import { Image, StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import moment from "moment";
import { MessageJSON, Participant, Reaction } from "@/types/chat";
import { AppColors } from "@/constants/Colors";
import { ThemedView } from "@/components/ui/themed/ThemedView";
import { ThemedText } from "@/components/ui/themed/ThemedText";

interface MessageGroupProps {
  messages: MessageJSON[];
  participant: Participant | undefined;
  onMessagePress?: (message: MessageJSON) => void;
  onReactionPress?: (message: MessageJSON) => void;
}

export const MessageGroup = memo(
  ({
    messages,
    participant,
    onMessagePress,
    onReactionPress,
  }: MessageGroupProps) => {
    if (!participant) return null;

    const renderReactions = (reactions: Reaction[]) => {
      const reactionCounts: Record<string, number> = {};
      reactions.forEach((reaction) => {
        reactionCounts[reaction.value] =
          (reactionCounts[reaction.value] || 0) + 1;
      });

      return (
        <ThemedView style={styles.reactionsContainer}>
          {Object.entries(reactionCounts).map(([value, count]) => (
            <TouchableOpacity
              key={value}
              style={styles.reactionBadge}
              onPress={() => onReactionPress?.(messages[0])}
            >
              <ThemedText>{value}</ThemedText>
              <ThemedText style={styles.reactionCount}>{count}</ThemedText>
            </TouchableOpacity>
          ))}
        </ThemedView>
      );
    };

    const renderImage = (message: MessageJSON) => {
      const image = message.attachments.find((att) => att.type === "image");
      if (!image) return null;

      const screenWidth = Dimensions.get("window").width;
      const maxWidth = screenWidth * 0.7;
      const aspectRatio = image.width / image.height;
      const height = maxWidth / aspectRatio;

      return (
        <TouchableOpacity
          onPress={() => onMessagePress?.(message)}
          style={styles.imageContainer}
        >
          <Image
            source={{ uri: image.url }}
            style={[styles.image, { width: maxWidth, height }]}
            resizeMode="cover"
          />
        </TouchableOpacity>
      );
    };

    const renderReplyTo = (message: MessageJSON) => {
      if (!message.replyToMessage) return null;

      return (
        <ThemedView style={styles.replyContainer}>
          <ThemedText style={styles.replyText} numberOfLines={2}>
            {message.replyToMessage.text}
          </ThemedText>
        </ThemedView>
      );
    };

    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <Image
            source={{ uri: participant.avatarUrl }}
            style={styles.avatar}
            defaultSource={require("@/assets/images/giga.jpg")}
          />
          <ThemedText style={styles.name}>{participant.name}</ThemedText>
        </ThemedView>
        {messages.map((message) => (
          <TouchableOpacity
            key={message.uuid}
            style={styles.messageContainer}
            onPress={() => onMessagePress?.(message)}
          >
            {renderReplyTo(message)}
            <ThemedText style={styles.message}>{message.text}</ThemedText>
            {renderImage(message)}
            {message.reactions.length > 0 && renderReactions(message.reactions)}
            <ThemedView style={styles.timestamp}>
                <ThemedText >
              {moment(message.sentAt).format("HH:mm")}
              {message.updatedAt > message.sentAt && " (edited)"}
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>
        ))}
      </ThemedView>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 8,
  },
  name: {
    fontWeight: "bold",
    fontSize: 15,
  },
  messageContainer: {
    marginLeft: 40,
    marginBottom: 2,
  },
  message: {
    fontSize: 16,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: AppColors.gray[4],
    marginTop: 2,
  },
  reactionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
  },
  reactionBadge: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
  },
  reactionCount: {
    marginLeft: 4,
    fontSize: 12,
  },
  imageContainer: {
    marginTop: 8,
    borderRadius: 12,
    overflow: "hidden",
  },
  image: {
    borderRadius: 12,
  },
  replyContainer: {
    borderLeftWidth: 4,
    borderLeftColor: AppColors.blue[8],
    padding: 8,
    marginBottom: 4,
    borderRadius: 4,
  },
  replyText: {
    fontSize: 14,
    color: AppColors.gray[8],
  },
});
