import { NextRequest, NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/session";
import { prisma } from "@/lib/db/prisma";
import { getStorage } from "@/lib/uploads/storage";

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const params = await props.params;
    const { title } = await req.json();

    if (!title || typeof title !== "string") {
      return NextResponse.json({ error: "Invalid title" }, { status: 400 });
    }

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id: params.id },
      data: { title },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to rename project:", error);
    return NextResponse.json({ error: "Failed to rename project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser();
    const params = await props.params;

    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: { mediaAssets: true }
    });

    if (!project || project.userId !== user.id) {
      return NextResponse.json({ error: "Not found or not authorized" }, { status: 404 });
    }

    // Safely delete associated files
    const storage = getStorage();
    if (storage.delete) {
      for (const asset of project.mediaAssets) {
        try {
          await storage.delete(asset.filePath);
        } catch (e) {
          console.error("Failed to delete asset file:", asset.filePath, e);
        }
      }
    }

    // Prisma handles cascading deletes for mediaAssets and analysisResults
    await prisma.project.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete project:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
