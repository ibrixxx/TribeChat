import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";

interface ChatState {
  sessionUuid: string | null;
  selectedMessageUuid: string | null;
  setSessionUuid: (uuid: string | null) => void;
  setSelectedMessageUuid: (uuid: string | null) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessionUuid: null,
      selectedMessageUuid: null,
      setSessionUuid: (uuid) => set({ sessionUuid: uuid }),
      setSelectedMessageUuid: (uuid) => set({ selectedMessageUuid: uuid }),
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
