

const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const OPENAI_API_KEY = "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";

app.post("/bb-gpt", async (req, res) => {
  const userPrompt = req.body.prompt || "default prompt";

  const gptPrompt = 
You are a Bots.Business code generator.
Always return clean BB-compatible JavaScript code.
Use only synchronous code. No async, no await, no promises.
User wants: ${userPrompt}
;

  try {
    const completion = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: "You are a BB JavaScript bot generator."
          },
          {
            role: "user",
            content: gptPrompt
          }
        ],
        temperature: 0.2,
        max_tokens: 800
      },
      {
        headers: {
          Authorization: Bearer ${OPENAI_API_KEY},
          "Content-Type": "application/json"
        }
      }
    );

    const code = completion.data.choices[0].message.content;
    res.json({ result: code });
  } catch (err) {
    console.error("GPT ERROR:", err.response ? err.response.data : err.message);
    res.status(500).json({ error: "GPT Error" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
