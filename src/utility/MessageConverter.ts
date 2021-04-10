import WebSocket, { Server /* etc */ } from "ws";

export let formConnectedClient = (
  webSocket: WebSocket,
  id: string,
  ipAddress: string
) => {
  return {
    webSocket,
    id,
    ipAddress,
  };
};

export let formPacket = (message: string) => {
  return {
    id: new Date().getTime(),
    data: message.toString(),
    length: message.toString().length,
  };
};


export let formInitialMessage = () => {
    return {
        message: "Connected",
        validity: 1000000
    }
}
