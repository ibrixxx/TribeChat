import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect } from "react";
import { chatApi } from "../api/chatApi";
import { MessageJSON, Participant } from "../types/chat";
import { useChatStore } from "@/stores/chatStore";

export const useChat = () => {
  const queryClient = useQueryClient();
  const { sessionUuid, setSessionUuid } = useChatStore();

  // Server info query - checks for session changes
  const { data: serverInfo } = useQuery({
    queryKey: ["serverInfo"],
    queryFn: chatApi.getInfo,
    refetchInterval: 30000,
  });

  // Messages query with polling
  const { data: messages = [], isLoading: isLoadingMessages } = useQuery<
    MessageJSON[]
  >({
    queryKey: ["messages"],
    queryFn: chatApi.getLatestMessages,
    enabled: !!sessionUuid,
    refetchInterval: 5000,
  });

  // Participants query with polling
  const { data: participants = [], isLoading: isLoadingParticipants } =
    useQuery<Participant[]>({
      queryKey: ["participants"],
      queryFn: chatApi.getAllParticipants,
      enabled: !!sessionUuid,
      refetchInterval: 10000,
    });

  // Load older messages
  const loadOlderMessages = async (refMessageUuid: string) => {
    const olderMessages = await chatApi.getOlderMessages(refMessageUuid);
    queryClient.setQueryData(["messages"], (oldData: MessageJSON[] = []) => {
      return [...oldData, ...olderMessages];
    });
  };

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      return chatApi.sendMessage(text);
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData(["messages"], (oldData: MessageJSON[] = []) => {
        return [...oldData, newMessage];
      });
    },
  });

  // Update session if changed
  useEffect(() => {
    if (serverInfo?.sessionUuid !== sessionUuid) {
      setSessionUuid(serverInfo?.sessionUuid || null);
      queryClient.invalidateQueries();
    }
  }, [serverInfo?.sessionUuid]);

  return {
    messages,
    participants,
    isLoading: isLoadingMessages || isLoadingParticipants,
    loadOlderMessages,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
  };
};
