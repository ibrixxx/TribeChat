import { MessageJSON } from "@/types/chat";

export const groupMessages = (messages: MessageJSON[] | undefined) => {
  if (!messages?.length) return [];

  const groups: MessageJSON[][] = [];
  let currentGroup: MessageJSON[] = [];

  for (let i = messages.length - 1; i >= 0; i--) {
    const message = messages[i];
    const nextMessage = messages[i + 1]; // Next message in time
    const timeDiff = nextMessage ? nextMessage.sentAt - message.sentAt : 0;

    if (
      currentGroup.length === 0 ||
      (currentGroup[0].authorUuid === message.authorUuid &&
        Math.abs(timeDiff) < 60000)
    ) {
      currentGroup.push(message);
    } else {
      if (currentGroup.length > 0) {
        groups.push([...currentGroup]);
      }
      currentGroup = [message];
    }
  }

  if (currentGroup.length > 0) {
    groups.push([...currentGroup]);
  }

  return groups.reverse();
};
