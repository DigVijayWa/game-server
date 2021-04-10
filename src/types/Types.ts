import WebSocket, { Server /* etc */ } from "ws";

export type Packet = {
  type: string;
  data: string;
  id: number;
  length: number;
};
export type PlayerJoined = {
  type: string;
  joinedPlayer: string,
  id: number;
  length: number;
};

export type PlayerLeft = {
  type: string;
  leftPlayer: string,
  id: number;
  length: number;
};

export type PlayerMessage = PlayerJoined | PlayerLeft | Packet;

export type ConnectedClients = {
  webSocket: WebSocket;
  id: string;
  ipAddress: string;
};

export type InitialMessage = {
  message: string;
  validity: number;
};


