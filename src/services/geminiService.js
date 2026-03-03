import { API_CONFIG } from '../config';
import { SINGULARITY_CORE_PROMPT } from '../config/prompts';

// Configuration
const MODEL = 'google/gemma-3-27b-it';
const BASE_URL = 'https://openrouter.ai/api/v1/chat/completions';

// Prompts
// Prompts
const STORY_PROMPT = `Siz bir "Zorbalıkla Başa Çıkma" rehberisiniz. Kullanıcının yaşadığı zorbalık veya travmatik deneyimi alıp, onu en az 10 sayfalık, uzun, zengin, moral verici ve destekleyici bir hikayeye dönüştürüyorsunuz; bu hikaye süreci "Kullanıcıyı Motive Etme, Zorlukların Üstesinden Gelmesini Sağlama" sürecine dönüştürür.

KOZA Felsefesi:
- Zorluklar hapishane değil, gelişimin gerçekleşmesi için fırsatlardır.
- Acı, kişiyi içsel gücünü ve direncini fark etmeye zorlayan bir öğretmendir.
- Sonuç sadece hayatta kalmak değil, kendisinin en iyi versiyonu olmaktır.

HİKAYE YAPISI (ZORUNLU):
1. Sayfa: ZORLUK - Sorunun başladığı an.
2. Sayfa: SESSİZLİK - İnsan beyninin içindeki kafa karışıklığı ve durgunluk.
3. Sayfa: ANALİZ (Kırılma) - Yaşananları anlamlandırma ve ne yapılabileceğini fark etme.
4. Sayfa: GELİŞİM KARARI - Bir seçim yapma, bir sınır koyma veya yeni bir adım atma.
5. Sayfa: ÖZGÜRLÜK (Bütünleşme) - Kanatlarını açma ve hayata yeni bir bakış açısıyla devam etme.
6. Sayfa: MİRAS - Bu deneyimin kişi ve çevresi için nasıl bir güç ve ilham kaynağı haline geldiğini gösterme.
7. Sayfa: KUTLAMA - Kişinin kendi gücünü ve dönüşümünü kutlaması.
8. Sayfa: DEVAMLILIK - Hayatın devam ettiğini ve yeni zorlukların da üstesinden gelinebileceğini vurgulama.
9. Sayfa: EMPATİ - Benzer deneyimler yaşayan diğer insanlar için empati ve destek çağrısı.
10. Sayfa: UMUT - Her karanlık tünelin sonunda bir ışık olduğunu ve herkesin kendi ışığını bulabileceğini hatırlatma.

Kurallar:
1. Her sayfa bir "title" (başlık) ve "content" (içerik) içermelidir.
2. Anlatım dili: Empatik, moral verici, şiirsel ve son derece güçlendirici.
3. ÇIKTI FORMATI: JSON.
4. "reflectionQuestion": Kullanıcının bu hikaye hakkında düşünmesini sağlayacak açık uçlu bir soru ekleyin.
5. "growthLesson": Hikayeden çıkarılacak temel bir hayat dersi ekleyin.
6. GÜVENLİK: Asla tıbbi teşhis koymayın, terapi önermeyin veya kesin psikolojik iddialarda bulunmayın.
7. DİL: Hikaye tamamen TÜRKÇE olmalıdır.

{
  "themeColor": "#9333EA",
  "visualMood": "Magical Shimmer",
  "reflectionQuestion": "...",
  "growthLesson": "...",
  "pages": [
    { "title": "Başlık", "content": "İçerik..." }
  ]
}

Sadece JSON yazın.`;

const REFINE_STORY_PROMPT = `Siz bir hikaye editörüsünüz. Mevcut bir hikayeyi ve kullanıcının geri bildirimini alıp hikayeyi bu geri bildirime göre güncelliyorsunuz.

Kurallar:
1. KOZA Felsefesini (Zorluktan Dönüşüm) ve 10 sayfalık hikaye yapısını korumalısınız.
2. Kullanıcının istediği değişiklikleri (karakter ekleme, atmosfer değiştirme, kurguyu düzenleme vb.) hikayeye uyarlayın.
3. Anlatım dilini empatik ve güçlendirici tutmaya devam edin.
4. ÇIKTI FORMATI: JSON (STORY_PROMPT ile aynı yapı).
5. DİL: Hikaye tamamen TÜRKÇE olmalıdır.

Mevcut Hikaye:
{{EXISTING_STORY}}

Kullanıcı Geri Bildirimi:
{{USER_FEEDBACK}}

{
  "themeColor": "#9333EA",
  "visualMood": "Magical Shimmer",
  "reflectionQuestion": "...",
  "growthLesson": "...",
  "pages": [
    { "title": "Başlık", "content": "İçerik..." }
  ]
}

Sadece JSON yazın.`;

