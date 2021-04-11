import WebSocket, { Server /* etc */ } from "ws";

export type Packet = {
  type: 'PACKET';
  data: string;
  id: number;
  length: number;
};
export type PlayerJoined = {
  type: 'PLAYER_JOINED';
  joinedPlayer: string,
  id: number;
  length: number;
};

export type PlayerLeft = {
  type: 'PLAYER_LEFT';
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


