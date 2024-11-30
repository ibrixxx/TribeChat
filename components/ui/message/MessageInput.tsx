import { useState } from "react";
import { TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { AppColors } from "@/constants/Colors";
import { ThemedView } from "@/components/ui/themed/ThemedView";
import { ThemedText } from "@/components/ui/themed/ThemedText";
import { useChat } from "@/hooks/useChat";

export const MessageInput = () => {
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { sendMessage, isSending } = useChat();

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please grant permission to access your photos"
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
    }
  };

  const handleSend = async () => {
    if ((!text.trim() && !selectedImage) || isSending) return;

    try {
      sendMessage({
        text: text.trim(),
      });
      setText("");
      setSelectedImage(null);
    } catch (error) {
      Alert.alert("Error", "Failed to send message. Please try again.");
    }
  };

  return (
    <ThemedView style={styles.container}>
      {selectedImage && (
        <ThemedView style={styles.imagePreview}>
          <Image source={{ uri: selectedImage }} style={styles.previewImage} />
          <TouchableOpacity
            onPress={() => setSelectedImage(null)}
            style={styles.removeButton}
          >
            <ThemedText>×</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
      <ThemedView style={styles.inputContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <ThemedText>📷</ThemedText>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Type a message..."
          multiline
        />
        <TouchableOpacity
          onPress={handleSend}
          disabled={isSending || (!text.trim() && !selectedImage)}
          style={[
            styles.sendButton,
            (isSending || (!text.trim() && !selectedImage)) &&
              styles.sendButtonDisabled,
          ]}
        >
          <ThemedText style={styles.sendButtonText}>Send</ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderTopWidth: 1,
    borderTopColor: AppColors.gray[5],
  },
  imagePreview: {
    marginBottom: 5,
    position: "relative",
    width: 100,
    height: 100,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  removeButton: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: AppColors.red[10],
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  imageButton: {
    padding: 10,
    justifyContent: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: AppColors.gray[5],
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    maxHeight: 100,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: AppColors.blue[8],
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    justifyContent: "center",
  },
  sendButtonDisabled: {
    backgroundColor: AppColors.gray[3],
  },
  sendButtonText: {
    fontWeight: "bold",
  },
});
