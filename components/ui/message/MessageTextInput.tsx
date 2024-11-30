import { useState, useRef, useCallback, useMemo, useEffect } from "react";
import {
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Keyboard,
  KeyboardAvoidingView,
} from "react-native";
import { ThemedText } from "../themed/ThemedText";
import { Participant } from "@/types/chat";
import { FlashList } from "@shopify/flash-list";
import { ThemedView } from "@/components/ui/themed/ThemedView";
import { AppColors, Colors } from "@/constants/Colors";
import { useTheme } from "@/hooks/useTheme";

interface MessageTextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  participants: Participant[];
  onSend: () => void;
}

export const MessageTextInput = ({
  value,
  onChangeText,
  participants,
  onSend,
}: MessageTextInputProps) => {
  const [mentionListVisible, setMentionListVisible] = useState(false);
  const [mentionQuery, setMentionQuery] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const cursorPosition = useRef<number>(0);

  const { theme } = useTheme();

  useEffect(() => {
    const keyboardWillShow = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow",
      (e) => setKeyboardHeight(e.endCoordinates.height)
    );
    const keyboardWillHide = Keyboard.addListener(
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide",
      () => setKeyboardHeight(0)
    );

    return () => {
      keyboardWillShow.remove();
      keyboardWillHide.remove();
    };
  }, []);

  const handleTextChange = useCallback(
    (text: string) => {
      onChangeText(text);

      const beforeCursor = text.slice(0, cursorPosition.current);
      const match = beforeCursor.match(/@[^@\s]*$/);

      if (match) {
        setMentionListVisible(true);
        setMentionQuery(match[0].slice(1));
      } else {
        setMentionListVisible(false);
      }
    },
    [onChangeText]
  );

  const handleSelectionChange = useCallback((event: any) => {
    cursorPosition.current = event.nativeEvent.selection.end;
  }, []);

  const handleMentionSelect = useCallback(
    (participant: Participant) => {
      const beforeMention = value.slice(
        0,
        value.lastIndexOf("@", cursorPosition.current)
      );
      const afterMention = value.slice(cursorPosition.current);
      const newText = `${beforeMention}@${participant.name} ${afterMention}`;
      onChangeText(newText);
      setMentionListVisible(false);
      inputRef.current?.focus();
    },
    [onChangeText, value]
  );

  const filteredParticipants = useMemo(
    () =>
      participants.filter((p) =>
        p.name.toLowerCase().includes(mentionQuery.toLowerCase())
      ),
    [mentionQuery, participants]
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
      style={styles.container}
    >
      <ThemedView
        style={[
          styles.container,
          { backgroundColor: Colors[theme!].messageInputBackground },
        ]}
      >
        {mentionListVisible && filteredParticipants.length > 0 && (
          <ThemedView
            style={[
              styles.mentionList,
              {
                bottom: keyboardHeight + 50,
                backgroundColor: Colors[theme!].messageInputBackground,
              },
            ]}
          >
            <FlashList
              data={filteredParticipants}
              keyboardShouldPersistTaps="always"
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.mentionItem}
                  onPress={() => handleMentionSelect(item)}
                >
                  <ThemedText>{item.name}</ThemedText>
                </TouchableOpacity>
              )}
              keyExtractor={(item) => item.uuid}
              estimatedItemSize={50}
            />
          </ThemedView>
        )}
        <TextInput
          ref={inputRef}
          value={value}
          onChangeText={handleTextChange}
          onSelectionChange={handleSelectionChange}
          placeholder="Type a message..."
          placeholderTextColor={Colors[theme!].messageInputPlaceholder}
          style={[styles.input, { color: Colors[theme!].text }]}
          onSubmitEditing={onSend}
        />
      </ThemedView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  input: {
    padding: 12,
    fontSize: 16,
    borderRadius: 20,
  },
  mentionList: {
    position: "absolute",
    left: 0,
    right: 0,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    borderWidth: 1,
    borderColor: AppColors.gray[4],
  },
  mentionItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: AppColors.gray[4],
  },
});
