import { decodePlayerMessage, encodePlayerData } from "../../src/utility/Utility";


describe("🔥 Test should return Decoded Value", () => {

  it("Valid PACKET value", async () => {
    //prepare
    const res = {correlationId: 123, type: "PACKET", id: "123456", data: { xInput: 0, yInput: 0, name: "test"}, length: 37};
    const inputData = `{
      "correlationId": ${res.correlationId},
      "type": "${res.type}",
      "id": "${res.id}",
      "data": ${encodePlayerData(res.data)},
      "length": ${encodePlayerData(res.data).length}
  }`;

  //execute
  const outputData = await decodePlayerMessage(inputData);

  //test
  expect(outputData).toStrictEqual(res);
  });

  it("Valid PLAYER_JOINED value", async () => {
    //prepare
    const res = {correlationId: 123, type: "PLAYER_JOINED", id: "123456", data: { xInput: 0, yInput: 0, name: "test"}, length: 37};
    const inputData = `{
      "correlationId": ${res.correlationId},
      "type": "${res.type}",
      "id": "${res.id}",
      "data": ${encodePlayerData(res.data)},
      "length": ${encodePlayerData(res.data).length}
  }`;

  //execute
  const outputData = await decodePlayerMessage(inputData);

  //test
  expect(outputData).toStrictEqual(res);
  });

  it("Valid PLAYER_LEFT value", async () => {
    //prepare
    const res = {correlationId: 123, type: "PLAYER_LEFT", id: "123456", data: { xInput: 0, yInput: 0, name: "test"}, length: 37};
    const inputData = `{
      "correlationId": ${res.correlationId},
      "type": "${res.type}",
      "id": "${res.id}",
      "data": ${encodePlayerData(res.data)},
      "length": ${encodePlayerData(res.data).length}
  }`;

  //execute
  const outputData = await decodePlayerMessage(inputData);

  //test
  expect(outputData).toStrictEqual(res);
  });
});