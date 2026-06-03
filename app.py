import pickle
import cv2
import mediapipe as mp
from flask import Flask, render_template, Response, jsonify
from flask_cors import CORS
from gesture import MotionTracker, SpaceDetector
import store

app = Flask(__name__)
CORS(
    app,
    origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5173",
        "http://127.0.0.1:5173"
    ]
)

with open('model.p', 'rb') as file:
    model = pickle.load(file)

hands = mp.solutions.hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5)
drawing = mp.solutions.drawing_utils
hand_connections = mp.solutions.hands.HAND_CONNECTIONS

camera = cv2.VideoCapture(0)
tracker = MotionTracker()
spacer = SpaceDetector()
current_prediction = ''
STABLE_FRAMES = 10


def extract_features(landmarks):
    xs = [point.x for point in landmarks.landmark]
    ys = [point.y for point in landmarks.landmark]
    min_x = min(xs)
    min_y = min(ys)
    size = max(max(xs) - min_x, max(ys) - min_y)
    if size == 0:
        size = 1
    features = []
    for point in landmarks.landmark:
        features.append((point.x - min_x) / size)
        features.append((point.y - min_y) / size)
    return features


def generate_frames():
    global current_prediction
    stable_letter = ''
    stable_count = 0
    stored = False
    while True:
        ok, frame = camera.read()
        if not ok:
            break
        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)
        if result.multi_hand_landmarks:
            landmarks = result.multi_hand_landmarks[0]
            drawing.draw_landmarks(frame, landmarks, hand_connections)
            if spacer.update(landmarks):
                store.add_sign(' ')
                current_prediction = 'SPACE'
                stable_letter = ''
                stable_count = 0
                stored = False
            else:
                gesture = tracker.detect(landmarks)
                if gesture:
                    current_prediction = gesture
                else:
                    current_prediction = str(model.predict([extract_features(landmarks)])[0])
                if current_prediction == stable_letter:
                    stable_count += 1
                else:
                    stable_letter = current_prediction
                    stable_count = 0
                    stored = False
                if stable_count == STABLE_FRAMES and not stored and not spacer.locked():
                    store.add_sign(current_prediction)
                    stored = True
            cv2.putText(frame, current_prediction, (20, 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 200, 0), 3)
        else:
            current_prediction = ''
            stable_letter = ''
            stable_count = 0
            stored = False
        ok, buffer = cv2.imencode('.jpg', frame)
        yield (b'--frame\r\nContent-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')


@app.route('/')
def index():
    return jsonify({
        "status": "Backend running",
        "message": "SignBridge API is active"
    })


@app.route('/video_feed')
def video_feed():
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')


@app.route('/prediction')
def prediction():
    return jsonify({'letter': current_prediction})


@app.route('/history')
def history():
    return jsonify({'signs': store.load_history()})


@app.route('/clear', methods=['POST'])
def clear():
    return jsonify({'signs': store.clear_history()})


if __name__ == '__main__':
    app.run(debug=True, threaded=True, use_reloader=False)
