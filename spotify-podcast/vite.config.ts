import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";

export default defineConfig({
  plugins: [vue()],
  server: {
    host: "127.0.0.1", // Force Vite to use 127.0.0.1 instead of localhost
    port: 5173, // Optional: Change if needed
  },
});
