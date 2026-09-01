import { NextRequest, NextResponse } from "next/server";

// Default ElevenLabs human voices
// Rachel: "21m00Tcm4TlvDq8ikWAM" (Warm, natural multilingual female voice)
// Adam: "pNInz6obpgDQGcFmaJgB" (Deep, professional multilingual male voice)
// Sarah: "EXAVITQu4vr4xnSDxMaL" (Expressive, conversational)
const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
const DEFAULT_MODEL_ID = "eleven_multilingual_v2";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, voiceId = DEFAULT_VOICE_ID, modelId = DEFAULT_MODEL_ID } = body;

    if (!text || typeof text !== "string") {
      return NextResponse.json({ error: "Text parameter is required" }, { status: 400 });
    }

    // Clean text by stripping markdown symbols for natural speech synthesis
    const cleanText = text
      .replace(/[*#_`~[\]()]/g, "")
      .replace(/https?:\/\/\S+/g, "")
      .replace(/[\n\r]+/g, " ")
      .trim();

    if (!cleanText) {
      return NextResponse.json({ error: "No speakable text found" }, { status: 400 });
    }

    // Truncate overly long text to save TTS quota (max 600 chars for voice preview)
    const speakableText = cleanText.length > 600 ? cleanText.slice(0, 597) + "..." : cleanText;

    const apiKey = process.env.ELEVENLABS_API_KEY || process.env.NEXT_PUBLIC_ELEVENLABS_API_KEY;

    // If ElevenLabs API key is not configured, gracefully return fallback flag
    if (!apiKey || apiKey === "placeholder" || apiKey.startsWith("your_")) {
      return NextResponse.json({
        fallback: true,
        cleanText: speakableText,
        message: "ElevenLabs API key not configured. Using high-fidelity browser neural voice.",
      });
    }

    const elevenLabsUrl = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const response = await fetch(elevenLabsUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
        Accept: "audio/mpeg",
      },
      body: JSON.stringify({
        text: speakableText,
        model_id: modelId,
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
          style: 0.15,
          use_speaker_boost: true,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.warn("ElevenLabs API call failed:", response.status, errText);
      return NextResponse.json({
        fallback: true,
        cleanText: speakableText,
        error: `ElevenLabs Error: ${response.status}`,
      });
    }

    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Length": audioBuffer.byteLength.toString(),
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal voice server error";
    console.error("ElevenLabs Route Error:", error);
    return NextResponse.json({ fallback: true, error: message }, { status: 500 });
  }
}
