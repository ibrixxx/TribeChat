import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createJSONStorage, persist } from "zustand/middleware";
import { MessageJSON, Participant } from "@/types/chat";

interface ChatState {
  sessionUuid: string | null;
  selectedMessageUuid: string | null;
  setSessionUuid: (uuid: string | null) => void;
  setSelectedMessageUuid: (uuid: string | null) => void;
  messages: MessageJSON[];
  addMessages: (messages: MessageJSON[]) => void;
  participants: Participant[];
  setParticipants: (participants: Participant[]) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      sessionUuid: null,
      selectedMessageUuid: null,
      messages: [],
      participants: [],

      setSessionUuid: (uuid) => set({ sessionUuid: uuid }),
      setSelectedMessageUuid: (uuid) => set({ selectedMessageUuid: uuid }),
      addMessages: (newMessages) =>
        set((state) => {
          const uniqueMessages = newMessages.filter(
            (newMsg) => !state.messages.some((msg) => msg.uuid === newMsg.uuid)
          );
          return {
            messages: [...uniqueMessages, ...state.messages].sort(
              (a, b) => b.sentAt - a.sentAt
            ),
          };
        }),

      setParticipants: (participants) => set({ participants }),
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        messages: state.messages,
        participants: state.participants,
        sessionUuid: state.sessionUuid,
      }),
    }
  )
);
