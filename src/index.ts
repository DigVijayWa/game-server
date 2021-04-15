import express from "express";
import WebSocket, { Server /* etc */ } from "ws";

import { getDataFromMessage, encodePlayerMessage } from "./utility/Utility";
import { ConnectedClientList } from "./network/ConnectedClientList";
import { processMessage } from "./processor/MessageProcessor";
import http from "http";

const app  = express();

const port = process.env.PORT || 8080;

const connectedClientList = new ConnectedClientList([]);

const server = http.createServer(app);

const websocket = new WebSocket.Server({server});

websocket.on("/connect", (ws, req) => {

  connectedClientList.addConnectedClients({
    webSocket: ws,
    id: req.query.id as string,
    ipAddress: req.connection.remoteAddress,
    validity: 10000,
  });

  ws.on("message", async (message: string) => {
    // tslint:disable-next-line:no-console
    console.log("received: %s", message);

    const playerData = await getDataFromMessage(message.toString());

    processMessage(message.toString(), connectedClientList);
  });

  ws.on("close", async (message: string) => {
    const playerData = await getDataFromMessage(message.toString());

    processMessage(message.toString(), connectedClientList);
  });
});

setInterval(() => {
  const closedClients = connectedClientList.connectedClients.filter(
    (item) => item.validity < 10
  );

  closedClients.forEach((item) => item.webSocket.close());

  // tslint:disable-next-line:no-console
  console.log("removed: %s", closedClients);

  connectedClientList.setConnectedClientList(
    connectedClientList.connectedClients.filter((item) => item.validity >= 10)
  );

  // tslint:disable-next-line:no-console
  console.log("alive: %s", connectedClientList.connectedClients);
}, 4000);

setInterval(() => {
  connectedClientList.setConnectedClientList(
    connectedClientList.connectedClients.map((item) => {
      return {
        ...item,
        validity: item.validity - 1000,
      };
    })
  );
}, 1000);

// adding websocket.

server.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
