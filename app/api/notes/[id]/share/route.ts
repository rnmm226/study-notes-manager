import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";

type Params = { params: Promise<{ id: string }> };

// POST /api/notes/:id/share  — enable public sharing, returns token
export async function POST(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const noteId = Number(id);

    let note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });

    // Generate token if not already shared
    const token = note.shareToken ?? randomBytes(16).toString("hex");

    note = await prisma.note.update({
      where: { id: noteId },
      data: { isPublic: true, shareToken: token },
    });

    return NextResponse.json({ token, url: `/notes/public/${token}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to share note" }, { status: 500 });
  }
}

// DELETE /api/notes/:id/share  — revoke sharing
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    await prisma.note.update({
      where: { id: Number(id) },
      data: { isPublic: false, shareToken: null },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to revoke share" }, { status: 500 });
  }
}
