import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const port = process.env.PORT || 8000;

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
app.post("/api/chatMessage", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ reply: "Асуулт хоосон байна." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `Та зөвхөн монгол хэл дээр хариулдаг бөгөөд аяллын туршлагатай хүн юм, Таны нэрийн aylay апп туслах хиймэл оюун ухаан юм. `,
        },
        { role: "user", content: message },
      ],
      max_tokens: 2000,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Aylay алдаа:", error.message);

    if (error.status === 429) {
      return res.status(429).json({
        reply: "API квот хэтэрсэн тул хязгаарлагдлаа. Дараа дахин оролдоно уу.",
      });
    }

    res.status(500).json({ reply: "Aylay-ээс хариу авч чадсангүй." });
  }
});

app.post("/api/chat", async (req, res) => {
  const { message } = req.body;

  if (!message || message.trim() === "") {
    return res.status(400).json({ reply: "Асуулт хоосон байна." });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `
Та бол Монгол орны нутгаар аялж буй жуулчдад зориулсан мэргэжлийн AI зөвлөх юм.
Хэрэглэгчийн аяллын мэдээлэл дээр үндэслэн доорх бүтэцтэй аяллын төлөвлөгөө боловсруулна уу:

📅 Өдөр тус бүрийн төлөвлөгөө:
- Маршрут, зай, зорчих хугацаа
- Үзэх газрууд, сонирхолтой үйл ажиллагаа
- Өдрийн хоол/орон нутгийн зоог
- Хоноглох буудал/жуулчны бааз

🎒 Бэлтгэх зүйлс:
- Цүнхлэх шаардлагатай зүйлс (улирал, газрын онцлогоос хамааруулж)
- Уулын гутал, усны сав, нарны тос, хөнжил, майхан гэх мэт

🌦 Цаг агаарын мэдээлэл:
- Сарын дундаж хэм
- Үүлэрхэг эсэх, хур тунадас ордог эсэх
- Шөнийн сэрүүсэлд анхааруулах

💸 Санхүүгийн төлөвлөгөө (барагцаа):
- Нийт хоногийн аяллын төсөв (MNT эсвэл USD)
- Замын зардал (нисэх, машин түрээс, шатахуун)
- Буудал/баазын дундаж үнэ (1 шөнө)
- Өдрийн хоол, хөнгөн зууш
- Нэмэлт зардлууд: орон нутгийн хураамж, үйл ажиллагааны тасалбар

⚠️ Анхаарах зүйлс:
- Гар утасны сүлжээ, интернэт
- Жуулчны аюулгүй байдал, анхаарах ёстой зан заншил
- Байгалийн нөхцөлтэй холбоотой эрсдэл (уулын зам, гулгаа гэх мэт)

🎯 Хэрэглэгчийн сонирхолд нийцүүлж аяллыг оновчтой болго.
Хариултаа хэрэглэгч ойлгомжтой, найрсаг байдлаар өгөөрэй.
`,
        },
        { role: "user", content: message },
      ],
      max_tokens: 2000,
    });

    const reply = completion.choices[0].message.content;
    res.json({ reply });
  } catch (error) {
    console.error("Aylay алдаа:", error.message);

    if (error.status === 429) {
      return res.status(429).json({
        reply: "API квот хэтэрсэн тул хязгаарлагдлаа. Дараа дахин оролдоно уу.",
      });
    }

    res.status(500).json({ reply: "Aylay-ээс хариу авч чадсангүй." });
  }
});

app.listen(port, () => {
  console.log(`Server ажиллаж байна: http://localhost:${port}`);
});
