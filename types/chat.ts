export interface MessageAttachment {
  uuid: string;
  type: "image";
  url: string;
  width: number;
  height: number;
}

export interface Reaction {
  uuid: string;
  participantUuid: string;
  value: string;
}

export interface Participant {
  uuid: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  email?: string;
  jobTitle?: string;
  createdAt: number;
  updatedAt: number;
}

export interface Message {
  uuid: string;
  text: string;
  attachments: MessageAttachment[];
  replyToMessageUuid?: string;
  reactions: Reaction[];
  authorUuid: string;
  sentAt: number;
  updatedAt: number;
}

export type MessageJSON = Omit<Message, "replyToMessageUuid"> & {
  replyToMessage?: Omit<Message, "replyToMessageUuid">;
};
