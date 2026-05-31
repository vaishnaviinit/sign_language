# SignBridge – Real-Time Sign Language to English Translator

## Overview

SignBridge is a web-based application that translates sign language gestures into English text in real time. The system uses a webcam to detect hand gestures, processes them using Computer Vision, and converts them into readable text through a machine learning model.

The goal of this project is to reduce communication barriers between sign language users and people who do not understand sign language by providing a simple, fast, and accessible translation tool.

---

## Problem Statement

Millions of people use sign language as their primary means of communication. However, most people are unable to understand sign language, making everyday interactions difficult.

SignBridge aims to bridge this communication gap by providing a real-time sign language translation system that is easy to use and accessible through a web browser.

---

## Features

### Real-Time Gesture Recognition
- Detects hand gestures using a webcam.
- Tracks 21 hand landmarks in real time.
- Processes live video frames efficiently.

### Sign-to-Text Translation
- Converts recognized gestures into English text.
- Builds letters into words and sentences.
- Displays results instantly on the screen.

### Simple Web Interface
- Easy-to-use website.
- Live camera feed and translated output.
- Speak, space, delete, and clear controls.
- Works directly in a browser.

---

## System Architecture

```text
Webcam
   ↓
OpenCV
   ↓
MediaPipe Hand Detection
   ↓
Landmark Extraction
   ↓
Machine Learning Model
   ↓
Gesture Prediction
   ↓
English Text Output
```

---

## Technology Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Python
- Flask

### Computer Vision
- OpenCV
- MediaPipe

### Machine Learning
- Scikit-Learn
- NumPy

### Deployment
- Render

---

## How It Works

### Step 1: Capture Gesture
The webcam captures live video frames from the user.

### Step 2: Hand Detection
MediaPipe detects the hand and extracts 21 landmark points.

### Step 3: Feature Extraction
The landmark coordinates are shifted relative to the hand position and turned into 42 numerical features.

### Step 4: Prediction
The trained machine learning model predicts the corresponding sign.

### Step 5: Translation
The predicted sign is displayed as English text on the website and can be spoken aloud.

---

## Project Structure

```text
sign lang/
│
├── app.py
├── collect_data.py
├── train_model.py
├── requirements.txt
│
├── templates/
│   └── index.html
│
└── static/
    ├── style.css
    └── script.js
```

---

## Setup

### 1. Install dependencies
```bash
pip install -r requirements.txt
```

### 2. Collect gesture data
```bash
python collect_data.py
```
A camera window opens. For each sign, press `S` to start and hold the sign while samples are recorded. This creates `data.csv`.

### 3. Train the model
```bash
python train_model.py
```
This trains the classifier, prints the accuracy, and creates `model.p`.

### 4. Run the web app
```bash
python app.py
```
Open `http://127.0.0.1:5000` in a browser to use the translator.

---

## Configuration

The signs to recognize are defined in `collect_data.py`:

```python
LABELS = ['A', 'B', 'C', 'D', 'L', 'O', 'V', 'W', 'Y']
SAMPLES_PER_LABEL = 200
```

Edit this list to add or remove signs, then collect data and retrain.

---

## License

This project is developed for educational and accessibility purposes.

MIT License © 2026 SignBridge Team
