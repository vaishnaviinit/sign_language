import pickle
import cv2
import mediapipe as mp

MODEL_FILE = 'model.p'

with open(MODEL_FILE, 'rb') as file:
    model = pickle.load(file)

hands = mp.solutions.hands.Hands(static_image_mode=False, max_num_hands=1, min_detection_confidence=0.5)
drawing = mp.solutions.drawing_utils
hand_connections = mp.solutions.hands.HAND_CONNECTIONS


def extract_features(landmarks):
    min_x = min(point.x for point in landmarks.landmark)
    min_y = min(point.y for point in landmarks.landmark)
    features = []
    for point in landmarks.landmark:
        features.append(point.x - min_x)
        features.append(point.y - min_y)
    return features


def main():
    camera = cv2.VideoCapture(0)
    while True:
        ok, frame = camera.read()
        if not ok:
            continue
        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)
        if result.multi_hand_landmarks:
            landmarks = result.multi_hand_landmarks[0]
            drawing.draw_landmarks(frame, landmarks, hand_connections)
            prediction = model.predict([extract_features(landmarks)])[0]
            probability = max(model.predict_proba([extract_features(landmarks)])[0])
            text = str(prediction) + '  ' + str(round(probability * 100)) + '%'
            cv2.putText(frame, text, (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 200, 0), 3)
        cv2.imshow('SignBridge Test', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    camera.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()
