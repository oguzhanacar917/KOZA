import { API_CONFIG } from '../config';

const GEMINI_API_KEY = API_CONFIG.GEMINI_API_KEY;
const GEMINI_MODEL = 'gemini-2.0-flash-exp';

const STORY_PROMPT = `Sen bir hikaye yazarısın. Kullanıcının yaşadığı zorbalık veya zorluk deneyimini alıp, onu güçlendirici 5 sayfalık bir hikayeye dönüştürüyorsun.

Kurallar:
1. Her sayfa bir "title" ve "content" içermeli
2. İçerik empatik, destekleyici ve umut verici olmalı
3. Hikaye kullanıcının güçlenmesiyle bitmeli
4. Her sayfa 2-3 paragraf olmalı
5. JSON formatında döndür:

[
  {
    "title": "Sayfa başlığı",
    "content": "Sayfa içeriği..."
  }
]

JSON dışında hiçbir şey yazma.`;

const GAME_PROMPT = `Sen bir oyun tasarımcısısın. Kullanıcının yaşadığı zorluğu alıp, onu 3 seviyeli interaktif bir oyuna dönüştürüyorsun.

Kurallar:
1. Oyun 3 seviyeden oluşmalı
2. Her seviye bir "scenario" (durum) ve 3 "options" (seçenek) içermeli
3. Her seçenek için "text", "isCorrect" (boolean) ve "feedback" olmalı
4. JSON formatında döndür:

{
  "title": "Oyun başlığı",
  "levels": [
    {
      "scenario": "Durum açıklaması",
      "options": [
        {
          "text": "Seçenek metni",
          "isCorrect": true,
          "feedback": "Geri bildirim"
        }
      ]
    }
  ]
}

JSON dışında hiçbir şey yazma.`;

// Simple in-memory cache
const cache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

const getCacheKey = (prompt, userInput) => {
  return `${prompt.substring(0, 50)}_${userInput.substring(0, 100)}`;
};

const cleanJSON = (text) => {
  try {
    let cleaned = text.replace(/```json/g, '').replace(/```/g, '').trim();
    const firstBracket = cleaned.indexOf('[');
    const firstBrace = cleaned.indexOf('{');

    let start = -1;
    let end = -1;

    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      start = firstBracket;
      end = cleaned.lastIndexOf(']');
    } else if (firstBrace !== -1) {
      start = firstBrace;
      end = cleaned.lastIndexOf('}');
    }

    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }

    return cleaned;
  } catch (e) {
    return text;
  }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callGemini = async (prompt, userInput, retries = 3) => {
  // Check cache first
  const cacheKey = getCacheKey(prompt, userInput);
  const cached = cache.get(cacheKey);

  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    console.log('📦 Using cached response');
    return cached.data;
  }

  let lastError;

  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: 'user',
              parts: [{ text: `${prompt}\n\nKullanıcının deneyimi: ${userInput}` }]
            }],
            generationConfig: {
              temperature: 0.8,
              maxOutputTokens: 8192,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();

      if (!data.candidates || !data.candidates[0]) {
        throw new Error('Invalid API response structure');
      }

      const content = data.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(cleanJSON(content));

      // Cache successful response
      cache.set(cacheKey, {
        data: parsed,
        timestamp: Date.now()
      });

      return parsed;

    } catch (error) {
      lastError = error;
      console.error(`Attempt ${attempt + 1} failed:`, error.message);

      if (attempt < retries - 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
        console.log(`Retrying in ${delay}ms...`);
        await sleep(delay);
      }
    }
  }

  throw new Error(`Failed after ${retries} attempts: ${lastError.message}`);
};

export const generateStorybook = async (userStory) => {
  if (!userStory || userStory.trim().length < 10) {
    throw new Error('Lütfen en az 10 karakter uzunluğunda bir hikaye girin');
  }
  return callGemini(STORY_PROMPT, userStory);
};

export const generateGame = async (userStory) => {
  if (!userStory || userStory.trim().length < 10) {
    throw new Error('Lütfen en az 10 karakter uzunluğunda bir deneyim girin');
  }
  return callGemini(GAME_PROMPT, userStory);
};

// Clear old cache entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      cache.delete(key);
    }
  }
}, CACHE_DURATION);
