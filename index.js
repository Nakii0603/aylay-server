import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ reply: "Асуулт хоосон байна." });
  }

  try {
    const completion = await openai.chat.completions.create({
      // model: "gpt-4o-mini",
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Та бол монгол хэлээр тусалдаг туслах." },
        { role: "user", content: message },
      ],
      max_tokens: 500,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("GPT алдаа:", error.message);

    if (error.status === 429) {
      return res.status(429).json({
        reply: "API квот хэтэрсэн тул хязгаарлагдлаа. Дараа дахин оролдоно уу.",
      });
    }

    res.status(500).json({ reply: "GPT-ээс хариу авч чадсангүй." });
  }
});

app.listen(port, () => {
  console.log(`Server ажиллаж байна: http://localhost:${port}`);
});
