import { MessageJSON } from "@/types/chat";

export const groupMessages = (messages: MessageJSON[] | undefined) => {
  const groups: MessageJSON[][] = [];
  let currentGroup: MessageJSON[] = [];

  messages?.forEach((message, index) => {
    const previousMessage = messages[index - 1];
    const timeDiff = previousMessage
      ? message.sentAt - previousMessage.sentAt
      : 0;

    if (
      currentGroup.length === 0 ||
      (currentGroup[0].authorUuid === message.authorUuid && timeDiff < 60000)
    ) {
      currentGroup.push(message);
    } else {
      if (currentGroup.length > 0) {
        groups.push([...currentGroup]);
      }
      currentGroup = [message];
    }
  });

  if (currentGroup.length > 0) {
    groups.push(currentGroup);
  }
  return groups.reverse();
};
