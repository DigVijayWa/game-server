const processPlayerJoinedMessage = (data: any) => {
    
};
const processPlayerLeftMessage = () => {};

const processPlayerPacketMessage = () => {};

export const processMessage = async (message: string) => {
    
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
