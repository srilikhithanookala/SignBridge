from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import math

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://signbridge-zdyd.onrender.com",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class Landmark(BaseModel):
    x: float
    y: float
    z: float

class TranslationRequest(BaseModel):
    landmarks: List[Landmark]
    sign_id: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Sign Bridge backend is connected successfully!"}

@app.post("/api/translate")
def translate_gesture(request: TranslationRequest):
    # Direct Quick Trigger bypass
    if request.sign_id:
        return {
            "status": "success",
            "translation": request.sign_id,
            "confidence": 0.98
        }

    landmarks = request.landmarks
    if not landmarks or len(landmarks) < 21:
        return {
            "status": "error",
            "translation": "UNKNOWN",
            "confidence": 0.0
        }

    wrist = landmarks[0]

    def dist(p1, p2):
        return math.hypot(p1.x - p2.x, p1.y - p2.y)

    # Finger extensions
    is_index_extended = landmarks[8].y < landmarks[6].y and dist(landmarks[8], wrist) > dist(landmarks[6], wrist)
    is_middle_extended = landmarks[12].y < landmarks[10].y and dist(landmarks[12], wrist) > dist(landmarks[10], wrist)
    is_ring_extended = landmarks[16].y < landmarks[14].y and dist(landmarks[16], wrist) > dist(landmarks[14], wrist)
    is_pinky_extended = landmarks[20].y < landmarks[18].y and dist(landmarks[20], wrist) > dist(landmarks[18], wrist)

    is_thumb_extended = dist(landmarks[4], wrist) > 0.25 and dist(landmarks[4], landmarks[5]) > 0.12
    is_thumb_up = landmarks[4].y < landmarks[3].y and landmarks[4].y < landmarks[8].y and not is_index_extended and not is_middle_extended
    is_thumb_down = landmarks[4].y > landmarks[2].y and landmarks[4].y > landmarks[8].y and not is_index_extended and not is_middle_extended

    count_extended = sum([is_index_extended, is_middle_extended, is_ring_extended, is_pinky_extended])

    thumb_index_dist = dist(landmarks[4], landmarks[8])
    index_middle_dist = dist(landmarks[8], landmarks[12])

    matched_sign = "HELP"
    confidence = 0.85

    if is_thumb_up and count_extended == 0:
        matched_sign = 'GOOD'
        confidence = 0.94
    elif is_thumb_down and count_extended == 0:
        matched_sign = 'BAD'
        confidence = 0.92
    elif count_extended == 4 and is_thumb_extended:
        matched_sign = 'HELLO'
        confidence = 0.96
    elif count_extended == 4 and not is_thumb_extended:
        matched_sign = 'STOP'
        confidence = 0.93
    elif is_index_extended and is_middle_extended and is_ring_extended and not is_pinky_extended:
        matched_sign = 'WATER'
        confidence = 0.91
    elif is_index_extended and is_middle_extended and not is_ring_extended and not is_pinky_extended:
        if index_middle_dist < 0.05:
            matched_sign = 'HOSPITAL'
            confidence = 0.89
        else:
            matched_sign = 'NO'
            confidence = 0.88
    elif is_index_extended and not is_middle_extended and not is_ring_extended and not is_pinky_extended:
        if landmarks[8].y > landmarks[7].y:
            matched_sign = 'NEED'
            confidence = 0.86
        else:
            matched_sign = 'YOU'
            confidence = 0.95
    elif not is_index_extended and not is_middle_extended and not is_ring_extended and is_pinky_extended:
        matched_sign = 'I'
        confidence = 0.94
    elif count_extended == 0 and thumb_index_dist < 0.06:
        matched_sign = 'FOOD'
        confidence = 0.89
    elif count_extended == 0 and is_thumb_extended:
        matched_sign = 'YES'
        confidence = 0.90
    elif count_extended == 4 and dist(landmarks[8], landmarks[12]) < 0.04:
        matched_sign = 'THANK YOU'
        confidence = 0.92
    else:
        matched_sign = 'HELP'
        confidence = 0.82

    return {
        "status": "success",
        "translation": matched_sign,
        "confidence": confidence
    }
