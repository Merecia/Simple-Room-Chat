from flask import Flask, request, jsonify, abort
from flask_socketio import join_room, leave_room, SocketIO
from flask_cors import CORS

app = Flask(__name__)

CORS(app, supports_credentials=True)
app.config.from_object(__name__)
socketio = SocketIO(app, cors_allowed_origins= '*')

rooms = {}

@app.route("/create-room", methods=["POST"])
def create_room():
    body = request.json
    user_name = body['userName']
    room_name = body['roomName']

    if not user_name or not room_name:
        abort(400, 'Invalid data')

    if room_name not in rooms:
        rooms[room_name] = {
            "members": 0,
            "messages": []
        }

    return jsonify(rooms)

@app.route('/messages/<room_name>', methods = ["GET"])
def get_messages_in_room(room_name):
    if room_name in rooms:
        messages = rooms[room_name]['messages']
        return jsonify(messages=messages)

    return jsonify('Room not in rooms')

@socketio.on("chat")
def chat(room_name, user_name, text):
    if room_name not in rooms:
        return
    
    send_message(user_name, text, room_name)
    
    print(f"{user_name} said: {text}")

@socketio.on("connect")
def connect(auth):
    room_name = request.args.get('roomName')
    user_name = request.args.get('userName')

    join_room(room_name)
    send_message(user_name, "has entered the room", room_name)

    if room_name in rooms:
        rooms[room_name]["members"] += 1
        
    print(f"{user_name} joined room {room_name}")

@socketio.on('leave-room')
def leave(room_name, user_name):
    if room_name not in rooms:
        return
    
    send_message(user_name, "has left the room", room_name)
    leave_room(room_name)

    rooms[room_name]["members"] -= 1
    if rooms[room_name]["members"] == 0:
        del rooms[room_name]
    
    print(f"{user_name} has disconnected from room {room_name}")

def send_message(user_name, text, room_name):
    message = {"name": user_name, "text": text}
    socketio.emit("chat", message, to=room_name)
    rooms[room_name]["messages"].append(message)

if __name__ == "__main__":
    socketio.run(app)