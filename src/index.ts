import express from "express";
import expressWs from "express-ws";
import WebSocket, { Server /* etc */ } from "ws";

import { ConnectedClients, Packet, InitialMessage } from "./types/types";

const { app, getWss, applyTo } = expressWs(express());

const port = 8080;

const connectedClients: ConnectedClients[] = [];

app.ws("/connect", (ws, req) => {
  // push the upcoming websocket connection to the existing clientList.
  connectedClients.push({
    webSocket: ws,
    id: req.query.id as string,
    ipAddress: req.connection.remoteAddress,
  });

  ws.on("message", (message) =>{
    // tslint:disable-next-line:no-console
    console.log("received: %s", message);
    sendAll({
      id: new Date().getTime(),
      data: message.toString(),
      length: message.toString().length,
    });
  });

  ws.send({message: "Connected", validity: 1000000});
});

const sendAll = (packet: Packet) => {
  connectedClients.forEach((item) => item.webSocket.send(packet));
}

// adding websocket.

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
