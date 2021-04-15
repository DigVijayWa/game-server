import WebSocket, { Server /* etc */ } from "ws";
import {v4 as uuid} from "uuid";
import { Packet } from "../../src/types/Types";
import { decodePlayerMessage, encodePlayerMessage } from "../../src/utility/Utility";

describe("🔥 Test if PACKET is sent across clients", () => {
  it("Test for 2 clients", async () => {
    const idOne = uuid();
    const idTwo = uuid();
    const clientOne = new WebSocket(`ws://localhost:8080?id=${idOne}`);
    const clientTwo = new WebSocket(`ws://localhost:8080?id=${idTwo}`);

    const packetPlayerOne: Packet = {type: "PLAYER_JOINED", correlationId: new Date().getTime(), id: idOne, length: idOne.length, data:{ name: "PLAYER_ONE", xInput: 1, yInput: 2}};


    const checkTimeAndExecute = async () => {
      clientTwo.on("message", async (message: string) => {
      
        const playerPacket = await decodePlayerMessage(message);
  
        expect(playerPacket).toStrictEqual(packetPlayerOne);
      });
  
      clientOne.on("open", () => {
          clientOne.send(encodePlayerMessage(packetPlayerOne));
      });

      setTimeout(() => Promise.reject(false), 3000);
    }


    const _ = await checkTimeAndExecute();

    clientOne.readyState === clientOne.OPEN ? clientOne.close() : undefined;

    clientTwo.readyState === clientTwo.OPEN ? clientTwo.close() : undefined;

  });
});
