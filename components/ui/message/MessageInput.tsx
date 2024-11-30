import { useState } from "react";
import { TouchableOpacity, StyleSheet, Alert, Platform } from "react-native";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { AppColors, Colors } from "@/constants/Colors";
import { ThemedView } from "@/components/ui/themed/ThemedView";
import { ThemedText } from "@/components/ui/themed/ThemedText";
import { useChat } from "@/hooks/useChat";
import { MessageTextInput } from "./MessageTextInput";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { useTheme } from "@/hooks/useTheme";
import { LinearGradient } from "expo-linear-gradient";

export const MessageInput = () => {
  const [text, setText] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { sendMessage, isSending, participants } = useChat();
  const { theme } = useTheme();

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
      Alert.alert(
        "Error",
        "Failed to send message. Please try again: " + error
      );
    }
  };

  return (
    <ThemedView
      style={[
        styles.container,
        {
          backgroundColor: Colors[theme!].messageInputBackground,
          shadowColor: Colors[theme!].messageInputShadow,
        },
      ]}
    >
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
      <ThemedView
        style={[
          styles.inputContainer,
          { backgroundColor: Colors[theme!].messageInputBackground },
        ]}
      >
        <TouchableOpacity onPress={pickImage} style={styles.imageButton}>
          <Feather name="image" size={28} color={Colors[theme!].imageIcon} />
        </TouchableOpacity>
        <ThemedView style={styles.textInputWrapper}>
          <MessageTextInput
            value={text}
            onChangeText={setText}
            participants={participants}
            onSend={handleSend}
          />
        </ThemedView>
        <TouchableOpacity
          onPress={handleSend}
          disabled={isSending || (!text.trim() && !selectedImage)}
          style={styles.sendButton}
        >
          <LinearGradient
            colors={[AppColors.yellow[12], AppColors.lime[12]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.gradientButton}
          >
            <FontAwesome name="send-o" size={16} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    position: "absolute",
    bottom: Platform.OS === "ios" ? 24 : 16,
    left: Platform.OS === "ios" ? 18 : 12,
    right: Platform.OS === "ios" ? 18 : 12,
    borderRadius: 20,
    shadowOffset: {
      width: 2,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  imagePreview: {
    marginBottom: 8,
    position: "relative",
    width: 100,
    height: 100,
  },
  previewImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  removeButton: {
    position: "absolute",
    top: -8,
    right: -8,
    backgroundColor: AppColors.gray[5],
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  imageButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  textInputWrapper: {
    flex: 1,
    minHeight: 44,
    justifyContent: "center",
  },
  sendButton: {
    borderRadius: 20,
    overflow: "hidden",
  },
  gradientButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    justifyContent: "center",
    alignItems: "center",
  },
});
