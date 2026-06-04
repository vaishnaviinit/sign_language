"use client";
import {useEffect} from "react";
import {io} from "socket.io-client";


export default function WebsocketTestPage() {

    useEffect(() => {
        const socket = io("http://localhost:5001");

        socket.on("connect", () => {
            console.log("Connected",socket.id);
        });

        socket.on("server_message", (data) => {
            console.log("server:", data);
        } );

        return () => {
            socket.disconnect();
        };

    }, []);


    return(
        <div>
            <h1>Websocket Test Page</h1>
        </div>
    );

}

