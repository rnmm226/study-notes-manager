import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type Params = {
  params: Promise<{ id: string }>;
};

// GET /api/notes/:id
export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const note = await prisma.note.findUnique({
      where: {
        id: Number(id),
      },
    });

    if (!note) {
      return NextResponse.json(
        { error: "Note not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to fetch note" },
      { status: 500 }
    );
  }
}

// PUT /api/notes/:id
export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const { title, content, subject } = body;

    if (!title || !content || !subject) {
      return NextResponse.json(
        { error: "Title, content and subject are required" },
        { status: 400 }
      );
    }

    const note = await prisma.note.update({
      where: {
        id: Number(id),
      },
      data: {
        title,
        content,
        subject,
      },
    });

    return NextResponse.json(note);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to update note" },
      { status: 500 }
    );
  }
}

// DELETE /api/notes/:id
export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    await prisma.note.delete({
      where: {
        id: Number(id),
      },
    });

    return NextResponse.json({
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      { error: "Failed to delete note" },
      { status: 500 }
    );
  }
}