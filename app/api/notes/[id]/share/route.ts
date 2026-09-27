import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { randomBytes } from "crypto";

type Params = { params: Promise<{ id: string }> };

async function getUserId(): Promise<string | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user?.id ?? null;
}

// POST — enable sharing
export async function POST(_req: Request, { params }: Params) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;
    const noteId = Number(id);

    const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
    if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });

    const token = note.shareToken ?? randomBytes(16).toString("hex");
    await prisma.note.update({
      where: { id: noteId },
      data: { isPublic: true, shareToken: token },
    });

    return NextResponse.json({ token, url: `/notes/public/${token}` });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "Failed to share note" }, { status: 500 });
  }
}

// DELETE — revoke sharing
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const userId = await getUserId();
    if (!userId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { id } = await params;

    const note = await prisma.note.findFirst({ where: { id: Number(id), userId } });
    if (!note) return NextResponse.json({ error: "Note not found" }, { status: 404 });

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
