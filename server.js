// server.js
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = "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"; // 🔒 Replace with your OpenAI API key

app.post("/", async (req, res) => {
  console.log("🔔 BB Request:", req.body);

  const prompt = req.body.prompt;
  const callback_url = req.body.bb_options?.callback_url;

  // Always respond to Bots.Business to prevent timeout
  res.status(200).json({ ok: true });

  if (!prompt || !callback_url) {
    console.log("❌ Missing prompt or callback_url");
    return;
  }

  try {
    const gpt = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a Bots.Business expert. Always give only BJS code." },
          { role: "user", content: prompt }
        ],
        max_tokens: 600
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json"
        }
      }
    );

    const answer = gpt.data.choices[0].message.content;
    console.log("✅ GPT Answer:", answer);

    await axios.post(callback_url, { result: answer });
    console.log("📡 Sent response to BB successfully");
  } catch (error) {
    const errMsg = error.message || "Unknown error";
    console.error("❌ GPT Error:", errMsg);

    await axios.post(callback_url, {
      result: "❌ GPT Error: " + errMsg
    });
  }
});

app.listen(3000, () => {
  console.log("✅ Webhook running on port 3000");
});
