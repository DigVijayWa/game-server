import express from "express";
import WebSocket, { Server /* etc */ } from "ws";
import http from "http";
import uuid from "uuid";

import { decodePlayerMessage } from "./utility/Utility";
import { ConnectedClientList } from "./network/ConnectedClientList";
import { processMessage } from "./processor/MessageProcessor";

const app = express();

const port = process.env.PORT || 8080;

const connectedClientList = new ConnectedClientList([]);

const server = http.createServer(app);

const websocket = new WebSocket.Server({ server });

websocket.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {

  const id = req.url.split("/?id=")[1] || uuid.v4();

  connectedClientList.addConnectedClients({
    webSocket: ws,
    id,
    ipAddress: req.connection.remoteAddress,
    validity: 10000,
  });

  // tslint:disable-next-line:no-console
  console.log("connection request received %s", id);

  ws.on("message", async (message: string) => {
    // tslint:disable-next-line:no-console
    console.log("received: %s", message);

    const playerData = await decodePlayerMessage(message.toString());

    processMessage(message.toString(), connectedClientList);
  });

  ws.on("close", async (message: string) => {
    try {
      const playerData = await decodePlayerMessage(message.toString());
      processMessage(message.toString(), connectedClientList);
    } catch (e) {
      // tslint:disable-next-line:no-console
      console.log(
        "Skipping the close message due to exception in parsing: %s",
        message
      );
    }
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


app.get("/healthcheck", (_, res)=> {
  res.send("OK");
})

server.listen(port, () => {
  // tslint:disable-next-line:no-console
  console.log(`server started at http://localhost:${port}`);
});
