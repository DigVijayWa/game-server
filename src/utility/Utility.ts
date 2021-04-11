import { PlayerMessage } from "../types/Types";
import { match, select } from 'ts-pattern';

export const playerMessageToString = (playerMessage: PlayerMessage) => {
    return match(playerMessage)
    .with({type: 'PACKET'}, (res) => `{"id": ${res.id}, "data": "${res.data}", "length": ${res.data.length}}`)
    .with({type: 'PLAYER_JOINED'}, (res) => `{"id": ${res.id}, "joinedPlayer": "${res.joinedPlayer}", "length": ${res.joinedPlayer.length}}`)
    .with({type: 'PLAYER_LEFT'}, (res) => `{"id": ${res.id}, leftPlayer: "${res.leftPlayer}", "length": ${res.leftPlayer.length}}`)
    .exhaustive();
}