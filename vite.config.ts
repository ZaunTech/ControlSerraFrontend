import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import dotenv from "dotenv";

dotenv.config();
console.log("APP_PORT:", process.env.APP_PORT);

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: Number(process.env.APP_PORT) || 5173, 
  },
});
