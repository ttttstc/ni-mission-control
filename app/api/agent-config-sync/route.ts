import { NextRequest, NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

type Payload = {
  workspacePath?: string;
  soul?: string;
  identity?: string;
  memory?: string;
};

const REMOTE_PROXY = process.env.AGENT_SYNC_PROXY_URL;

async function readSafe(workspacePath: string, fileName: string) {
  try {
    return await readFile(path.join(workspacePath, fileName), "utf8");
  } catch {
    return "";
  }
}

async function forwardToRemote(method: "GET" | "POST", req: NextRequest) {
  if (!REMOTE_PROXY) return null;

  try {
    if (method === "GET") {
      const { searchParams } = new URL(req.url);
      const workspacePath = searchParams.get("path")?.trim() ?? "";
      const resp = await fetch(`${REMOTE_PROXY.replace(/\/$/, "")}/read?path=${encodeURIComponent(workspacePath)}`, {
        method: "GET",
      });
      const data = await resp.json();
      return NextResponse.json(data, { status: resp.status });
    }

    const body = (await req.json()) as Payload;
    const resp = await fetch(`${REMOTE_PROXY.replace(/\/$/, "")}/write`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = await resp.json();
    return NextResponse.json(data, { status: resp.status });
  } catch (error: any) {
    return NextResponse.json({ ok: false, error: `remote proxy error: ${error?.message ?? "unknown"}` }, { status: 502 });
  }
}

export async function GET(req: NextRequest) {
  const forwarded = await forwardToRemote("GET", req);
  if (forwarded) return forwarded;

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
  const forwarded = await forwardToRemote("POST", req);
  if (forwarded) return forwarded;

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
