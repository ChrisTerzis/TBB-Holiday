import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  // Default "/" (tbb-holiday.pages.dev). Build with VITE_BASE_PATH=/gift/ when the
  // page is served at thebarbellballerina.com/gift through the gift proxy Worker.
  base: process.env.VITE_BASE_PATH || "/",
  plugins: [react()],
});
