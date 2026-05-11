import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

let _dirname = "";
try {
  _dirname = path.dirname(fileURLToPath(import.meta.url));
} catch (e) {
  _dirname = process.cwd(); 
}
const __dirname = _dirname;

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route for Telegram Notifications
  app.post("/api/notify", async (req, res) => {
    const { name, contact, phone, message, tier, total } = req.body;
    
    const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

    if (!BOT_TOKEN || !CHAT_ID) {
      console.error("Missing Telegram configuration");
      return res.status(500).json({ status: "error", message: "Telegram not configured" });
    }

    const text = `
🚀 *Новая заявка!*
👤 *Имя:* ${name}
📞 *Телефон:* ${phone}
📧 *Контакт:* ${contact}
📦 *Тариф:* ${tier || 'Не выбран'}
💰 *Примерная цена:* ${total ? total.toLocaleString() + ' ₽' : 'Не указана'}

💬 *Сообщение:*
${message}
    `.trim();

    try {
      const response = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          text: text,
          parse_mode: 'Markdown'
        })
      });

      if (!response.ok) {
        throw new Error(`Telegram API error: ${response.statusText}`);
      }

      res.json({ status: "ok" });
    } catch (error) {
      console.error("Error sending Telegram message:", error);
      res.status(500).json({ status: "error", message: "Failed to send notification" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    try {
      const { createServer } = await import("vite");
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite not found, skipping middleware");
    }
  } else {
    // In production, serve from the dist folder
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      const indexPath = path.join(distPath, "index.html");
      if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
      } else {
        res.status(404).send("Not Found");
      }
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT} in ${process.env.NODE_ENV || 'development'} mode`);
  });
}

startServer();
