import express from "express";
import expressWs from "express-ws";
import WebSocket, { Server /* etc */ } from "ws";

import {
  ConnectedClients,
  Packet,
  InitialMessage,
  PlayerMessage,
} from "./types/Types";

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
    sendAll({
      type: "PACKET",
      id: new Date().getTime(),
      data: message.toString(),
      length: message.toString().length,
    });
  });

  ws.on("close", (message) => {
    connectedClients = removeConnectedClient(message.toString());

    sendAll({
      type: "PLAYER_LEFT",
      id: new Date().getTime(),
      leftPlayer: message.toString(),
      length: message.toString().length,
    });
  });

  sendAll({
    type: "PLAYER_JOINED",
    id: new Date().getTime(),
    joinedPlayer: req.query.id as string,
    length: req.query.id.toString().length,
  });
});

const sendAll = (packet: PlayerMessage) => {
  connectedClients.forEach((item) => item.webSocket.send(packet));
};

const removeConnectedClient = (connectedClientId: string) => {
  return connectedClients.filter((item) => !(item.id === connectedClientId));
};

// adding websocket.

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
