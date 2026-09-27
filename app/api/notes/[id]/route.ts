import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

type Params = { params: Promise<{ id: string }> };

async function getUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

// GET /api/notes/:id
export async function GET(_req: Request, { params }: Params) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const note = await prisma.note.findFirst({
      where: { id: Number(id), userId },
    });

    if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch note" }, { status: 500 });
  }
}

// PUT /api/notes/:id
export async function PUT(request: Request, { params }: Params) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const { title, content, subject } = await request.json();

    if (!title || !content || !subject) {
      return NextResponse.json({ error: "Title, content and subject are required" }, { status: 400 });
    }

    // Verify ownership first
    const existing = await prisma.note.findFirst({ where: { id: Number(id), userId } });
    if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });

    const note = await prisma.note.update({
      where: { id: Number(id) },
      data: { title, content, subject },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update note" }, { status: 500 });
  }
}

// DELETE /api/notes/:id
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    // Verify ownership first
    const existing = await prisma.note.findFirst({ where: { id: Number(id), userId } });
    if (!existing) return NextResponse.json({ error: "Note not found" }, { status: 404 });

    await prisma.note.delete({ where: { id: Number(id) } });

    return NextResponse.json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete note" }, { status: 500 });
  }
}
