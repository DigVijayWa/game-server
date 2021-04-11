import express from "express";
import expressWs from "express-ws";
import WebSocket, { Server /* etc */ } from "ws";

import { ConnectedClients, PlayerMessage } from "./types/Types";
import { playerMessageToString } from "./utility/Utility";

const { app, getWss, applyTo } = expressWs(express());

const port = 8080;

let connectedClients: ConnectedClients[] = [];

app.ws("/connect", (ws, req) => {
  // push the upcoming websocket connection to the existing clientList.
  connectedClients.push({
    webSocket: ws,
    id: req.query.id as string,
    ipAddress: req.connection.remoteAddress,
  });

  ws.on("message", (message) => {
    // tslint:disable-next-line:no-console
    console.log("received: %s", message);
    sendAll(
      {
        type: "PACKET",
        id: new Date().getTime(),
        data: message.toString(),
        length: message.toString().length,
      },
      connectedClients
    );
  });

  ws.on("close", (message) => {
    (async () => {
      connectedClients = await removeConnectedClient(
        message.toString(),
        connectedClients
      );
      
      sendAll(
        {
          type: "PLAYER_LEFT",
          id: new Date().getTime(),
          leftPlayer: message.toString(),
          length: message.toString().length,
        },
        connectedClients
      );
    })();
  });

  sendAll(
    {
      type: "PLAYER_JOINED",
      id: new Date().getTime(),
      joinedPlayer: req.query.id as string,
      length: req.query.id.toString().length,
    },
    connectedClients
  );
});

const sendAll = (packet: PlayerMessage, clients: ConnectedClients[]) => {
  clients.forEach((item) => item.webSocket.send(playerMessageToString(packet)));
};

const removeConnectedClient = async (
  connectedClientId: string,
  clients: ConnectedClients[]
) => {
  return await clients.splice(clients.findIndex(item => item.id === connectedClientId), 1);
};

// adding websocket.

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
