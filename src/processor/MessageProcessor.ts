import { ConnectedClientList } from "../network/ConnectedClientList";
import { broadcastMessage, broadcastMessageString } from "../network/WebSocketHandler";
import { ConnectedClients } from "../types/Types";

const processPlayerJoinedMessage = (data: string, connectedClientList: ConnectedClientList) => {
    broadcastMessageString(connectedClientList, data);
};
const processPlayerLeftMessage = (data: string, playerId: string, connectedClientList: ConnectedClientList) => {

    connectedClientList.setConnectedClientList(connectedClientList.connectedClients.filter(item=> !(item.id === playerId)));

    broadcastMessageString(connectedClientList, data);
};

const processPlayerPacketMessage = () => {};

export const processMessage = async (message: string, connectedClientList: ConnectedClientList) => {
    
    const data = await JSON.parse(message);

    switch(data.type) {
        case "PLAYER_JOINED": 
        break;
        case "PLAYER_LEFT": 
        break;
        case "PACKET": 
        break;
        default: 
    }
};
