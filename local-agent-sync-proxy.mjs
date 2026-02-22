import http from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const PORT = Number(process.env.AGENT_SYNC_PROXY_PORT || 19091);

async function readSafe(workspacePath, fileName) {
  try {
    return await readFile(path.join(workspacePath, fileName), "utf8");
  } catch {
    return "";
  }
}

function send(res, status, data) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(data));
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, `http://127.0.0.1:${PORT}`);

    if (req.method === "GET" && url.pathname === "/read") {
      const workspacePath = (url.searchParams.get("path") || "").trim();
      if (!workspacePath) return send(res, 400, { ok: false, error: "workspacePath is required" });

      const [soul, identity, memory] = await Promise.all([
        readSafe(workspacePath, "SOUL.md"),
        readSafe(workspacePath, "IDENTITY.md"),
        readSafe(workspacePath, "MEMORY.md"),
      ]);
      return send(res, 200, { ok: true, soul, identity, memory });
    }

    if (req.method === "POST" && url.pathname === "/write") {
      const chunks = [];
      for await (const c of req) chunks.push(c);
      const body = JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
      const workspacePath = (body.workspacePath || "").trim();
      if (!workspacePath) return send(res, 400, { ok: false, error: "workspacePath is required" });

      await mkdir(workspacePath, { recursive: true });
      const writes = [];
      if (typeof body.soul === "string") writes.push(writeFile(path.join(workspacePath, "SOUL.md"), body.soul, "utf8"));
      if (typeof body.identity === "string") writes.push(writeFile(path.join(workspacePath, "IDENTITY.md"), body.identity, "utf8"));
      if (typeof body.memory === "string") writes.push(writeFile(path.join(workspacePath, "MEMORY.md"), body.memory, "utf8"));
      await Promise.all(writes);

      return send(res, 200, { ok: true, workspacePath });
    }

    return send(res, 404, { ok: false, error: "not found" });
  } catch (e) {
    return send(res, 500, { ok: false, error: String(e?.message || e) });
  }
});

server.listen(PORT, () => {
  console.log(`[agent-sync-proxy] listening on http://127.0.0.1:${PORT}`);
});
