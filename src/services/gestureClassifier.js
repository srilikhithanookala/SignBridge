// Automatically use your live Render backend URL or fallback to localhost during development
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

export const SUPPORTED_SIGNS = [
  { id: 'HELLO', name: 'Hello', category: 'Greeting', emoji: '👋', description: 'Open palm facing forward with all fingers extended.', instructions: 'Raise your dominant hand, extend all 5 fingers straight up with palm facing forward.' },
  { id: 'THANK YOU', name: 'Thank You', category: 'Polite', emoji: '🙏', description: 'Flat palm with fingers together near chin/chest.', instructions: 'Place flat hand fingers together near your chin/chest and move outward smoothly.' },
  { id: 'YES', name: 'Yes', category: 'Common', emoji: '👍', description: 'Fist with thumb up or gentle fist nodding.', instructions: 'Make a fist with thumb extended upward, tilting hand gently forward.' },
  { id: 'NO', name: 'No', category: 'Common', emoji: '👎', description: 'Index and middle fingers snapping down to touch thumb.', instructions: 'Extend index and middle fingers together, snapping down to meet the thumb.' },
  { id: 'PLEASE', name: 'Please', category: 'Polite', emoji: '🤲', description: 'Open hand rubbing gently in circular motion over chest.', instructions: 'Place open palm flat over your chest and rotate in a gentle circle.' },
  { id: 'SORRY', name: 'Sorry', category: 'Polite', emoji: '✊', description: 'Fist with thumb over fingers rubbing circle on chest.', instructions: 'Form a soft fist and rub in a circle over your chest area.' },
  { id: 'HELP', name: 'Help', category: 'Emergency', emoji: '🆘', description: 'Thumbs-up resting on top of flat palm.', instructions: 'Form a thumbs-up hand shape and place it on top of your open flat palm.' },
  { id: 'WATER', name: 'Water', category: 'Needs', emoji: '💧', description: 'W-handshape (Index, Middle, Ring extended) near chin.', instructions: 'Extend index, middle, and ring fingers up (forming a W) near your chin.' },
  { id: 'FOOD', name: 'Food', category: 'Needs', emoji: '🍎', description: 'Fingertips gathered touching thumb tip toward mouth.', instructions: 'Tap fingertips together against thumb tip repeatedly near your mouth.' },
  { id: 'HOME', name: 'Home', category: 'Places', emoji: '🏠', description: 'Flattened fingers touching cheek near mouth then ear.', instructions: 'Touch flattened fingertips to cheek near mouth, then move to near ear.' },
  { id: 'HOSPITAL', name: 'Hospital', category: 'Places', emoji: '🏥', description: 'H-handshape (Index & Middle extended together) drawing H on arm.', instructions: 'Extend index and middle fingers together horizontally and trace an H on shoulder.' },
  { id: 'SCHOOL', name: 'School', category: 'Places', emoji: '🏫', description: 'Clapping flat palms together horizontally twice.', instructions: 'Hold hands horizontally and clap flat palms together twice.' },
  { id: 'STOP', name: 'Stop', category: 'Action', emoji: '🛑', description: 'Open palm facing outward sharply or side of hand chopping palm.', instructions: 'Extend open palm facing outward straight toward camera.' },
  { id: 'COME', name: 'Come', category: 'Action', emoji: '👈', description: 'Index fingers curved beckoning inward toward chest.', instructions: 'Point index fingers toward self and bend inwards beckoning.' },
  { id: 'GO', name: 'Go', category: 'Action', emoji: '👉', description: 'Index fingers pointing forward and moving outward.', instructions: 'Point both index fingers forward away from your body.' },
  { id: 'I', name: 'I / Me', category: 'Pronoun', emoji: '🙋‍♂️', description: 'Pinky finger extended alone (or index pointing to chest).', instructions: 'Extend pinky finger up straight while curling index, middle, and ring.' },
  { id: 'YOU', name: 'You', category: 'Pronoun', emoji: '👉', description: 'Index finger pointing straight forward at conversation partner.', instructions: 'Point index finger straight forward towards the camera/person.' },
  { id: 'NEED', name: 'Need', category: 'Needs', emoji: '⚠️', description: 'Bent index finger hooked downwards sharply.', instructions: 'Hook index finger downward like a key and press downwards.' },
  { id: 'WANT', name: 'Want', category: 'Needs', emoji: '🤲', description: 'Open claw hands pulling inward toward body.', instructions: 'Form open claw hands with palm facing up, pulling towards chest.' },
  { id: 'GOOD', name: 'Good', category: 'Descriptor', emoji: '✨', description: 'Thumbs-up sign or hand moving from chin down.', instructions: 'Show a clear thumbs-up gesture with all fingers folded.' },
  { id: 'BAD', name: 'Bad', category: 'Descriptor', emoji: '❌', description: 'Thumbs-down gesture or hand turning away from chin.', instructions: 'Show a clear thumbs-down gesture with all fingers folded.' }
];

/**
 * Sends hand landmarks to your live FastAPI backend for translation processing.
 */
