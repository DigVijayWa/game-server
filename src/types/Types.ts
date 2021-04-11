import WebSocket, { Server /* etc */ } from "ws";

/**
 * We should really make Packet.data into its separate type
 * in case we want to do some extra processing before sending out the message.
 */
export type Packet = {
  type: 'PACKET';
  data: string;
  id: string;
  correlationId: number;
  length: number;
};
export type PlayerJoined = {
  type: 'PLAYER_JOINED';
  joinedPlayer: string,
  correlationId: number;
  length: number;
};

export type PlayerLeft = {
  type: 'PLAYER_LEFT';
  leftPlayer: string,
  correlationId: number;
  length: number;
};

export type PlayerMessage = PlayerJoined | PlayerLeft | Packet;

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



