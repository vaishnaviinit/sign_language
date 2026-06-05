import pickle
import cv2
import mediapipe as mp
from gesture import MotionTracker

MODEL_FILE = 'model.p'

with open(MODEL_FILE, 'rb') as file:
    model = pickle.load(file)

hands = mp.solutions.hands.Hands(static_image_mode=False, max_num_hands=2, min_detection_confidence=0.5)
drawing = mp.solutions.drawing_utils
hand_connections = mp.solutions.hands.HAND_CONNECTIONS


def extract_features(hand_landmarks):
    groups = [[(point.x, point.y) for point in h.landmark] for h in hand_landmarks]
    groups.sort(key=lambda points: sum(x for x, y in points) / len(points))
    all_x = [x for points in groups for x, y in points]
    all_y = [y for points in groups for x, y in points]
    min_x = min(all_x)
    min_y = min(all_y)
    size = max(max(all_x) - min_x, max(all_y) - min_y)
    if size == 0:
        size = 1
    features = []
    for points in groups:
        for x, y in points:
            features.append((x - min_x) / size)
            features.append((y - min_y) / size)
    while len(features) < 84:
        features.append(0.0)
    return features


def main():
    camera = cv2.VideoCapture(0)
    tracker = MotionTracker()
    while True:
        ok, frame = camera.read()
        if not ok:
            continue
        frame = cv2.flip(frame, 1)
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        result = hands.process(rgb)
        if result.multi_hand_landmarks:
            landmarks = result.multi_hand_landmarks[0]
            for hand in result.multi_hand_landmarks:
                drawing.draw_landmarks(frame, hand, hand_connections)
            gesture = tracker.detect(landmarks)
            if gesture:
                text = gesture
            else:
                features = extract_features(result.multi_hand_landmarks)
                prediction = model.predict([features])[0]
                probability = max(model.predict_proba([features])[0])
                text = str(prediction) + '  ' + str(round(probability * 100)) + '%'
            cv2.putText(frame, text, (20, 60), cv2.FONT_HERSHEY_SIMPLEX, 1.5, (0, 200, 0), 3)
        cv2.imshow('SignSync Test', frame)
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break
    camera.release()
    cv2.destroyAllWindows()


if __name__ == '__main__':
    main()
