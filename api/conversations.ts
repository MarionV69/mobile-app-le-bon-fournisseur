import type { ImagePickerAsset } from "expo-image-picker";
import type {
  Conversation,
  Message,
  MessageAttachment,
  UnreadCount,
} from "../types/conversations.types";
import api from "./axiosConfig";

export const createConversation = async (
  supplierId: number,
): Promise<Conversation> => {
  const response = await api.post<Conversation>("/conversations", {
    supplierId,
  });
  return response.data;
};

export const sendMessage = async (
  conversationId: number,
  { content, attachment }: { content?: string; attachment?: ImagePickerAsset },
): Promise<Message> => {
  const formData = new FormData();

  if (content?.trim()) {
    formData.append("content", content);
  }
  if (attachment) {
    formData.append("attachment", {
      uri: attachment.uri,
      name: attachment.fileName ?? "photo.jpg",
      type: attachment.mimeType ?? "image/jpeg",
    } as unknown as Blob);
  }

  const response = await api.post<Message>(
    `/conversations/${conversationId}/messages`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );

  return response.data;
};

export const sendAttachment = async (
  conversationId: number,
  messageId: number,
  attachment: ImagePickerAsset,
): Promise<MessageAttachment> => {
  const formData = new FormData();
  formData.append("attachment", {
    uri: attachment.uri,
    name: attachment.fileName ?? "photo.jpg",
    type: attachment.mimeType ?? "image/jpeg",
  } as unknown as Blob);

  const response = await api.post<MessageAttachment>(
    `/conversations/${conversationId}/messages/${messageId}/attachments`,
    formData,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return response.data;
};

export const getConversations = async (): Promise<Conversation[]> => {
  const response = await api.get<Conversation[]>("/conversations");
  return response.data;
};

export const getUnreadCount = async (): Promise<number> => {
  const response = await api.get<UnreadCount>("/conversations/unread-count");
  return response.data.count;
};

export const getConversationMessages = async (
  conversationId: number,
): Promise<Message[]> => {
  const response = await api.get<Message[]>(
    `/conversations/${conversationId}/messages`,
  );
  return response.data;
};

export const getAttachmentUrl = async (endpoint: string): Promise<string> => {
  const response = await api.get<{ url: string }>(endpoint);
  return response.data.url;
};
