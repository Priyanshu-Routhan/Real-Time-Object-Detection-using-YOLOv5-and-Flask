from flask import Flask, request, jsonify, Response
from flask_cors import CORS
import cv2
import numpy as np
import threading
import queue
import time
from yolo_predictions import YOLO_Pred

app = Flask(__name__)
CORS(app)

# Load YOLO model (consider using a small/fast model like YOLOv5s or YOLOv8n)
yolo = YOLO_Pred('./Model/weights/best.onnx', 'data.yaml')

# Health check endpoint
@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'OK'}), 200

# Image upload endpoint (unchanged)
@app.route('/detect-image', methods=['POST'])
def detect_image():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    npimg = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    if img is None:
        return jsonify({'error': 'Invalid image format'}), 400

    detected_img = yolo.predictions(img)
    _, img_encoded = cv2.imencode('.jpg', detected_img)
    return Response(img_encoded.tobytes(), mimetype='image/jpeg')

# Globals for webcam streaming
frame_queue = queue.Queue(maxsize=10)  # queue maxsize to limit memory use
stop_event = threading.Event()
webcam_thread = None

def webcam_capture():
    cap = cv2.VideoCapture(0, cv2.CAP_DSHOW)
    if not cap.isOpened():
        print("❌ Webcam not available.")
        return

    # Target FPS limit
    fps_limit = 30
    fps_delay = 1.0 / fps_limit

    while not stop_event.is_set():
        start_time = time.time()

        success, frame = cap.read()
        if not success:
            continue

        # Resize to 640x480 or whatever your model expects (adjust as needed)
        frame_resized = cv2.resize(frame, (640, 480))

        # Run YOLO prediction
        pred_image = yolo.predictions(frame_resized)

        # Encode to JPEG
        _, buffer = cv2.imencode('.jpg', pred_image)
        frame_bytes = buffer.tobytes()

        # Put frame in queue, drop if full to keep latest frames only (avoid lag)
        if not frame_queue.full():
            frame_queue.put(frame_bytes)

        # Frame rate control
        elapsed = time.time() - start_time
        sleep_time = fps_delay - elapsed
        if sleep_time > 0:
            time.sleep(sleep_time)

    cap.release()
    print("🛑 Webcam thread stopped.")

def generate_frames():
    while not stop_event.is_set():
        try:
            frame_bytes = frame_queue.get(timeout=1)
            yield (b'--frame\r\n' b'Content-Type: image/jpeg\r\n\r\n' + frame_bytes + b'\r\n')
        except queue.Empty:
            continue

@app.route('/detect-webcam', methods=['GET'])
def detect_webcam():
    global webcam_thread
    if webcam_thread is None or not webcam_thread.is_alive():
        stop_event.clear()
        webcam_thread = threading.Thread(target=webcam_capture, daemon=True)
        webcam_thread.start()
    return Response(generate_frames(), mimetype='multipart/x-mixed-replace; boundary=frame')

@app.route('/shutdown-webcam', methods=['POST'])
def shutdown_webcam():
    global webcam_thread
    stop_event.set()
    webcam_thread = None
    return jsonify({'message': 'Webcam streaming stopped'}), 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)

