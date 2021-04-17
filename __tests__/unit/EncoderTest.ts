import { decodePlayerMessage, encodePlayerData, encodePlayerMessage } from "../../src/utility/Utility";
import { v4 as uuid } from "uuid";


describe("🔥 Test should return Encoded Value", () => {

  it("Valid PACKET value", async () => {
    //prepare
    const id = uuid();
    const data = { xInput: 0, yInput: 0, name: "test"};
    const res = {correlationId: 123, type: "PACKET", id, data, length: encodePlayerData(data).length};
    const inputData = `{
      "correlationId": ${res.correlationId},
      "type": "${res.type}",
      "id": "${res.id}",
      "data": ${encodePlayerData(res.data)},
      "length": ${encodePlayerData(res.data).length}
  }`;

  //execute
  const outputData = await encodePlayerMessage(res);
  const outputDataV2 = await decodePlayerMessage(outputData);

  //test
  expect(outputDataV2).toStrictEqual(res);
  });

  it("Valid PLAYER_JOINED value", async () => {
    //prepare
    const id = uuid();
    const data = { xInput: 0, yInput: 0, name: "test"};
    const res = {correlationId: 123, type: "PLAYER_JOINED", id, data, length: encodePlayerData(data).length};

  //execute
  const outputData = await encodePlayerMessage(res);
  const outputDataV2 = await decodePlayerMessage(outputData);

  //test
  expect(outputDataV2).toStrictEqual(res);
  });

  it("Valid PLAYER_LEFT value", async () => {
    //prepare
    const id = uuid();
    const data = { xInput: 0, yInput: 0, name: "test"};
    const res = {correlationId: 123, type: "PLAYER_LEFT", id, data, length: encodePlayerData(data).length};

  //execute
  const outputData = await encodePlayerMessage(res);
  const outputDataV2 = await decodePlayerMessage(outputData);

  //test
  expect(outputDataV2).toStrictEqual(res);
  });
});