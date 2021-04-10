import WebSocket, { Server /* etc */ } from "ws";

export type Packet = {
  data: string;
  id: number;
  length: number;
};

export type ConnectedClients = {
  webSocket: WebSocket;
  id: string;
  ipAddress: string;
};

export type InitialMessage = {
  message: string;
  validity: number;
};
