import WebSocket, { Server /* etc */ } from "ws";
import { v4 as uuid } from "uuid";

describe.skip("🔥 Test if clients are closed after timeout", () => {

    it("should test dead connections after timeout", async () => {
        jest.setTimeout(10000);
        const idOne = uuid();
        const idTwo = uuid();
        const idThree = uuid();
        const clientOne = new WebSocket(`ws://localhost:8080?id=${idOne}`);
        const clientTwo = new WebSocket(`ws://localhost:8080?id=${idTwo}`);
        const clientThree = new WebSocket(`ws://localhost:8080?id=${idThree}`);


        const checkClients = () : Promise<boolean> => {
            return new Promise((resolve, reject) => {
                setTimeout(()=> {
                    clientOne.readyState === clientOne.CLOSED &&
                    clientTwo.readyState === clientTwo.CLOSED &&
                    clientThree.readyState === clientThree.CLOSED ?
                    resolve(true): reject(false);
                }, 10100);
            });
        }

        const testResult = await checkClients();

        expect(testResult).toBe(true);

    });
  });