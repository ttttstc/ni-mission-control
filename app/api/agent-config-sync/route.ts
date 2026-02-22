import { NextRequest, NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

type Payload = {
  workspacePath?: string;
  soul?: string;
  identity?: string;
  memory?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload;
    const workspacePath = body.workspacePath?.trim();

    if (!workspacePath) {
      return NextResponse.json({ ok: false, error: "workspacePath is required" }, { status: 400 });
    }

    await mkdir(workspacePath, { recursive: true });

    const writes: Promise<unknown>[] = [];

    if (typeof body.soul === "string") {
      writes.push(writeFile(path.join(workspacePath, "SOUL.md"), body.soul, "utf8"));
    }
    if (typeof body.identity === "string") {
      writes.push(writeFile(path.join(workspacePath, "IDENTITY.md"), body.identity, "utf8"));
    }
    if (typeof body.memory === "string") {
      writes.push(writeFile(path.join(workspacePath, "MEMORY.md"), body.memory, "utf8"));
    }

    await Promise.all(writes);

    return NextResponse.json({ ok: true, workspacePath });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message ?? "sync failed" }, { status: 500 });
  }
}
