import { MessageAttachment, MessageJSON, Participant } from "@/types/chat";
import * as FileSystem from "expo-file-system";
import axios from "axios";

const API_BASE = "http://dummy-chat-server.tribechat.pro/api";

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

export const chatApi = {
  getInfo: async () => {
    try {
      const { data } = await api.get<{
        sessionUuid: string;
        apiVersion: number;
      }>("/info");
      return data;
    } catch (error) {
      console.error("Error fetching server info:", error);
      throw error;
    }
  },

  getAllMessages: async () => {
    const { data } = await api.get<MessageJSON[]>("/messages/all");
    return data;
  },

  getLatestMessages: async () => {
    const { data } = await api.get<MessageJSON[]>("/messages/latest");
    return data;
  },

  getOlderMessages: async (refMessageUuid: string) => {
    const { data } = await api.get<MessageJSON[]>(
      `/messages/older/${refMessageUuid}`
    );
    return data;
  },

  getMessageUpdates: async (timestamp: number) => {
    const { data } = await api.get<MessageJSON[]>(
      `/messages/updates/${timestamp}`
    );
    return data;
  },

  getAllParticipants: async () => {
    const { data } = await api.get<Participant[]>("/participants/all");
    return data;
  },

  getParticipantUpdates: async (timestamp: number) => {
    const { data } = await api.get<Participant[]>(
      `/participants/updates/${timestamp}`
    );
    return data;
  },

  uploadImage: async (uri: string): Promise<MessageAttachment> => {
    try {
      const base64 = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      return {
        uuid: Date.now().toString(),
        type: "image",
        url: uri,
        width: 800,
        height: 600,
      };
    } catch (error) {
      console.error("Error uploading image:", error);
      throw new Error("Failed to upload image");
    }
  },

  sendMessage: async (text: string) => {
    const { data } = await api.post<MessageJSON>("/messages/new", { text });
    return data;
  },

  sendMessageWithAttachment: async (
    text: string,
    attachment: MessageAttachment
  ) => {
    const { data } = await api.post<MessageJSON>("/messages/new", {
      text,
      attachments: [attachment],
    });
    return data;
  },
};
