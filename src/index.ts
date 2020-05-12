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

const startServer = async () => {
    try {
        await server.listen({ port: 3000, host: '0.0.0.0'})
    } catch (e) {
        server.log.error(e.message)
    }
};

startServer()