import { Server, Namespace } from "socket.io";

export default class ClientSocketService {
    static eventNames = {
        BUS_CONNECTION: 'busConnected',
        BUS_DISCONNECTION: 'busDisconnected',
        BUS_LOCATION_UPDATE: 'busLocationUpdated'
    };
    private readonly socketNamespace: Namespace;

    constructor(socketServer: Server) {
        this.socketNamespace = socketServer.of('/client');
        this.setupSocketEvents();
    }

    private setupSocketEvents() {
        this.socketNamespace.on('connection', (socket) => {
            console.log("Client connected");
        });
    }

    public emit(eventName: string, data) {
        this.socketNamespace.emit(eventName, data);
    }
}