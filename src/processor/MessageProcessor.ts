import { decodePlayerMessage, encodePlayerMessage } from "../utility/Utility";
import { ConnectedClientList } from "../network/ConnectedClientList";
import {
  broadcastMessage,
  broadcastMessageString,
} from "../network/WebSocketHandler";
import { ConnectedClients, Packet } from "../types/Types";

const processPlayerJoinedAndPacketMessage = async (
  data: Packet,
  connectedClientList: ConnectedClientList
) => {
  const updatedClientList = connectedClientList.connectedClients.map((item) =>
    item.id === data.id ? { ...item, validity: 10000 } : item
  );

  connectedClientList.setConnectedClientList(updatedClientList);

  broadcastMessageString(connectedClientList, encodePlayerMessage(data));
};
const processPlayerLeftMessage = async (
  data: Packet,
  connectedClientList: ConnectedClientList
) => {

  connectedClientList.setConnectedClientList(
    connectedClientList.connectedClients.filter(
      (item) => !(item.id === data.id)
    )
  );

  broadcastMessageString(connectedClientList, encodePlayerMessage(data));
};

export const processMessage = async (
  message: string,
  connectedClientList: ConnectedClientList
) => {
  const data = await decodePlayerMessage(message);

  switch (data.type) {
    case "PLAYER_JOINED":
    case "PACKET":
      processPlayerJoinedAndPacketMessage(data, connectedClientList);
      break;
    case "PLAYER_LEFT":
      processPlayerLeftMessage(data, connectedClientList);
      break;
    default:
  }
};
