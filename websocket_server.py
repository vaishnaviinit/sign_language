from flask import Flask,request 
from flask_socketio import (SocketIO, emit,join_room,leave_room )


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



def handle_join_room(data):
    username=data["username"]
    room=data["room"]
    join_room(room)
   
    print(f"{username} joined {room}")

    emit(
        "system_message",
        {
            "message": f"{username} joined the room {room}"
        },
        room=room
    )

def handle_send_message(data):
    username=data["username"]
    room=data["room"]
    message=data["message"]
   
    print(f"[{room}]{username}: {message}")

    emit(
        "receive_message",
        {
            "username": username,
            "message": message
        },
        room=room
    )

def handle_prediction_message(data):

    username = data["username"]
    room = data["room"]
    prediction = data["prediction"]

    print(
        f"[{room}] {username} predicted: {prediction}"
    )

    emit(
        "receive_prediction",
        {
            "username": username,
            "prediction": prediction
        },
        room=room
    )

@app.route("/prediction", methods=["POST"])
def prediction():

    print("ROUTE HIT")

    data = request.json
    print("DATA =", data)

    username = data["username"]
    room = data["room"]
    prediction = data["prediction"]

    print(f"[HTTP] {username} predicted: {prediction}")

    socketio.emit(
        "receive_prediction",
        {
            "username": username,
            "prediction": prediction
        },
        room=room
    )

    print("EMIT SENT")

    return {"success": True}





#register websocket events manually

socketio.on_event("connect", handle_connect)
socketio.on_event("disconnect", handle_disconnect)
socketio.on_event("join_room", handle_join_room)
socketio.on_event("send_message", handle_send_message)
socketio.on_event("prediction_message", handle_prediction_message)



#start the server

if __name__ == "__main__":
    socketio.run(app,host="0.0.0.0",port=5001,debug=True)