export async function sendLandmarksToBackend(landmarks, signId = null) {
  try {
    const response = await fetch(`${BACKEND_URL}/api/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        landmarks: landmarks,
        sign_id: signId
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to connect to backend:", error);
    return null;
  }
}

export function classifyHandLandmarks(landmarks) {
  if (!landmarks || landmarks.length < 21) {
    return { sign: null, name: null, emoji: null, confidence: 0, handDetected: false };
  }

  const wrist = landmarks[0];
  const dist = (p1, p2) => Math.hypot(p1.x - p2.x, p1.y - p2.y);

  const isIndexExtended = landmarks[8].y < landmarks[6].y && dist(landmarks[8], wrist) > dist(landmarks[6], wrist);
  const isMiddleExtended = landmarks[12].y < landmarks[10].y && dist(landmarks[12], wrist) > dist(landmarks[10], wrist);
  const isRingExtended = landmarks[16].y < landmarks[14].y && dist(landmarks[16], wrist) > dist(landmarks[14], wrist);
  const isPinkyExtended = landmarks[20].y < landmarks[18].y && dist(landmarks[20], wrist) > dist(landmarks[18], wrist);

  const isThumbExtended = dist(landmarks[4], wrist) > 0.25 && dist(landmarks[4], landmarks[5]) > 0.12;
  const isThumbUp = landmarks[4].y < landmarks[3].y && landmarks[4].y < landmarks[8].y && !isIndexExtended && !isMiddleExtended;
  const isThumbDown = landmarks[4].y > landmarks[2].y && landmarks[4].y > landmarks[8].y && !isIndexExtended && !isMiddleExtended;

  const countExtended = (isIndexExtended ? 1 : 0) + (isMiddleExtended ? 1 : 0) + (isRingExtended ? 1 : 0) + (isPinkyExtended ? 1 : 0);
  const thumbIndexDist = dist(landmarks[4], landmarks[8]);
  const indexMiddleDist = dist(landmarks[8], landmarks[12]);

  let matchedSign = 'HELLO';
  let confidence = 0.85;

  if (isThumbUp && countExtended === 0) {
    matchedSign = 'GOOD';
    confidence = 0.94;
  } else if (isThumbDown && countExtended === 0) {
    matchedSign = 'BAD';
    confidence = 0.92;
  } else if (countExtended === 4 && isThumbExtended) {
    matchedSign = 'HELLO';
    confidence = 0.96;
  } else if (countExtended === 4 && !isThumbExtended) {
    matchedSign = 'STOP';
    confidence = 0.93;
  } else if (isIndexExtended && isMiddleExtended && isRingExtended && !isPinkyExtended) {
    matchedSign = 'WATER';
    confidence = 0.91;
  } else if (isIndexExtended && isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    if (indexMiddleDist < 0.05) {
      matchedSign = 'HOSPITAL';
      confidence = 0.89;
    } else {
      matchedSign = 'NO';
      confidence = 0.88;
    }
  } else if (isIndexExtended && !isMiddleExtended && !isRingExtended && !isPinkyExtended) {
    if (landmarks[8].y > landmarks[7].y) {
      matchedSign = 'NEED';
      confidence = 0.86;
    } else {
      matchedSign = 'YOU';
      confidence = 0.95;
    }
  } else if (!isIndexExtended && !isMiddleExtended && !isRingExtended && isPinkyExtended) {
    matchedSign = 'I';
    confidence = 0.94;
  } else if (countExtended === 0 && thumbIndexDist < 0.06) {
    matchedSign = 'FOOD';
    confidence = 0.89;
  } else if (countExtended === 0 && isThumbExtended) {
    matchedSign = 'YES';
    confidence = 0.90;
  } else if (countExtended === 4 && dist(landmarks[8], landmarks[12]) < 0.04) {
    matchedSign = 'THANK YOU';
    confidence = 0.92;
  }

  const signData = SUPPORTED_SIGNS.find(s => s.id === matchedSign) || SUPPORTED_SIGNS[0];

  return {
    sign: signData.id,
    name: signData.name,
    emoji: signData.emoji,
    description: signData.description,
    confidence: Math.round(confidence * 100),
    handDetected: true,
    landmarks
  };
}

export function drawHandSkeleton(ctx, landmarks, width, height) {
  if (!ctx || !landmarks || landmarks.length < 21) return;
  ctx.clearRect(0, 0, width, height);

  const connections = [
    [0, 1], [1, 2], [2, 3], [3, 4],
    [0, 5], [5, 6], [6, 7], [7, 8],
    [5, 9], [9, 10], [10, 11], [11, 12],
    [9, 13], [13, 14], [14, 15], [15, 16],
    [13, 17], [17, 18], [18, 19], [19, 20],
    [0, 17]
  ];

  ctx.strokeStyle = '#0c8de9';
  ctx.lineWidth = 4;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  connections.forEach(([i, j]) => {
    const p1 = landmarks[i];
    const p2 = landmarks[j];
    ctx.beginPath();
    ctx.moveTo(p1.x * width, p1.y * height);
    ctx.lineTo(p2.x * width, p2.y * height);
    ctx.stroke();
  });

  landmarks.forEach((p, index) => {
    ctx.beginPath();
    ctx.arc(p.x * width, p.y * height, index === 4 || index === 8 || index === 12 || index === 16 || index === 20 ? 7 : 5, 0, 2 * Math.PI);
    ctx.fillStyle = index === 0 ? '#9333ea' : (index % 4 === 0 ? '#36a9f7' : '#ffffff');
    ctx.fill();
    ctx.strokeStyle = '#026fc7';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}