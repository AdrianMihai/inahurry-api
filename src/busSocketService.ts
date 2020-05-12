import { Server, Socket, Namespace } from "socket.io";
import { setTimeout } from "timers";
import ClientSocketService from "./clientSocketService";
import { v4 as uuidv4 } from 'uuid';

export default class BusSocketService {
    private readonly socketNamespace: Namespace;
    private readonly buses: any = {};

    constructor(
        socketServer: Server,
        private readonly clientSocketService: ClientSocketService,
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
        const busData = this.addBus(busId, busName);
        console.log(this.buses);

        this.clientSocketService.emit(ClientSocketService.eventNames.BUS_CONNECTION, busData);

        socket.on('newBusLocation', (data) => {
            console.log(`Bus ${busId} updated its location.`);
            this.setBusLocation(busId, data);
            this.clientSocketService.emit(ClientSocketService.eventNames.BUS_LOCATION_UPDATE, {busId, location: data});
        });

        socket.on('disconnect', () => {
            console.log('Bus Disconnected');
            this.removeBus(busId);
            this.clientSocketService.emit(ClientSocketService.eventNames.BUS_DISCONNECTION, {busId});
        });
    }

    private addBus(busId: string, busName: string) {
        const busData: any = {name: busName, location: null};
        this.buses[busId] = busData;
        
        busData.id = busId;
        return busData;
    }

    private setBusLocation(busId: string, currentLocation: any) {
        this.buses[busId].location = currentLocation;
    }

    private removeBus(busId: string) {
        delete this.buses[busId];
    }
}