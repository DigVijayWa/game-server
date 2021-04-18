import WebSocket, { Server /* etc */ } from "ws";
import { v4 as uuid } from "uuid";
import axios from "axios";

import { Packet } from "../../src/types/Types";
import {
  checkEquality,
  decodePlayerMessage,
  encodePlayerData,
  encodePlayerMessage,
} from "../../src/utility/Utility";

describe("🔥 Test if PACKET is sent across clients", () => {

  it("Test server is alive", async () => {
    const checkHealthy = (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        axios
          .get("http://localhost:8080/healthcheck")
          .then((_) => resolve(true))
          .catch((_) => reject(false));
      });
    };
    const healthy = await checkHealthy();

    expect(healthy).toBe(true);
  });

  it("Test for 2 clients", async () => {
    jest.setTimeout(10000);
    const idOne = uuid();
    const idTwo = uuid();
    const clientOne = new WebSocket(`ws://localhost:8080?id=${idOne}`);
    const clientTwo = new WebSocket(`ws://localhost:8080?id=${idTwo}`);
    const data  = { name: "PLAYER_ONE", xInput: 1, yInput: 2 };

    const packetPlayerOne: Packet = {
      type: "PLAYER_JOINED",
      correlationId: new Date().getTime(),
      id: idOne,
      length: encodePlayerData(data).length,
      data,
    };

    const checkTimeAndExecute = (): Promise<boolean> => {
      return new Promise((resolve, reject) => {
        clientTwo.on("message", async (message: string) => {
          const playerPacket = await decodePlayerMessage(message);
          
          resolve(checkEquality(playerPacket, packetPlayerOne));
        });

        clientOne.on("open", () => {
          clientOne.send(encodePlayerMessage(packetPlayerOne));
        });

        clientOne.on("error", () => reject(false));
        clientTwo.on("error", () => reject(false));
      });
    };

    const result = await checkTimeAndExecute();

    expect(result).toBe(true);

    clientOne.readyState === clientOne.OPEN ? clientOne.close() : undefined;
    clientTwo.readyState === clientTwo.OPEN ? clientTwo.close() : undefined;
  });
});
