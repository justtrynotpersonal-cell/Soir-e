export interface RoomChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderColor: string;
  text: string;
  timestamp: number;
}

export interface LocationPin {
  userId: string;
  displayName: string;
  color: string;
  lat: number;
  lng: number;
  accuracy?: number;
  updatedAt: number;
}

export interface LocationUpdatePayload {
  userId: string;
  displayName: string;
  color: string;
  lat: number;
  lng: number;
  accuracy?: number;
  updatedAt: number;
}

export interface LocationClearPayload {
  userId: string;
}
