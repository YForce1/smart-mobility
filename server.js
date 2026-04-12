/**
 * SMART Mobility Platform — Express Server
 * Serves the React app as static files on all network interfaces.
 * Run: node server.js
 * Then access via: http://YOUR_IP:3000
 */

import express from "express";
import { fileURLToPath } from "url";
import path from "path";
import os from "os";

// Recreate __dirname (not available in ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const app  = express();
const PORT = process.env.PORT || 3000;

// ── Serve the built React app ─────────────────────────────────
app.use(express.static(path.join(__dirname, "dist")));

// ── SPA fallback — always return index.html ───────────────────
app.get("/{*path}", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// ── Start on 0.0.0.0 (all interfaces) ────────────────────────
app.listen(PORT, "0.0.0.0", () => {
  const interfaces = os.networkInterfaces();

  console.log("\n╔══════════════════════════════════════════════╗");
  console.log("║     SMART Mobility Platform — Running        ║");
  console.log("╠══════════════════════════════════════════════╣");
  console.log(`║  Local:    http://localhost:${PORT}              ║`);

  Object.values(interfaces).flat()
    .filter(i => i.family === "IPv4" && !i.internal)
    .forEach(i => {
      const addr = `http://${i.address}:${PORT}`;
      const pad  = " ".repeat(Math.max(0, 44 - addr.length - 4));
      console.log(`║  Network:  ${addr}${pad}║`);
    });

  console.log("╠══════════════════════════════════════════════╣");
  console.log("║  Share any Network URL with your testers     ║");
  console.log("║  Press Ctrl+C to stop                        ║");
  console.log("╚══════════════════════════════════════════════╝\n");
});
