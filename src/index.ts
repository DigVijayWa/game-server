import express from "express";
import expressWs from "express-ws";
import WebSocket, { Server /* etc */ } from "ws";

import { ConnectedClients, Packet } from "./types/Types";
import { getDataFromMessage, playerMessageToString } from "./utility/Utility";
import { ConnectedClientList } from "./network/ConnectedClientList";
import { processMessage } from "./processor/MessageProcessor";

const { app, getWss, applyTo } = expressWs(express());

const port = 8080;

const connectedClients: ConnectedClients[] = [];

const connectedClientList = new ConnectedClientList([]);

app.ws("/connect", (ws, req) => {
  // push the upcoming websocket connection to the existing clientList.
  connectedClients.push({
    webSocket: ws,
    id: req.query.id as string,
    ipAddress: req.connection.remoteAddress,
    validity: 3000,
  });

  connectedClientList.addConnectedClients({
    webSocket: ws,
    id: req.query.id as string,
    ipAddress: req.connection.remoteAddress,
    validity: 3000,
  });

  ws.on("message", async (message) => {
    // tslint:disable-next-line:no-console
    console.log("received: %s", message);

    const playerData = await getDataFromMessage(message.toString());

    processMessage(message.toString(), connectedClientList);
  });

  ws.on("close", async (message) => {
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

app.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
