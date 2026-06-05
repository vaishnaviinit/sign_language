"use client";
import {useEffect,useState} from "react";
import {io, Socket} from "socket.io-client";

let socket: Socket;

export default function WebSocketTestPage() {

    const [username, setUsername] = useState("");
    const [room, setRoom] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<any[]>([]);
    const [predictions, setPredictions] = useState<any[]>([]);



    useEffect(() => {
        socket = io("https://shoptalk-prototype-proving.ngrok-free.dev");

        socket.on("connect", () => {
            console.log("Connected",socket.id);
        });

        socket.on("server_message", (data) => {
         console.log("server:", data);
        } );

        socket.on("system_message", (data) => {
         console.log("System:", data);
        } );
        
        socket.on("receive_message", (data) => {
         console.log("Message:", data);

         setMessages((prev) => [
           ...prev,
               data
             ]);

        });

        socket.on("receive_prediction", (data) => {

         console.log(
           "Prediction:",
              data
        );

        setPredictions((prev) => [
          ...prev,
          data
          ]);

       });




        return () => {
            socket.disconnect();
        };

    }, []);




const joinRoom = () => {

    if (!username || !room) {
      alert("Enter username and room");
      return;
    }

    socket.emit(
      "join_room",
      {
        username,
        room
      }
    );

    console.log(
      `${username} joined ${room}`
    );
  };
  

const sendMessage = () => {

    if (!message) {
    return;
  }

  socket.emit(
    "send_message",
    {
      username,
      room,
      message
    }
  );

  setMessage("");
};

const sendPrediction = () => {

  socket.emit(
    "prediction_message",
    {
      username,
      room,
      prediction: "HELLO"
    }
  );

};



  return (
    <div style={{ padding: "20px" }}>

      <h1>WebSocket Test Page</h1>

      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) =>
          setUsername(e.target.value)
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Room"
        value={room}
        onChange={(e) =>
          setRoom(e.target.value)
        }
      />

      <br />
      <br />

      <button onClick={joinRoom}>
        Join Room
      </button>

      <hr />

     <h2>Messages</h2>

    {
          messages.map((msg, index) => (
             <div key={index}>
             <strong>
             {msg.username}
             </strong>
             : {msg.message}
             </div>
            ))
            }
            
   <h2>Predictions</h2>

    {
         predictions.map((pred, index) => (
           <div key={index}>
           <strong>
           {pred.username}
           </strong>
         : {pred.prediction}
         </div>
         ))
          }


      <br />
      <br />

      <input
        type="text"
        placeholder="Message"
        value={message}
        onChange={(e) =>
           setMessage(e.target.value)
  }
/>

<button onClick={sendMessage}>
  Send
</button>

<button onClick={sendPrediction}>
  Send Fake Prediction
</button>





    </div>
  );
}









    