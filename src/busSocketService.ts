import { Server, Socket, Namespace } from "socket.io";
import ClientSocketService from "./clientSocketService";
import { v4 as uuidv4 } from 'uuid';
import BusRepository from "./busRepository";

export default class BusSocketService {
    private readonly socketNamespace: Namespace;

    constructor(
        socketServer: Server,
        private readonly clientSocketService: ClientSocketService,
        private busService: BusRepository,
    ) {
        this.socketNamespace = socketServer.of('/bus');
        this.setupSocketEvents();
    }

    setupSocketEvents() {
        this.socketNamespace.on("connection", this.connectionCallback.bind(this));
    }

    connectionCallback(socket: Socket) {
        const 
            socketHandshake = socket.handshake,
            busName: string = socketHandshake.query.name,
            busId: string = uuidv4();
        
        console.log('A new bus connected!');
        const busData = this.busService.addBus(busId, busName);
        console.log(this.busService.getAllBuses());

        this.clientSocketService.emit(ClientSocketService.eventNames.BUS_CONNECTION, busData);

        socket.on('newBusLocation', (data) => {
            console.log(`Bus ${busId} updated its location.`);
            this.busService.setBusLocation(busId, data);
            this.clientSocketService.emit(ClientSocketService.eventNames.BUS_LOCATION_UPDATE, {busId, location: data});
        });

        socket.on('disconnect', () => {
            console.log('Bus Disconnected');
            this.busService.removeBus(busId);
            this.clientSocketService.emit(ClientSocketService.eventNames.BUS_DISCONNECTION, {busId});
        });
    }

    
}