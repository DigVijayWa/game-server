import { ConnectedClients } from "../types/Types";

export class ConnectedClientList {
  connectedClients: ConnectedClients[];

  constructor(connectedClients: ConnectedClients[]) {
    this.connectedClients = connectedClients;
  }

  addConnectedClients(connectedClient: ConnectedClients) {
    if (this.checkIfExists(connectedClient.id)) {
      return false;
    } else {
      this.connectedClients.push(connectedClient);
      return true;
    }
  }

  removeConnectedClientsById(connectedClientId: string) {
    if (this.checkIfExists(connectedClientId)) {
      const index = this.connectedClients.findIndex(
        (item) => item.id === connectedClientId
      );
      this.connectedClients.splice(index, 1);
      return true;
    }
    return false;
  }

  removeConnectedClient(connectedClient: ConnectedClients) {
    if (this.checkIfExists(connectedClient.id)) {
      const index = this.connectedClients.findIndex(
        (item) => item.id === connectedClient.id
      );
      this.connectedClients.splice(index, 1);
      return true;
    }

    return false;
  }

  checkIfExists(
    connectedClientId: string
  ) {
    const findClient = this.connectedClients.filter(
      (item) => item.id === connectedClientId
    );
    return findClient.length > 0 ? true : false;
  }

  setConnectedClientList(
      connectedClients: ConnectedClients[]
  ) {
    this.connectedClients = connectedClients
  }

}
