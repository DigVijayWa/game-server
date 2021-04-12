import WebSocket, { Server /* etc */ } from "ws";

/**
 * We should really make Packet.data into its separate type
 * in case we want to do some extra processing before sending out the message.
 */
export type Packet = {
  type: string;
  data: PlayerData;
  id: string;
  correlationId: number;
  length: number;
};

export type PlayerData = {
  name: string,
  xInput: number,
  yInput: number,
};

export type ConnectedClients = {
  webSocket: WebSocket;
  id: string;
  ipAddress: string;
  validity: number;
};

export type InitialMessage = {
  message: string;
  validity: number;
};



