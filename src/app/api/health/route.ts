import { NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/env";
import { SITE_CONFIG } from "@/lib/constants";

export async function GET() {
  const startTime = Date.now();
  const supabaseReady = isSupabaseConfigured();

  return NextResponse.json(
    {
      status: "healthy",
      timestamp: new Date().toISOString(),
      latencyMs: Date.now() - startTime,
      project: {
        name: SITE_CONFIG.name,
        hackathon: "Smart India Hackathon 2026",
        problemStatement: SITE_CONFIG.sih.problemStatementId,
        category: SITE_CONFIG.sih.category,
        team: SITE_CONFIG.sih.teamName,
      },
      services: {
        webApp: {
          status: "operational",
          runtime: "Next.js 14 App Router",
          nodeVersion: process.version,
        },
        database: {
          provider: "Supabase / PostgreSQL",
          status: supabaseReady ? "connected" : "configured_fallback",
          isConfigured: supabaseReady,
          note: supabaseReady
            ? "Production credentials active."
            : "Using development configuration mode. Add real Supabase keys to .env.local to activate live persistence.",
        },
        rendering: {
          threeD: "React Three Fiber WebGL Engine Active",
          motion: "Framer Motion Kinetics Active",
        },
      },
    },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    }
  );
}
