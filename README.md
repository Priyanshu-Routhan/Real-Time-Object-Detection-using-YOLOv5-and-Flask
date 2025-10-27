# Real-Time-Object-Detection-using-YOLOv5-and-Flask

Overview

This project demonstrates a real-time object detection system built using YOLO (You Only Look Once) and Flask.
It can detect objects in both uploaded images and live webcam streams through a web interface.
The model uses OpenCV’s DNN module to load a pre-trained YOLO ONNX model (best.onnx) and make predictions efficiently on CPU.
This project serves as a great base for deploying deep learning models with Flask and integrating them into web applications.

Features

🎥 Real-Time Webcam Detection (streamed via Flask)
🖼️ Image Upload Detection with instant response
⚡ Lightweight and fast inference using OpenCV DNN
🌐 Flask REST API for easy backend integration
🧩 Supports any custom-trained YOLO model (ONNX format)
🛠️ CORS enabled for front-end frameworks like React/Vite.

🧰 Tech Stack

Backend | Flask (Python)
Deep Learning | YOLO (ONNX model)
Computer Vision | OpenCV
Configuration | PyYAML
Frontend (Optional) | React + Vite
Language | Python 3.x
