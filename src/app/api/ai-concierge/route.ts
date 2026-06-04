// src/app/api/ai-concierge/route.ts
import Anthropic from '@anthropic-ai/sdk';
import { NextRequest, NextResponse } from 'next/server';
import type { AIMoodboard } from '@/types';

const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY! });

const SYSTEM_PROMPT = `You are the AI Photography Producer for EMONOSHOTS — a premium cinematic photography studio based in Casablanca, Morocco.

Your role: Act as a sophisticated, creative photography producer. Help clients design their perfect shoot. You are warm, professional, and deeply knowledgeable about:
- Automotive and drift photography (Casablanca Port, Circuit Carting Ain Sebaa, industrial zones)
- Architecture photography (Hassan II Mosque, Marina Casablanca, Maarif, Art Deco medina)  
- Street and cinematic portrait photography (Corniche, Old Medina, Quartier des Habous)
- Macro photography
- Night photography techniques, golden hour, blue hour

Pricing guide (MAD):
- Automotive/Drift: 3,500–8,000 MAD (3–5 hours)
- Architecture: 2,500–5,000 MAD (2–4 hours)
- Portrait/Fashion: 3,000–6,000 MAD (2–4 hours)
- Commercial: 6,000–15,000 MAD (half/full day)

Conversation style:
- Short cinematic responses — never long paragraphs
- Ask 1 focused question at a time to understand the vision
- Use line breaks for readability
- When you have enough info, generate a full production brief
- At the end of a complete brief, include a JSON block wrapped in %%%MOODBOARD_START%%% and %%%MOODBOARD_END%%% with this structure:
{
  "type": "AUTOMOTIVE",
  "mood": "Cinematic night, industrial, aggressive",
  "locations": ["Port de Casablanca Section 7", "Zone Industrielle Ain Sebaa"],
  "timeOfDay": "night",
  "estimatedBudget": { "min": 4500, "max": 6500, "currency": "MAD" },
  "duration": 4,
  "deliverables": ["30 edited JPEGs", "5 cinematic retouched finals", "RAW files optional"],
  "equipment": ["Sony A7 IV", "85mm f/1.4", "Godox AD200", "V-Flats"],
  "references": ["@_emonoshots on Instagram"],
  "notes": "Wet road preferred. Rain window 2am–4am optimal."
}

Never be salesy. Be a creative collaborator first.`;

export async function POST(req: NextRequest) {
  try {
    const { messages, sessionId } = await req.json();

    if (!messages?.length || !sessionId) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
    }

    const response = await anthropic.messages.create({
      model: 'claude-opus-4-6',
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: messages.map((m: { role: string; content: string }) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
    });

    const rawContent = response.content[0].type === 'text' ? response.content[0].text : '';

    let moodboard: AIMoodboard | null = null;
    let content = rawContent;

    const moodboardMatch = rawContent.match(
      /%%%MOODBOARD_START%%%([\s\S]*?)%%%MOODBOARD_END%%%/
    );
    if (moodboardMatch) {
      try {
        moodboard = JSON.parse(moodboardMatch[1].trim());
        content = rawContent
          .replace(/%%%MOODBOARD_START%%%[\s\S]*?%%%MOODBOARD_END%%%/, '')
          .trim();
      } catch { /* ignore parse errors */ }
    }

    return NextResponse.json({ content, moodboard });
  } catch (err) {
    console.error('[AI Concierge]', err);
    return NextResponse.json({ error: 'Service unavailable' }, { status: 500 });
  }
}
