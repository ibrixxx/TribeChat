import {
  useQuery,
  useQueryClient,
  useMutation,
  useInfiniteQuery,
  QueryFunctionContext,
  InfiniteData,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { chatApi } from "../api/chatApi";
import { MessageJSON, Participant } from "../types/chat";
import { useChatStore } from "@/stores/chatStore";
import moment from "moment";

const PAGE_SIZE = 25;

export const useChat = () => {
  const queryClient = useQueryClient();
  const {
    sessionUuid,
    setSessionUuid,
    messages: offlineMessages,
    participants: offlineParticipants,
    addMessages,
    setParticipants,
  } = useChatStore();

  const { data: serverInfo } = useQuery({
    queryKey: ["serverInfo"],
    queryFn: chatApi.getInfo,
    refetchInterval: 30000,
  });

  const {
    data: messagesData,
    isLoading: isLoadingMessages,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ["messages"],
    queryFn: async ({
      pageParam,
    }: QueryFunctionContext<string[], string | null>) => {
      if (pageParam) {
        const messages = await chatApi.getOlderMessages(pageParam);
        addMessages(messages);
        return messages;
      }
      const messages = await chatApi.getLatestMessages();
      addMessages(messages);
      return messages;
    },
    getNextPageParam: (lastPage) => {
      if (lastPage.length < PAGE_SIZE) {
        return null;
      }
      return lastPage[0]?.uuid ?? null;
    },
    initialPageParam: null,
    refetchInterval: 5000,
    enabled: !!sessionUuid,
    select: (data) => ({
      pages: data.pages.map((page) => [...page].reverse()),
      pageParams: data.pageParams,
    }),
    retry: 2,
    retryDelay: 1000,
    networkMode: "online",
  });

  const { data: participants = [], isLoading: isLoadingParticipants } =
    useQuery<Participant[]>({
      queryKey: ["participants"],
      queryFn: async () => {
        const data = await chatApi.getAllParticipants();
        setParticipants(data);
        return data;
      },
      enabled: !!sessionUuid,
      refetchInterval: 60000,
      retry: 2,
      retryDelay: 1000,
      networkMode: "online",
    });

  const loadOlderMessages = async () => {
    if (!isFetchingNextPage && hasNextPage) {
      await fetchNextPage();
    }
  };

  const sendMessageMutation = useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      return chatApi.sendMessage(text);
    },
    onMutate: async ({ text }) => {
      await queryClient.cancelQueries({ queryKey: ["messages"] });

      const previousMessages = queryClient.getQueryData<
        InfiniteData<MessageJSON[]>
      >(["messages"]);

      const optimisticMessage: MessageJSON = {
        uuid: `temp-${Date.now()}`,
        text,
        sentAt: moment().unix(),
        updatedAt: moment().unix(),
        authorUuid: "you",
        attachments: [],
        reactions: [],
      };

      queryClient.setQueryData<InfiniteData<MessageJSON[]>>(
        ["messages"],
        (oldData) => {
          if (!oldData)
            return { pages: [[optimisticMessage]], pageParams: [null] };
          return {
            ...oldData,
            pages: [
              [...oldData.pages[0], optimisticMessage],
              ...oldData.pages.slice(1),
            ],
          };
        }
      );

      return { previousMessages };
    },
    onError: (err, newMessage, context) => {
      if (context?.previousMessages) {
        queryClient.setQueryData<InfiniteData<MessageJSON[]>>(
          ["messages"],
          context.previousMessages
        );
      }
    },
    onSuccess: (newMessage) => {
      queryClient.setQueryData<InfiniteData<MessageJSON[]>>(
        ["messages"],
        (oldData) => {
          if (!oldData) return { pages: [[newMessage]], pageParams: [null] };

          const firstPage = oldData.pages[0].map((msg) =>
            msg.uuid.startsWith("temp-") ? newMessage : msg
          );

          return {
            ...oldData,
            pages: [firstPage, ...oldData.pages.slice(1)],
          };
        }
      );
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
  });

  useEffect(() => {
    if (serverInfo?.sessionUuid !== sessionUuid) {
      setSessionUuid(serverInfo?.sessionUuid || null);
      queryClient.invalidateQueries();
    }
  }, [queryClient, serverInfo?.sessionUuid, sessionUuid, setSessionUuid]);

  return {
    messages: messagesData?.pages.flat() ?? offlineMessages,
    participants: participants.length > 0 ? participants : offlineParticipants,
    isLoading: isLoadingMessages || isLoadingParticipants,
    loadOlderMessages,
    sendMessage: sendMessageMutation.mutate,
    isSending: sendMessageMutation.isPending,
  };
};
