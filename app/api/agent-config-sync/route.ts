import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

type Payload = {
  workspacePath?: string;
  soul?: string;
  identity?: string;
  memory?: string;
};

async function readSafe(workspacePath: string, fileName: string) {
  try {
    return await readFile(path.join(workspacePath, fileName), "utf8");
  } catch {
    return "";
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const workspacePath = searchParams.get("path")?.trim();

    if (!workspacePath) {
      return NextResponse.json({ ok: false, error: "workspacePath is required" }, { status: 400 });
    }

    const [soul, identity, memory] = await Promise.all([
      readSafe(workspacePath, "SOUL.md"),
      readSafe(workspacePath, "IDENTITY.md"),
      readSafe(workspacePath, "MEMORY.md"),
    ]);

    return NextResponse.json({ ok: true, soul, identity, memory });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message ?? "read failed" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Payload;
    const workspacePath = body.workspacePath?.trim();

    if (!workspacePath) {
      return NextResponse.json({ ok: false, error: "workspacePath is required" }, { status: 400 });
    }

    await mkdir(workspacePath, { recursive: true });

    const writes: Promise<unknown>[] = [];
    if (typeof body.soul === "string") writes.push(writeFile(path.join(workspacePath, "SOUL.md"), body.soul, "utf8"));
    if (typeof body.identity === "string") writes.push(writeFile(path.join(workspacePath, "IDENTITY.md"), body.identity, "utf8"));
    if (typeof body.memory === "string") writes.push(writeFile(path.join(workspacePath, "MEMORY.md"), body.memory, "utf8"));

    await Promise.all(writes);
    return NextResponse.json({ ok: true, workspacePath });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: error?.message ?? "sync failed" }, { status: 500 });
  }
}
