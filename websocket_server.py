from flask import Flask 
from flask_socketio import SocketIO, emit


app = Flask(__name__)

socketio=SocketIO(app,
cors_allowed_origins="*")


#HTTP ROUTE FUNCTIONS


def home():
    return {
    "status": "Websocket Server is running"
    }

#register routes manually

app.add_url_rule("/",view_func=home)


#Websocket Events 


def handle_connect():
    print("Client connected")


    emit(
        "server_message",
        {
            "message": "connected successfully!"
        }
    ) 

def handle_disconnect():
    print("Client disconnected")

def handle_chat(data):
    print("recieved: ", data)        
    emit(
        "chat_message",
        data,
        broadcast=True  
    )

#register websocket events manually

socketio.on_event("connect", handle_connect)
socketio.on_event("disconnect", handle_disconnect)
socketio.on_event("chat", handle_chat)


#start the server

if __name__ == "__main__":
    socketio.run(app,host="0.0.0.0",port=5001,debug=True)