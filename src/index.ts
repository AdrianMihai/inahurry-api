import * as fastify from 'fastify';
import { createSocketServer } from './socket';
import { Server } from 'socket.io';
import BusSocketService from './busSocketService';
import ClientSocketService from './clientSocketService';

const server: fastify.FastifyInstance = fastify({logger: true});

server.get('/', {}, async () => {
    return "hello";
});

const 
    socketServer: Server = createSocketServer(server.server),
    clientSocketService: ClientSocketService = new ClientSocketService(socketServer),
    busSocketService: BusSocketService = new BusSocketService(socketServer, clientSocketService);

const env = process.env.NODE_ENV || 'development',
    port = process.env.PORT || 3000;
    
const startServer = async () => {
    let options: any = {port: port};

    if (env === 'development') {
        options.host = '0.0.0.0'
    }

    try {
        await server.listen(options);
    } catch (e) {
        server.log.error(e.message)
    }
};

startServer()