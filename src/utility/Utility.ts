import { Packet, PlayerData } from "../types/Types";
import { match, select } from 'ts-pattern';

export const playerMessageToString = (playerMessage: Packet) => {
    return match(playerMessage)
    .with({type: 'PACKET'}, (res) => `{"id": ${res.id}, "data": ${playerDataToString(res.data)}, "length": ${playerDataToString(res.data).length}}`)
    .with({type: 'PLAYER_JOINED'}, (res) => `{"correlationId": ${res.correlationId}, "joinedPlayer": "${res.id}", "length": ${res.id.length}}, "data": ${playerDataToString(res.data)}`)
    .with({type: 'PLAYER_LEFT'}, (res) => `{"correlationId": ${res.correlationId}, leftPlayer: "${res.id}", "length": ${res.id.length}}, "data": ${playerDataToString(res.data)}`)
    .otherwise(() => 'INVALID');
}


export const playerDataToString = (playerData: PlayerData) => {
    return `{ "xPosition": ${playerData.xPosition}, "yPosition": ${playerData.yPosition}}`
}

export const getDataFromMessage = async (data: string) => {
   const parsedJson = await JSON.parse(data);
   return parsedJson;
}