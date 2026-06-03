TIPS = {'index': 8, 'middle': 12, 'ring': 16, 'pinky': 20}
PIPS = {'index': 6, 'middle': 10, 'ring': 14, 'pinky': 18}


def open_fingers(landmarks):
    state = {}
    for name in TIPS:
        tip = landmarks.landmark[TIPS[name]]
        pip = landmarks.landmark[PIPS[name]]
        state[name] = tip.y < pip.y
    return state


def hand_state(landmarks):
    fingers = open_fingers(landmarks)
    count = sum(1 for value in fingers.values() if value)
    if count >= 3:
        return 'open'
    if count <= 1:
        return 'closed'
    return 'mid'


class SpaceDetector:
    def __init__(self, window=30, lockout=15):
        self.window = window
        self.lockout = lockout
        self.frame = 0
        self.previous = 'open'
        self.closes = []
        self.lock = 0

    def update(self, landmarks):
        self.frame += 1
        if self.lock > 0:
            self.lock -= 1

        state = hand_state(landmarks)
        detected = False
        if state == 'closed' and self.previous == 'open':
            self.closes.append(self.frame)
            self.closes = [f for f in self.closes if self.frame - f <= self.window]
            if len(self.closes) >= 2:
                detected = True
                self.closes = []
                self.lock = self.lockout
        if state != 'mid':
            self.previous = state
        return detected

    def locked(self):
        return self.lock > 0


class MotionTracker:
    def __init__(self, buffer_size=12, move_threshold=0.12):
        self.buffer_size = buffer_size
        self.move_threshold = move_threshold
        self.path = []

    def detect(self, landmarks):
        xs = [point.x for point in landmarks.landmark]
        ys = [point.y for point in landmarks.landmark]
        self.path.append((sum(xs) / len(xs), sum(ys) / len(ys)))
        if len(self.path) > self.buffer_size:
            self.path.pop(0)
        if len(self.path) < self.buffer_size:
            return None

        moved = (max(p[0] for p in self.path) - min(p[0] for p in self.path)) + \
                (max(p[1] for p in self.path) - min(p[1] for p in self.path))
        if moved < self.move_threshold:
            return None

        fingers = open_fingers(landmarks)
        if fingers['pinky'] and not fingers['index'] and not fingers['middle'] and not fingers['ring']:
            return 'J'
        if fingers['index'] and not fingers['middle'] and not fingers['ring'] and not fingers['pinky']:
            return 'Z'
        return None
