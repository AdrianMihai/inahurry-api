
export default class BusRepository {
    private readonly buses: any = {};

    public getAllBuses() {
        return this.buses;
    } 

    public addBus(busId: string, busName: string) {
        const busData: any = {name: busName, location: null};
        this.buses[busId] = busData;
        
        busData.id = busId;
        return busData;
    }

    public getBusById(busId: string) {
        return this.buses[busId];
    }

    public setBusLocation(busId: string, currentLocation: any) {
        this.buses[busId].location = currentLocation;
    }

    public removeBus(busId: string) {
        delete this.buses[busId];
    }

    
}