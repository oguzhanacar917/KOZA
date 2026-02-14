import { API_CONFIG } from '../config';

// Configuration
const USE_OPENROUTER = !!import.meta.env.VITE_OPENROUTER_API_KEY;
const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY || API_CONFIG.GEMINI_API_KEY;

// Models
const MODEL_GOOGLE = 'gemini-2.0-flash-exp';
const MODEL_OPENROUTER = 'google/gemini-2.0-flash-lite-preview-02-05:free'; // Free model as requested
const MODEL = USE_OPENROUTER ? MODEL_OPENROUTER : MODEL_GOOGLE;

const BASE_URL = USE_OPENROUTER
  ? 'https://openrouter.ai/api/v1/chat/completions'
  : `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`;

// Prompts
const STORY_PROMPT = `Sen "KOZA Theory" rehberisin. Kullanıcının yaşadığı zorbalık veya travmatik deneyimi alıp, onu "Metamorfoz" (Başkalaşım) sürecine dönüştüren 5 sayfalık epik ve destekleyici bir hikayeye çeviriyorsun.

KOZA Felsefesi:
- Zorluklar birer hapishane değil, büyümenin gerçekleştiği güvenli "Koza" (Cocoon) alanlarıdır.
- Acı, "Öz" (Dahili Güç) birikimine dönüşür.
- Sonuç, sadece hayatta kalmak değil, kanatlanıp "Görkemli bir Kelebek" gibi en iyi versiyonuna dönüşmektir.

Kurallar:
1. Her sayfa bir "title" ve "content" içermeli.
2. Anlatı dili: Empatik, mitsel, şiirsel ve son derece güçlendirici.
3. Hikaye Arkı: 1. Sayfa (Kapanma/Zorluk), 2. Sayfa (İçsel Sessizlik), 3. Sayfa (İlk Kırılma/Işık), 4. Sayfa (Gelişim/Kanatlanma), 5. Sayfa (Özgürlük/Uçuş).
4. JSON formatında, ek olarak tüm hikaye için bir "themeColor" (Lila, Altın, Turkuaz tonlarında hex kodu) ve "visualMood" (Örn: 'Magical Shimmer', 'Cosmic Dust') döndür:

{
  "themeColor": "#9333EA",
  "visualMood": "Magical Shimmer",
  "pages": [
    {
      "title": "Başlık",
      "content": "İçerik..."
    }
  ]
}

JSON dışında hiçbir şey yazma.`;

const GAME_PROMPT = `Sen bir interaktif metamorfoz tasarımcısısın. Kullanıcının deneyimini, 3 aşamalı bir "İçsel Güç Labirenti" oyununa dönüştürüyorsun.

Kurallar:
1. Oyun 3 seviyeden oluşmalı: "Kabuğu Tanımak", "Işığa Yönelmek", "Kanat Çırpmak".
2. Her seviye bir "scenario" ve 3 "choices" içermeli.
3. Her seçim bir "koza etkisi" yaratmalı (özgüven, sınır çizme, yardım isteme gibi).
4. JSON formatında döndür:

{
  "title": "Oyun Başlığı",
  "themeColor": "#D946EF",
  "levels": [
    {
      "scenario": "Durum...",
      "options": [
        {
          "text": "Seçenek...",
          "isCorrect": true,
          "feedback": "Metaforik ve güçlendirici geri bildirim..."
        }
      ]
    }
  ]
}

JSON dışında hiçbir şey yazma.`;

const NAME_PROMPT = `Sen yaratıcı bir isimlendirme uzmanısın. Verilen hikaye veya oyun içeriğine ve bağlamına göre, "KOZA" evrenine uygun, metaforik, kısa ve etkileyici bir başlık oluştur.

Kurallar:
1. Sadece başlığı döndür (tırnak işaretleri olmadan).
2. Maksimum 3-5 kelime.
3. Türkçe olsun.
4. Örnekler: "Küllerinden Doğan Anka", "Sessizliğin Yankısı", "Mavi Kanatlı Cesaret".

Bağlam/İçerik: `;

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
      let response;

      if (USE_OPENROUTER) {
        response = await fetch(BASE_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`,
            'HTTP-Referer': 'https://koza-app.vercel.app', // Optional but recommended
            'X-Title': 'KOZA App'
          },
          body: JSON.stringify({
            model: MODEL,
            messages: [
              {
                role: 'user',
                content: `${prompt}\n\nKullanıcının deneyimi: ${userInput}`
              }
            ],
            temperature: 0.8,
            max_tokens: 8192,
            response_format: { type: "json_object" }
          })
        });
      } else {
        // Google Direct Fallback
        // ... (same as before)
        response = await fetch(BASE_URL, {
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
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      let content = "";

      if (USE_OPENROUTER) {
        content = data.choices[0].message.content;
      } else {
        if (!data.candidates || !data.candidates[0]) {
          throw new Error('Invalid API response structure');
        }
        content = data.candidates[0].content.parts[0].text;
      }

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

export const generateContentName = async (contentContext) => {
  try {
    // We use a simpler call structure for naming (text response, strict JSON not forced via prompt, but we handle string)
    // Re-using callGemini might force JSON which is fine if we wrapped the prompt to ask for JSON.
    // Let's create a specialized lightweight call or just use callGemini with a JSON wrapper in prompt.

    // Revised NAME_PROMPT above now asks for just text, but callGemini expects JSON.
    // Let's adjust NAME_PROMPT to return JSON: {"title": "The Title"}

    const jsonPrompt = NAME_PROMPT + `\n\nYanıtı şu JSON formatında ver: { "title": "Oluşturulan Başlık" }`;
    const result = await callGemini(jsonPrompt, contentContext);
    return result.title;
  } catch (e) {
    console.error("Naming failed", e);
    return "Dönüşüm Hikayesi"; // Fallback
  }
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
