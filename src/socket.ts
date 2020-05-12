import * as socketIo from 'socket.io';

export const createSocketServer = (httpServer) : socketIo.Server => socketIo(httpServer);