import { NextRequest, NextResponse } from "next/server";
import {
  analyzeResumeATS,
  TARGET_JOB_TEMPLATES,
  SAMPLE_RESUMES,
} from "@/lib/ai/resume-analyzer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const {
      resumeText,
      targetJobId,
      customJobTitle,
      customJobSkills = [],
      customJobDescription,
    } = body;

    if (!resumeText || typeof resumeText !== "string") {
      return NextResponse.json(
        { error: "Resume text content is required" },
        { status: 400 }
      );
    }

    // Resolve target job template or custom JD
    let targetJob: { title: string; requiredSkills: string[]; description?: string } | undefined = undefined;

    if (customJobTitle) {
      targetJob = {
        title: customJobTitle,
        requiredSkills: Array.isArray(customJobSkills) ? customJobSkills : [],
        description: customJobDescription || "",
      };
    } else if (targetJobId) {
      const found = TARGET_JOB_TEMPLATES.find((t) => t.id === targetJobId);
      if (found) {
        targetJob = {
          title: found.title,
          requiredSkills: found.requiredSkills,
          description: found.description,
        };
      }
    } else {
      // Default to AI systems engineer template
      const defaultJob = TARGET_JOB_TEMPLATES[0];
      targetJob = {
        title: defaultJob.title,
        requiredSkills: defaultJob.requiredSkills,
        description: defaultJob.description,
      };
    }

    const analysis = analyzeResumeATS(resumeText, targetJob);

    return NextResponse.json(
      {
        success: true,
        analysis,
        targetJobTemplates: TARGET_JOB_TEMPLATES,
        sampleResumes: Object.values(SAMPLE_RESUMES),
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    console.error("Resume Analyze Error:", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
