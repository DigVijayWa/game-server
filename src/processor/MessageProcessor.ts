import { ConnectedClientList } from "../network/ConnectedClientList";
import {
  broadcastMessage,
  broadcastMessageString,
} from "../network/WebSocketHandler";
import { ConnectedClients } from "../types/Types";

const processPlayerJoinedAndPacketMessage = async (
  data: string,
  connectedClientList: ConnectedClientList
) => {
  const playerData = await JSON.parse(data);

  const updatedClientList = connectedClientList.connectedClients.map((item) =>
    item.id === playerData.id ? { ...item, validity: 10000 } : item
  );

  connectedClientList.setConnectedClientList(updatedClientList);

  broadcastMessageString(connectedClientList, data);
};
const processPlayerLeftMessage = async (
  data: string,
  connectedClientList: ConnectedClientList
) => {
  const playerData = await JSON.parse(data);

  connectedClientList.setConnectedClientList(
    connectedClientList.connectedClients.filter(
      (item) => !(item.id === playerData.id)
    )
  );

  broadcastMessageString(connectedClientList, data);
};

export const processMessage = async (
  message: string,
  connectedClientList: ConnectedClientList
) => {
  const data = await JSON.parse(message);

  switch (data.type) {
    case "PLAYER_JOINED":
    case "PACKET":
      processPlayerJoinedAndPacketMessage(message, connectedClientList);
      break;
    case "PLAYER_LEFT":
      processPlayerLeftMessage(message, connectedClientList);
      break;
    default:
  }
};
