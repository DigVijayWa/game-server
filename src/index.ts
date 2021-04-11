import express from "express";
import expressWs from "express-ws";
import WebSocket, { Server /* etc */ } from "ws";

import { ConnectedClients, PlayerMessage } from "./types/Types";
import { getDataFromMessage, playerMessageToString } from "./utility/Utility";

const { app, getWss, applyTo } = expressWs(express());

const port = 8080;

let connectedClients: ConnectedClients[] = [];

app.ws("/connect", (ws, req) => {
  // push the upcoming websocket connection to the existing clientList.
  connectedClients.push({
    webSocket: ws,
    id: req.query.id as string,
    ipAddress: req.connection.remoteAddress,
    validity: 3000,
  });

  ws.on("message", async (message) => {
    // tslint:disable-next-line:no-console
    console.log("received: %s", message);

    const playerData = await getDataFromMessage(message.toString());

    sendAll(
      {
        type: "PACKET",
        correlationId: new Date().getTime(),
        id: playerData.playerId,
        data: message.toString(),
        length: message.toString().length,
      },
      connectedClients
    );
  });

  ws.on("close", async (message) => {

      const playerData = await getDataFromMessage(message.toString());

      connectedClients = await removeConnectedClient(
        playerData.playerId,
        connectedClients
      );

      sendAll(
        {
          type: "PLAYER_LEFT",
          correlationId: new Date().getTime(),
          leftPlayer: playerData.playerId,
          length: message.toString().length,
        },
        connectedClients
      );
  });

  sendAll(
    {
      type: "PLAYER_JOINED",
      correlationId: new Date().getTime(),
      joinedPlayer: req.query.id as string,
      length: req.query.id.toString().length,
    },
    connectedClients
  );
});


setInterval(()=> {
  const closedClients = connectedClients.filter(item => item.validity < 10);

  closedClients.forEach(item => item.webSocket.close());

  // tslint:disable-next-line:no-console
  console.log("removed: %s", closedClients);

  connectedClients = connectedClients.filter(item => item.validity >= 10);

  // tslint:disable-next-line:no-console
  console.log("alive: %s", connectedClients);

}, 3500);


setInterval(()=> {
  connectedClients = connectedClients.map(item => {
    return {
      ...item,
      validity: item.validity-1000
    }
  });

}, 1000);

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
