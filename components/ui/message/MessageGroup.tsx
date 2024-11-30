import { memo } from "react";
import {
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Pressable,
  View,
} from "react-native";
import moment from "moment";
import { MessageJSON, Participant, Reaction } from "@/types/chat";
import { AppColors } from "@/constants/Colors";
import { ThemedView } from "@/components/ui/themed/ThemedView";
import { ThemedText } from "@/components/ui/themed/ThemedText";
import { Image } from "expo-image";
import { MessageText } from "./MessageText";
import { LinearGradient } from "expo-linear-gradient";
import { Text } from "react-native";

interface MessageGroupProps {
  messages: MessageJSON[];
  participant: Participant | undefined;
  onParticipantPress?: (participant: Participant) => void;
  onReactionPress?: (reactions: Reaction[]) => void;
  onImagePress?: (imageUrl: string) => void;
}

const MessageGroup = memo(
  ({
    messages,
    participant,
    onParticipantPress,
    onReactionPress,
    onImagePress,
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
              onPress={() => onReactionPress?.(reactions)}
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
          onPress={() => onImagePress?.(image.url)}
          style={styles.imageContainer}
        >
          <Image
            source={{ uri: image.url }}
            style={[styles.image, { width: maxWidth, height }]}
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
    const isOwnMessage = participant.uuid === "you";

    return (
      <ThemedView
        style={[
          styles.container,
          isOwnMessage ? styles.ownContainer : styles.otherContainer,
        ]}
      >
        <Pressable
          onPress={() => onParticipantPress?.(participant)}
          style={styles.header}
        >
          <Image
            source={{ uri: participant.avatarUrl }}
            style={styles.avatar}
            placeholder={require("@/assets/images/giga.jpg")}
          />
          <ThemedText style={styles.name}>{participant.name}</ThemedText>
        </Pressable>
        {messages.map((message) => (
          <ThemedView
            key={message.uuid}
            style={[
              styles.messageContainer,
              isOwnMessage
                ? styles.ownMessageContainer
                : styles.otherMessageContainer,
            ]}
          >
            <LinearGradient
              colors={
                isOwnMessage
                  ? [AppColors.lime[12], AppColors.lime[15]]
                  : [AppColors.lightBlue[9], AppColors.blue[9]]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={[
                styles.messageBubble,
                isOwnMessage
                  ? styles.ownMessageBubble
                  : styles.otherMessageBubble,
              ]}
            >
              {renderReplyTo(message)}
              <MessageText
                text={message.text}
                onMentionPress={onParticipantPress}
              />
              {renderImage(message)}
              <View
                style={[
                  styles.timestamp,
                  isOwnMessage ? styles.ownTimestamp : styles.otherTimestamp,
                ]}
              >
                <Text style={styles.timestampText}>
                  {moment(message.sentAt).format("HH:mm")}
                  {message.updatedAt > message.sentAt && " (edited)"}
                </Text>
              </View>
              {message.reactions.length > 0 &&
                renderReactions(message.reactions)}
            </LinearGradient>
          </ThemedView>
        ))}
      </ThemedView>
    );
  }
);

MessageGroup.displayName = "MessageGroup";

export default MessageGroup;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginBottom: 5,
  },
  ownContainer: {
    alignItems: "flex-end",
  },
  otherContainer: {
    alignItems: "flex-start",
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
    maxWidth: "80%",
    marginBottom: 2,
  },
  ownMessageContainer: {
    marginLeft: 0,
    marginRight: 0,
  },
  otherMessageContainer: {
    marginLeft: 40,
  },
  messageBubble: {
    padding: 12,
    borderRadius: 20,
  },
  ownMessageBubble: {
    borderTopRightRadius: 4,
  },
  otherMessageBubble: {
    borderTopLeftRadius: 4,
  },
  timestamp: {
    fontSize: 12,
    marginTop: 4,
  },
  ownTimestamp: {
    alignSelf: "flex-end",
  },
  otherTimestamp: {
    alignSelf: "flex-start",
  },
  timestampText: {
    fontSize: 12,
    color: AppColors.gray[2],
  },
  reactionsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 4,
    backgroundColor: "transparent",
  },
  reactionBadge: {
    flexDirection: "row",
    backgroundColor: AppColors.gray[10],
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 4,
    marginBottom: 4,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowColor: AppColors.gray[16],
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  reactionCount: {
    marginLeft: 4,
    fontSize: 12,
    color: "white",
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
    backgroundColor: "transparent",
    opacity: 0.9,
    borderLeftWidth: 4,
    borderLeftColor: AppColors.orange[8],
    padding: 8,
    marginBottom: 4,
    borderRadius: 4,
  },
  replyText: {
    fontSize: 14,
    color: AppColors.gray[1],
  },
});
