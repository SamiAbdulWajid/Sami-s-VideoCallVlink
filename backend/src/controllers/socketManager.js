import { Server } from "socket.io";

let connections = {};
let messages = {};
let timeOnline = {};

export const connectToSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"]
        }
    });

    io.on("connection", (socket) => {
        console.log("SOmething is connected", socket.id);

        // Log every event received by this socket (for debugging)
        socket.onAny((event, ...args) => {
            console.log("Event received:", event, args);
        });

        socket.on("join-call", (path) => {
            if (!connections[path]) {
                connections[path] = [];
            }
            connections[path].push(socket.id);
            timeOnline[socket.id] = new Date();

            // Notify all users in the room about the new user
            for (let a = 0; a < connections[path].length; a++) {
                io.to(connections[path][a]).emit("user-joined", socket.id, connections[path]);
            }

            // Send old messages to the new user
            if (messages[path] !== undefined) {
                for (let a = 0; a < messages[path].length; ++a) {
                    io.to(socket.id).emit(
                        "chat-message",
                        messages[path][a]['data'],
                        messages[path][a]['sender'],
                        messages[path][a]['socket-id-sender']
                    );
                }
            }
        });

        socket.on("signal", (toId, message) => {
            io.to(toId).emit("signal", socket.id, message);
        });

        socket.on("chat-message", (data, sender) => {
            console.log("Received chat-message:", { data, sender, socketId: socket.id });

            // Find the room this socket is in
            const [matchingRoom, found] = Object.entries(connections).reduce(
                ([matchingRoom, isFound], [roomKey, roomValue]) => {
                    if (!isFound && roomValue.includes(socket.id)) {
                        return [roomKey, true];
                    }
                    return [matchingRoom, isFound];
                },
                ['', false]
            );

            if (found === true) {
                if (messages[matchingRoom] === undefined) {
                    messages[matchingRoom] = [];
                }

                messages[matchingRoom].push({
                    'sender': sender,
                    'data': data,
                    "socket-id-sender": socket.id
                });
                console.log("messages", matchingRoom, ":", sender, data);

                // Broadcast the message to all users in the room
                connections[matchingRoom].forEach((element) => {
                    io.to(element).emit("chat-message", data, sender, socket.id);
                });
            }
        });

        socket.on("disconnect", () => {
            // Remove socket from all rooms and clean up
            for (const room in connections) {
                connections[room] = connections[room].filter(id => id !== socket.id);
                // Notify others in the room
                io.to(room).emit("user-left", socket.id, connections[room]);
                // Clean up empty rooms
                if (connections[room].length === 0) {
                    delete connections[room];
                    delete messages[room];
                }
            }
            delete timeOnline[socket.id];
            console.log("Socket disconnected:", socket.id);
        });
    });
};