/**
 * SignBridge AI - Context-Aware Sentence Generation Engine
 * Synthesizes individual recognized sign tokens into natural, grammatically structured English sentences.
 */

// Exact Pattern Match Dictionary
const SENTENCE_PATTERNS = [
  { tokens: ['I', 'WANT', 'WATER'], sentence: "I want some water." },
  { tokens: ['I', 'NEED', 'WATER'], sentence: "I need some water, please." },
  { tokens: ['I', 'NEED', 'HELP'], sentence: "I need help immediately." },
  { tokens: ['I', 'WANT', 'HELP'], sentence: "I would like some assistance." },
  { tokens: ['I', 'NEED', 'FOOD'], sentence: "I need something to eat." },
  { tokens: ['I', 'WANT', 'FOOD'], sentence: "I want to get some food." },
  { tokens: ['I', 'GO', 'HOME'], sentence: "I am going home now." },
  { tokens: ['I', 'NEED', 'HOME'], sentence: "I need to get back home." },
  { tokens: ['I', 'NEED', 'HOSPITAL'], sentence: "I need to go to the hospital urgently!" },
  { tokens: ['I', 'GO', 'HOSPITAL'], sentence: "I am heading to the hospital." },
  { tokens: ['I', 'GO', 'SCHOOL'], sentence: "I am going to school." },
  { tokens: ['I', 'NEED', 'SCHOOL'], sentence: "I need to reach the school." },
  
  { tokens: ['HELLO', 'YOU'], sentence: "Hello! Nice to meet you." },
  { tokens: ['HELLO', 'HOW', 'YOU'], sentence: "Hello! How are you doing today?" },
  { tokens: ['THANK YOU', 'FOOD'], sentence: "Thank you for the delicious meal!" },
  { tokens: ['THANK YOU', 'HELP'], sentence: "Thank you so much for your help!" },
  { tokens: ['PLEASE', 'HELP'], sentence: "Please, I need your assistance." },
  { tokens: ['PLEASE', 'WATER'], sentence: "Could I please have some water?" },
  { tokens: ['PLEASE', 'FOOD'], sentence: "Could I please have some food?" },
  
  { tokens: ['YOU', 'COME', 'HOME'], sentence: "Would you like to come to my home?" },
  { tokens: ['YOU', 'GO', 'HOME'], sentence: "Are you going home now?" },
  { tokens: ['YOU', 'NEED', 'HELP'], sentence: "Do you need any help?" },
  
  { tokens: ['YES', 'I', 'WANT'], sentence: "Yes, I would really like that." },
  { tokens: ['YES', 'PLEASE'], sentence: "Yes, please! Thank you." },
  { tokens: ['NO', 'THANK YOU'], sentence: "No, thank you very much." },
  { tokens: ['NO', 'NEED'], sentence: "No, there is no need." },
  
  { tokens: ['SORRY', 'BAD'], sentence: "I am deeply sorry about this." },
  { tokens: ['GOOD', 'FOOD'], sentence: "This food is really good!" },
  { tokens: ['GOOD', 'JOB'], sentence: "Great job, well done!" },
  { tokens: ['STOP', 'GO'], sentence: "Please stop and stay here." }
];

/**
 * Generate context-aware sentence from array of sign IDs
 * @param {Array<string>} signList - Array of sign keys e.g. ['I', 'NEED', 'HELP']
 * @returns {string} Natural language sentence
 */
export function generateSentence(signList) {
  if (!signList || signList.length === 0) {
    return "";
  }

  // Clean tokens
  const tokens = signList.map(s => String(s).toUpperCase().trim()).filter(Boolean);

  if (tokens.length === 0) return "";

  // 1. Single sign fast map
  if (tokens.length === 1) {
    const singleMap = {
      'HELLO': "Hello! Welcome.",
      'THANK YOU': "Thank you!",
      'YES': "Yes, that is correct.",
      'NO': "No, thank you.",
      'PLEASE': "Please.",
      'SORRY': "I am sorry.",
      'HELP': "I need help!",
      'WATER': "May I have some water?",
      'FOOD': "I need food.",
      'HOME': "Home.",
      'HOSPITAL': "Hospital.",
      'SCHOOL': "School.",
      'STOP': "Please stop.",
      'COME': "Please come here.",
      'GO': "You may go.",
      'I': "I am here.",
      'YOU': "You.",
      'NEED': "I have an urgent need.",
      'WANT': "I want this.",
      'GOOD': "That is good!",
      'BAD': "That is bad."
    };
    return singleMap[tokens[0]] || `${formatWord(tokens[0])}.`;
  }

  // 2. Exact match check
  const exact = SENTENCE_PATTERNS.find(p => 
    p.tokens.length === tokens.length && 
    p.tokens.every((t, idx) => t === tokens[idx])
  );
  if (exact) {
    return exact.sentence;
  }

  // 3. Subsequence / Partial pattern match
  const joinedKey = tokens.join('_');
  for (const p of SENTENCE_PATTERNS) {
    const patternKey = p.tokens.join('_');
    if (patternKey === joinedKey) return p.sentence;
  }

  // 4. Heuristic natural rules engine
  let sentence = "";

  const hasI = tokens.includes('I');
  const hasYou = tokens.includes('YOU');
  const hasNeed = tokens.includes('NEED');
  const hasWant = tokens.includes('WANT');
  const hasHelp = tokens.includes('HELP');
  const hasWater = tokens.includes('WATER');
  const hasFood = tokens.includes('FOOD');
  const hasHospital = tokens.includes('HOSPITAL');
  const hasHome = tokens.includes('HOME');
  const hasSchool = tokens.includes('SCHOOL');
  const hasPlease = tokens.includes('PLEASE');
  const hasThankYou = tokens.includes('THANK YOU');

  if (hasI && (hasNeed || hasWant)) {
    const verb = hasNeed ? "need" : "want";
    let target = "something";
    if (hasWater) target = "some water";
    else if (hasFood) target = "some food";
    else if (hasHelp) target = "help";
    else if (hasHospital) target = "to go to the hospital";
    else if (hasHome) target = "to go home";
    else if (hasSchool) target = "to go to school";
    
    sentence = `I ${verb} ${target}.`;
  } else if (hasPlease) {
    const nonPlease = tokens.filter(t => t !== 'PLEASE').map(formatWord).join(' ');
    sentence = `Please ${nonPlease.toLowerCase()}.`;
  } else if (hasThankYou) {
    const nonThank = tokens.filter(t => t !== 'THANK YOU').map(formatWord).join(' ');
    sentence = `Thank you for ${nonThank.toLowerCase() || 'everything'}.`;
  } else {
    // Basic capitalized join
    const words = tokens.map((t, idx) => {
      const formatted = formatWord(t);
      return idx === 0 ? formatted : formatted.toLowerCase();
    });
    sentence = `${words.join(' ')}.`;
  }

  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
}

function formatWord(token) {
  if (!token) return '';
  return token.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
}