const GAME_PROMPT = `Siz etkileşimli bir başkalaşım tasarımcısısınız. Kullanıcının deneyimini 3 seviyeli bir "İçsel Güç Labirenti" oyununa dönüştürüyorsunuz.

Kurallar:
1. Oyun 3 seviyeden oluşmalıdır: "Kabuğu Fark Etmek", "Işığa Dönmek", "Kanat Çırpmak".
2. Her seviye bir "scenario" (senaryo) ve 3 "options" (seçenek) içermelidir.
3. Her seçim bir "koza etkisi" yaratmalıdır (özgüven, sınır koyma, yardım isteme gibi).
4. "reflectionQuestion": Oyunun sonunda kullanıcının seçimlerini sorgulamasını sağlayacak bir soru.
5. "growthLesson": Oyunun öğrettiği temel beceri (Sınır koyma, öz şefkat vb.).
6. GÜVENLİK: Asla tıbbi veya klinik tavsiye vermeyin.
7. DİL: Oyun tamamen TÜRKÇE olmalıdır.

{
  "title": "Oyun Başlığı",
  "themeColor": "#D946EF",
  "reflectionQuestion": "...",
  "growthLesson": "...",
  "levels": [
    {
      "scenario": "Senaryo...",
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

Sadece JSON yazın.`;

const NAME_PROMPT = `Siz yaratıcı bir isimlendirme uzmanısınız. Verilen hikaye veya oyun içeriğine ve bağlamına uygun, "KOZA" evrenine yakışır şekilde metaforik, kısa ve etkileyici bir başlık oluşturun.

Kurallar:
1. Sadece başlığı döndürün (tırnak işareti olmadan).
2. Maksimum 3-5 kelime.
3. TÜRKÇE olsun.
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
  } catch {
    return text;
  }
};

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const callGemini = async (prompt, userInput, retries = 3) => {
  const API_KEY = API_CONFIG.OPENROUTER_API_KEY;

  // Dynamic referer for OpenRouter
  const referer = typeof window !== 'undefined' ? window.location.origin : 'https://koza-app.vercel.app';

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
      const response = await fetch(BASE_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${API_KEY}`,
          'HTTP-Referer': referer,
          'X-Title': 'KOZA App'
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: 'system',
              content: SINGULARITY_CORE_PROMPT
            },
            {
              role: 'user',
              content: `${prompt}\n\nUser experience: ${userInput}`
            }
          ],
          temperature: 0.8,
          max_tokens: 8192,
          response_format: { type: "json_object" }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API error ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
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
    throw new Error('Lütfen deneyiminizi açıklayan en az 10 karakter girin');
  }
  return callGemini(STORY_PROMPT, userStory);
};

export const refineStorybook = async (existingStory, feedback) => {
  if (!feedback || feedback.trim().length < 5) {
    throw new Error('Lütfen daha detaylı bir geri bildirim sağlayın (en az 5 karakter)');
  }
  const prompt = REFINE_STORY_PROMPT
    .replace('{{EXISTING_STORY}}', JSON.stringify(existingStory))
    .replace('{{USER_FEEDBACK}}', feedback);

  return callGemini(prompt, feedback);
};

export const generateGame = async (userStory) => {
  if (!userStory || userStory.trim().length < 10) {
    throw new Error('Lütfen deneyiminizi açıklayan en az 10 karakter girin');
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

    const jsonPrompt = NAME_PROMPT + `\n\nSadece şu JSON formatında yanıt verin: { "title": "Oluşturulan Başlık" }`;
    const result = await callGemini(jsonPrompt, contentContext);
    return result.title;
  } catch {
    console.error("İsimlendirme başarısız");
    return "Dönüşüm Hikayesi"; // Fallback
  }
};

// Clear old cache entries periodically (browser-only, safe for SSR/Next.js)
if (typeof window !== 'undefined') {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of cache.entries()) {
      if (now - value.timestamp > CACHE_DURATION) {
        cache.delete(key);
      }
    }
  }, CACHE_DURATION);
}
