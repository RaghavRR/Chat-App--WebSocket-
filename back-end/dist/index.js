"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const wss = new ws_1.WebSocketServer({ port: 8080 });
let allSockets = [];
wss.on("connection", (socket) => {
    console.log("User Connected");
    //postman se msg bhej rha hu server pr..
    socket.on("message", (message) => {
        const parsedMessage = JSON.parse(message); //Convert string to json
        if (parsedMessage.type === "join") {
            allSockets.push({
                socket,
                room: parsedMessage.payload.roomId
            });
        }
        if (parsedMessage.type === "chat") {
            //const cuurentUserRoom = allSockets.find((x)=>x.socket == socket)
            let curentUserRoom = null;
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].socket == socket) {
                    curentUserRoom = allSockets[i].room;
                }
            }
            for (let i = 0; i < allSockets.length; i++) {
                if (allSockets[i].room == curentUserRoom) {
                    allSockets[i].socket.send(JSON.stringify({
                        type: "chat",
                        payload: {
                            message: parsedMessage.payload.message
                        }
                    }));
                }
            }
        }
    });
    //if people leave..
    // socket.on("disconnect", ()=>{
    //     allSockets = allSockets.filter(x => x != socket)
    // })
});
