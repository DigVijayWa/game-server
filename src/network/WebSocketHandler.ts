import { playerMessageToString } from "../utility/Utility";
import { Packet } from "../types/Types";
import { ConnectedClients } from "../types/Types";

export const broadcastMessage = (connectedClients: ConnectedClients[], message: Packet) => {
    connectedClients.forEach((item) => item.webSocket.send(playerMessageToString(message)));
}

export const broadcastMessageString = (connectedClients: ConnectedClients[], message: string) => {
    connectedClients.forEach((item) => item.webSocket.send(message));
}

export const removeConnectedClient = async (
    connectedClientId: string,
    connectedClients: ConnectedClients[]
  ) => {
    return await connectedClients.filter(item=> !(item.id === connectedClientId));
  };