import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "@/lib/auth/session";
import { createProject, updateProject, deleteProject } from "@/lib/db/profile-repository";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    if (!body.title || !body.summary) {
      return NextResponse.json({ error: "Project title and summary are required" }, { status: 400 });
    }

    const project = await createProject(session.id, {
      title: body.title,
      summary: body.summary,
      techStack: Array.isArray(body.techStack) ? body.techStack : [],
      liveUrl: body.liveUrl || undefined,
      repoUrl: body.repoUrl || undefined,
      isFeatured: Boolean(body.isFeatured),
    });

    return NextResponse.json({ message: "Project created successfully", project }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const body = await req.json();
    const updated = await updateProject(session.id, projectId, body);

    if (!updated) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ message: "Project updated successfully", project: updated }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const projectId = searchParams.get("id");
    if (!projectId) {
      return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
    }

    const deleted = await deleteProject(session.id, projectId);
    if (!deleted) {
      return NextResponse.json({ error: "Project not found or unauthorized" }, { status: 403 });
    }

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Internal server error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
