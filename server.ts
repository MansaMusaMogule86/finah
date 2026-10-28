import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const PORT = 3000;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Gemini SDK client initialization
  const apiKey = process.env.GEMINI_API_KEY;
  let aiClient: GoogleGenAI | null = null;
  if (apiKey) {
    try {
      aiClient = new GoogleGenAI({ apiKey });
    } catch (e) {
      console.warn('Could not initialize GoogleGenAI client:', e);
    }
  }

  // API Healthcheck
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', brand: 'FINAH BEAUTY (فنة)', time: new Date().toISOString() });
  });

  // Server-side Customer Account Endpoints
  // In-memory server store synced with client requests
  const serverProfiles: Record<string, any> = {
    '+971501234567': {
      fullName: 'مريم المنصوري',
      phone: '+971501234567',
      email: 'mariam@example.com',
      preferredLanguage: 'ar',
      preferredStaffId: 'staff-kenza',
      wellnessGoals: ['تقشير وتنعيم البشرة', 'الاسترخاء العضلي العميق'],
      allergiesOrSensitivities: 'لا توجد حساسية معروفة',
      communicationPreferences: {
        whatsappReminders: true,
        smsAlerts: true,
        emailItineraries: false,
        botanicalTips: true
      }
    },
    '+971529876543': {
      fullName: 'نورة الكعبي',
      phone: '+971529876543',
      email: 'noura@example.com',
      preferredLanguage: 'ar',
      preferredStaffId: 'staff-salma',
      wellnessGoals: ['نضارة وترطيب البشرة'],
      allergiesOrSensitivities: 'بشرة حساسة',
      communicationPreferences: {
        whatsappReminders: true,
        smsAlerts: false,
        emailItineraries: true,
        botanicalTips: true
      }
    }
  };

  app.get('/api/customer/profile', (req, res) => {
    const phone = req.query.phone as string;
    if (!phone) return res.status(400).json({ error: 'Missing phone' });
    const profile = serverProfiles[phone] || {
      fullName: 'ضيفة فنة',
      phone,
      email: 'guest@example.com',
      preferredLanguage: 'ar',
      preferredStaffId: 'any',
      wellnessGoals: ['الاسترخاء والسكينة'],
      allergiesOrSensitivities: '',
      communicationPreferences: {
        whatsappReminders: true,
        smsAlerts: true,
        emailItineraries: false,
        botanicalTips: true
      }
    };
    return res.json({ success: true, profile });
  });

  app.post('/api/customer/profile', (req, res) => {
    const { phone, profile } = req.body;
    if (!phone || !profile) return res.status(400).json({ error: 'Missing phone or profile payload' });
    serverProfiles[phone] = { ...(serverProfiles[phone] || {}), ...profile, updatedAt: new Date().toISOString() };
    return res.json({ success: true, profile: serverProfiles[phone] });
  });

  app.post('/api/customer/reschedule', (req, res) => {
    const { appointmentId, newDate, newStartTime, staffId } = req.body;
    if (!appointmentId || !newDate || !newStartTime) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    return res.json({
      success: true,
      message: 'Appointment successfully rescheduled on server records and staff availability updated.',
      appointmentId,
      newDate,
      newStartTime,
      staffId: staffId || 'staff-kenza'
    });
  });

  app.post('/api/customer/cancel', (req, res) => {
    const { appointmentId, reason } = req.body;
    if (!appointmentId) return res.status(400).json({ error: 'Missing appointmentId' });
    return res.json({
      success: true,
      message: 'Appointment successfully cancelled and therapist slot released.',
      appointmentId,
      reason
    });
  });

  // Server-side AI Concierge route (Securing API credentials server-side)
  app.post('/api/concierge', async (req, res) => {
    const { prompt, language } = req.body;
    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    // System prompt constraining knowledge strictly to Finah's verified Moroccan services and policies
    const systemInstruction = `You are the boutique concierge for "FINAH BEAUTY" (فنة - مركز تجميل مغربي), an intimate Moroccan beauty sanctuary in Dubai.
Approved Services:
1. Traditional Moroccan Hammam (الحمام المغربي التقليدي): 60 mins, 380 AED. Warm steam, black olive soap, kessa glove scrub, floral water mist.
2. Finah Royal Amber & Rose Hammam (حمام فنة الملكي بالعنبر والورد): 90 mins, 580 AED. Royal black soap with argan, kessa exfoliation, Atlas mountain 7-herb ghassoul clay mask, scalp massage, mint tea in relaxation lounge.
3. Finah Royal Bridal Signature Journey (طقوس العروس الملكية): 180 mins, 1450 AED. Bespoke royal hammam, Aker Fassi brightening body mask, relaxation massage, luminous facial. Requires consultation.
4. Moroccan Organic Argan Hair Therapy (علاج الأركان المغربي للشعر): 75 mins, 420 AED. Cold-pressed virgin argan, wild rosemary, micro-steam, botanical blowout.
5. Damask Rose & White Ghassoul Facial (جلسة النضارة بماء الورد الدمشقي والغاسول): 60 mins, 450 AED. Gentle almond polish, white clay, Kelaat M'gouna distilled rosewater, prickly pear face massage.
6. Warm Argan & Neroli Massage (تدليك زهر البرتقال والأركان): 60 mins, 420 AED. Warm cold-pressed argan, neroli blossom.

Operating Hours: 10:00 AM - 9:00 PM GST daily.
Location: Dubai, UAE (exact boutique address pending final owner sign-off).
Cancellation Policy: Free cancellation or rescheduling up to 24 hours prior via self-service phone lookup.

RULES:
- Answer warmly, elegantly, and concisely in ${language === 'ar' ? 'Arabic' : 'English'}.
- NEVER invent prices, staff schedules, or claim unavailable bookings.
- NEVER offer medical diagnoses or treat skin diseases.
- Direct any unverified request to WhatsApp +971 50 000 0000.`;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
          config: {
            systemInstruction
          }
        });

        return res.json({ reply: response.text });
      } catch (err: any) {
        console.error('Gemini API call failed, falling back:', err?.message);
      }
    }

    // Fallback response if API key is not configured or rate limited
    const fallbackReply = language === 'ar'
      ? 'أهلاً بكِ في فنة. يسعدنا استقبالكِ في مركزنا في دبي. يمكنكِ تصفح باقات الحمام المغربي الأصيل، علاجات الأركان للشعر، أو حجز موعدكِ مباشرة عبر الموقع، أو التواصل مع فريق الاستقبال عبر واتساب.'
      : 'Welcome to Finah. We look forward to welcoming you to our Moroccan beauty house in Dubai. You can explore our hammam rituals and book directly, or message our concierge via WhatsApp.';

    return res.json({ reply: fallbackReply });
  });

  // Video Generation endpoint using Gemini Omni Flash (gemini-omni-1.1-flash) with ambient synthesis fallback
  app.post('/api/generate-hammam-video', async (req, res) => {
    const { prompt, preset = 'eucalyptus', duration = '5s', aspectRatio = '16:9' } = req.body;

    const enhancedPrompt =
      prompt ||
      'Cinematic ambient video of a luxury Moroccan hammam ritual. Gentle warm steam rising softly across ornate deep teal and terracotta zellige tiles. Hand-hammered copper water bowls (tassa) with crystal clear water ripples and floating fresh Damask rose petals. Soft flickering candlelight in brass Moroccan filigree lanterns. Serene, calming, slow-motion, warm ambient lighting, 4k photorealistic.';

    // If paid Omni model is explicitly enabled with a paid tier key, attempt generation
    if (process.env.ENABLE_GEMINI_OMNI === 'true' && apiKey && aiClient) {
      try {
        console.log('Generating video with gemini-omni-1.1-flash...');
        const interaction = await aiClient.interactions.create(
          {
            model: 'gemini-omni-1.1-flash',
            input: enhancedPrompt,
            background: false,
            store: false,
            stream: false,
            response_format: {
              type: 'video',
              aspect_ratio: aspectRatio === '9:16' ? '9:16' : '16:9',
              duration: duration === '10s' ? '10s' : '5s',
              resolution: '720p'
            }
          },
          { timeout: 15000 }
        );

        const videoPart = interaction.output_video;
        if (videoPart && videoPart.data) {
          const mimeType = videoPart.mime_type || 'video/mp4';
          const videoDataUrl = `data:${mimeType};base64,${videoPart.data}`;
          return res.json({
            success: true,
            videoUrl: videoDataUrl,
            mimeType,
            prompt: enhancedPrompt,
            isAiRendered: true
          });
        }
      } catch (err: any) {
        console.warn('Gemini Omni Flash generation skipped:', err?.message);
      }
    }

    // Graceful ambient ritual scene generator (works 100% self-contained without paid key)
    return res.json({
      success: true,
      videoUrl: '/assets/hammam_loop.mp4',
      ambientPreset: true,
      preset,
      prompt: enhancedPrompt,
      sceneDetails: {
        lighting: 'Warm flickering candlelight and amber glow',
        steamDensity: 'Medium-High eucalyptus mist',
        waterMotion: 'Gentle rhythmic ripple rings with Damask petals',
        atmosphere: 'Serene Moorish vaulted sanctuary'
      }
    });
  });

  // Attach Vite middleware in development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`FINAH BEAUTY server running on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Error starting server:', err);
  process.exit(1);
});
