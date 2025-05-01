import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import api from "./src/functions/api";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 4000,
    proxy: {
      "/": "https://json-lldi.onrender.com/api",
    },
    // host: true,
    // proxy: {
    //   "/api": {
    //     target: "http://localhost:2000",
    //     // target: "https://json-lldi.onrender.com/api",
    //     rewrite: (path) => path.replace(/^\/api/, ""),
    //   },
    // },
  },
});
