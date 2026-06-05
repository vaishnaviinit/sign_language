import os
import csv
import cv2
import mediapipe as mp

LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y',
          'how are you', 'i need help', 'please', 'thirsty', 'sick', 'understand',
          'good morning', 'happy birthday', 'where', 'again', 'wait', 'meet']
SAMPLES_PER_LABEL = 200
DATA_FILE = 'data.csv'

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


def get_collected_counts():
    counts = {}
    if not os.path.exists(DATA_FILE):
        return counts
    with open(DATA_FILE, 'r') as f:
        reader = csv.reader(f)
        next(reader, None)
        for row in reader:
            if len(row) == 85:
                label = row[0]
                counts[label] = counts.get(label, 0) + 1
    return counts


def write_header():
    with open(DATA_FILE, 'w', newline='') as f:
        writer = csv.writer(f)
        header = ['label']
        for i in range(84):
            header.append('f' + str(i))
        writer.writerow(header)


def main():
    if not os.path.exists(DATA_FILE):
        write_header()

    counts = get_collected_counts()
    camera = cv2.VideoCapture(0)

    for label in LABELS:
        already = counts.get(label, 0)
        if already >= SAMPLES_PER_LABEL:
            print('Skipping ' + label + ' already have ' + str(already) + ' samples')
            continue

        while True:
            ok, frame = camera.read()
            if not ok:
                continue
            frame = cv2.flip(frame, 1)
            cv2.putText(frame, 'Show ' + label + '  -  press S to start', (20, 40),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2)
            cv2.imshow('Collecting', frame)
            if cv2.waitKey(1) & 0xFF == ord('s'):
                break

        collected = already
        output = open(DATA_FILE, 'a', newline='')
        writer = csv.writer(output)

        while collected < SAMPLES_PER_LABEL:
            ok, frame = camera.read()
            if not ok:
                continue
            frame = cv2.flip(frame, 1)
            rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            result = hands.process(rgb)
            if result.multi_hand_landmarks:
                features = extract_features(result.multi_hand_landmarks)
                if len(features) == 84:
                    for landmarks in result.multi_hand_landmarks:
                        drawing.draw_landmarks(frame, landmarks, hand_connections)
                    writer.writerow([label] + features)
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
