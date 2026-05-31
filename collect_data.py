import os
import csv
import cv2
import mediapipe as mp

LABELS = ['A', 'B', 'C', 'D', 'L', 'O', 'V', 'W', 'Y']
SAMPLES_PER_LABEL = 200
DATA_FILE = 'data.csv'

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


def write_header(writer):
    header = ['label']
    for i in range(21):
        header.append('x' + str(i))
        header.append('y' + str(i))
    writer.writerow(header)


def main():
    camera = cv2.VideoCapture(0)
    file_exists = os.path.exists(DATA_FILE)
    output = open(DATA_FILE, 'a', newline='')
    writer = csv.writer(output)
    if not file_exists:
        write_header(writer)

    for label in LABELS:
        while True:
            ok, frame = camera.read()
            if not ok:
                continue
            frame = cv2.flip(frame, 1)
            cv2.putText(frame, 'Show sign ' + label + '  -  press S to start', (20, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            cv2.imshow('Collecting', frame)
            if cv2.waitKey(1) & 0xFF == ord('s'):
                break

        collected = 0
        while collected < SAMPLES_PER_LABEL:
            ok, frame = camera.read()
            if not ok:
                continue
            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = hands.process(rgb)
            if result.multi_hand_landmarks:
                landmarks = result.multi_hand_landmarks[0]
                drawing.draw_landmarks(frame, landmarks, hand_connections)
                writer.writerow([label] + extract_features(landmarks))
                collected += 1
            cv2.putText(frame, label + ': ' + str(collected) + '/' + str(SAMPLES_PER_LABEL), (20, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            cv2.imshow('Collecting', frame)
            cv2.waitKey(1)

    output.close()
    camera.release()
    cv2.destroyAllWindows()
    print('Saved data to ' + DATA_FILE)


if __name__ == '__main__':
    main()
