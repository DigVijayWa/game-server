import { broadcastMessage, broadcastMessageString } from "../network/WebSocketHandler";
import { ConnectedClients } from "../types/Types";

const processPlayerJoinedMessage = (data: string, connectedClients: ConnectedClients[]) => {
    broadcastMessageString(connectedClients, data);
};
const processPlayerLeftMessage = (data: string, playerId: string, connectedClients: ConnectedClients[]) => {
    
    connectedClients = connectedClients.filter(item=> !(item.id === playerId));

    broadcastMessageString(connectedClients, data);
};

const processPlayerPacketMessage = () => {};

export const processMessage = async (message: string, connectedClients: ConnectedClients[]) => {
    
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
