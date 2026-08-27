let io;

export const initializeSocket = (socketIO) => {
    io = socketIO;
};

export const getIO = () => {
    if (!io) {
        throw new Error("Socket.IO has not been initialized");
    }

    return io;
};