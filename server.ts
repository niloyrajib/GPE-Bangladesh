import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Vite middleware for development vs static serve for production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  // Primary application listener on port 3000 (0.0.0.0)
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });

  // In standalone Cloud Run container environments where $PORT is passed and distinct
  const cloudRunPort = process.env.PORT ? parseInt(process.env.PORT, 10) : null;
  if (cloudRunPort && cloudRunPort !== PORT) {
    const secondaryServer = app.listen(cloudRunPort, "0.0.0.0", () => {
      console.log(`Ingress listener active on port ${cloudRunPort}`);
    });
    secondaryServer.on("error", (err: any) => {
      if (err.code === "EADDRINUSE") {
        console.log(`Port ${cloudRunPort} managed by reverse proxy, serving on port ${PORT}`);
      } else {
        console.error("Ingress port error:", err);
      }
    });
  }
}

startServer();
