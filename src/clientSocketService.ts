import { Server, Namespace } from "socket.io";
import BusRepository from "./busRepository";

export default class ClientSocketService {
    static eventNames = {
        BUSES_DATA: 'busesData',
        BUS_CONNECTION: 'busConnected',
        BUS_DISCONNECTION: 'busDisconnected',
        BUS_LOCATION_UPDATE: 'busLocationUpdated'
    };
    private readonly socketNamespace: Namespace;

    constructor(
        socketServer: Server,
        private readonly busRepository: BusRepository
    ) {
        this.socketNamespace = socketServer.of('/client');
        this.setupSocketEvents();
    }

    private setupSocketEvents() {
        this.socketNamespace.on('connection', (socket) => {
            console.log("Client connected");
            this.emit(ClientSocketService.eventNames.BUSES_DATA, this.busRepository.getAllBuses());
        });
    }

    public emit(eventName: string, data) {
        this.socketNamespace.emit(eventName, data);
    }
}