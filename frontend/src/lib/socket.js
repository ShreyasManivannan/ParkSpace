import { io } from 'socket.io-client';

let socket = null;

export const getSocket = () => {
    if (!socket) {
        socket = io(import.meta.env.VITE_API_URL || 'http://localhost:3001', {
            autoConnect: true,
        });
    }
    return socket;
};

export const joinSpaceRoom = (spaceId) => {
    const s = getSocket();
    s.emit('join-space', spaceId);
};

export const leaveSpaceRoom = (spaceId) => {
    const s = getSocket();
    s.emit('leave-space', spaceId);
};
