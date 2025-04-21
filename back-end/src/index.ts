import { WebSocketServer, WebSocket } from "ws";

const wss = new WebSocketServer({port:8080});

interface User {
    socket : WebSocket;
    room : string
}

let allSockets: User[] = [];


wss.on("connection", (socket)=>{

    console.log("User Connected");
    
    //postman se msg bhej rha hu server pr..
    socket.on("message",(message)=>{
        const parsedMessage = JSON.parse(message as unknown as string) //Convert string to json
        if(parsedMessage.type === "join"){
            allSockets.push({
                socket,
                room : parsedMessage.payload.roomId
            })
        }
        
        if(parsedMessage.type === "chat"){
            let curentUserRoom = null;
            for(let i=0; i<allSockets.length; i++){
                if(allSockets[i].socket == socket){
                    curentUserRoom = allSockets[i].room
                }
            }

            for(let i=0; i<allSockets.length; i++){
                if(allSockets[i].room == curentUserRoom){
                    allSockets[i].socket.send(parsedMessage.payload.message)
                }
            }
        }   
    })

    //if people leave..
    // socket.on("disconnect", ()=>{
    //     allSockets = allSockets.filter(x => x != socket)
    // })
})



