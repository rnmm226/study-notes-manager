import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/notes
export async function GET() {
  try {
    const notes = await prisma.note.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(notes);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch notes" },
      { status: 500 }
    );
  }
}

// POST /api/notes
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { title, content, subject } = body;

    if (!title || !content || !subject) {
      return NextResponse.json(
        { error: "Title, content and subject are required" },
        { status: 400 }
      );
    }

    const note = await prisma.note.create({
      data: {
        title,
        content,
        subject,
      },
    });

    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to create note" },
      { status: 500 }
    );
  }
}