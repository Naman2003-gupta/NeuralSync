const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ADD THIS DEBUG LINE
console.log("API Key loaded:", process.env.OPENROUTER_API_KEY ? "YES" : "NO");
console.log("First 10 chars:", process.env.OPENROUTER_API_KEY?.substring(0, 10));

const allowedOrigins = [
  "http://127.0.0.1:5500",
  "http://localhost:5500",
];

app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Backend is running. Use POST /api/chat");
});

app.post("/api/chat", async (req, res) => {
  try {
    const { model, messages } = req.body;

    // ADD THIS DEBUG LINE
    console.log("Received request:", { model, messageCount: messages?.length });

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("ERROR: API key is missing!");
      return res.status(500).json({ error: "Missing OPENROUTER_API_KEY" });
    }

    const r = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.SITE_URL || "http://127.0.0.1:5500",
        "X-Title": process.env.APP_NAME || "NEURALSYNC"
      },
      body: JSON.stringify({
        model: model || "openai/gpt-3.5-turbo",
        messages
      })
    });

    const data = await r.json();
    
    // ADD THIS DEBUG LINE
    console.log("OpenRouter response status:", r.status);
    if (!r.ok) console.error("OpenRouter error:", data);

    res.status(r.status).json(data);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ error: err.message });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Backend running: http://localhost:${port}`));
