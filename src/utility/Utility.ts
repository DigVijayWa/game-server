import { Packet, PlayerData } from "../types/Types";
import { match } from "ts-pattern";

export const encodePlayerMessage = (playerMessage: Packet) => {
  return match(playerMessage)
    .with(
      { type: "PACKET" },
      (res) =>
        `{
            "correlationId": ${res.correlationId},
            "type": "${res.type}",
            "id": "${res.id}",
            "data": ${encodePlayerData(res.data)},
            "length": ${encodePlayerData(res.data).length}
        }`
    )
    .with(
      { type: "PLAYER_JOINED" },
      (res) =>
        `{
            "type": "${res.type}",
            "correlationId": ${res.correlationId},
            "id": "${res.id}",
            "length": ${encodePlayerData(res.data).length},
            "data": ${encodePlayerData(res.data)}
        }`
    )
    .with(
      { type: "PLAYER_LEFT" },
      (res) =>
        `{
            "type": "${res.type}",
            "correlationId": ${res.correlationId},
            "id": "${res.id}",
            "length": ${encodePlayerData(res.data).length},
            "data": ${encodePlayerData(res.data)}
        }`
    )
    .otherwise(() => "INVALID");
};

export const encodePlayerData = (playerData: PlayerData) => {
  return `{
      "name": "${playerData.name}",
      "xInput": ${playerData.xInput},
      "yInput": ${playerData.yInput}
    }`;
};

export const decodePlayerMessage = async (message : string) => {

  const parsedJson = await JSON.parse(message);

  const keyList = ["correlationId","type","id","data","length"];

  if(Object.keys(parsedJson).length === 0) {
    await Promise.reject(new Error(`Decoding error occured ${parsedJson}`));
  }

  const errorKeys = keyList.filter(item => !(item in parsedJson));

  if(errorKeys.length > 0) {
    await Promise.reject(new Error(`Decoding error occured ${errorKeys}`));
  }

  return {
    id: parsedJson.id,
    type: parsedJson.type,
    correlationId: parsedJson.correlationId,
    data: parsedJson.data,
    length: encodePlayerData(parsedJson.data).length
  }
};


export const checkEquality = (packetOne: Packet, packetTwo: Packet) => {
  return packetOne.correlationId === packetTwo.correlationId &&
             packetOne.id === packetTwo.id &&
             packetOne.data.name === packetTwo.data.name &&
             packetOne.data.xInput === packetTwo.data.xInput &&
             packetOne.data.yInput === packetTwo.data.yInput &&
             packetOne.length === packetTwo.length;
};
