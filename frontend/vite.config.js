import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
  preview: {
    host: "0.0.0.0",
    allowedHosts: ["taskflow-production-a0db.up.railway.app"]
  }
});
