import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./db";
import { messages } from "./schema";
import { emojiResponses, responses } from "./reponse";

const app = express();
app.use(cors({
  origin: 'https://chat-app-frontend-five-topaz.vercel.app/'
}));
app.use(express.json());

const PORT = process.env.PORT || 8080;

const generateResponse = (input: string): string => {
  const emojisInInput = Array.from(input).filter((char) =>
    char.match(/[\p{Emoji}]/u)
  );
  const textInput = input.replace(/[\p{Emoji}]/u, "").trim();

  let responseText = "";

  if (textInput) {
    const lowerInput = textInput.toLowerCase();
    const matchedResponses: string[] = [];

    for (const keyword in responses) {
      if (lowerInput.includes(keyword)) {
        matchedResponses.push(responses[keyword]);
      }
    }

    if (matchedResponses.length === 0) {
      responseText = responses.default;
    } else if (matchedResponses.length === 1) {
      responseText = matchedResponses[0];
    } else {
      responseText = matchedResponses.join(" ");
    }
  }

  let emojiResponse = "";
  if (emojisInInput.length > 0) {
    emojiResponse = emojisInInput
      .map((emoji) => emojiResponses[emoji] || "")
      .join(" ");
  }

  if (responseText && emojiResponse) {
    return `${responseText} ${emojiResponse}`;
  } else {
    return responseText || emojiResponse || responses.default;
  }
};


app.post("/send-message", async (req: Request, res: Response) => {
  const { text, sticker } = req.body;

  if (sticker) {
    await db.insert(messages).values({ text: "", sticker, sender: "user" });
  } else if (text) {
    await db.insert(messages).values({ text, sender: "user" });
  }

  let responseText = "";
  if (text) {
    responseText = generateResponse(text);
  }

 
  if (sticker) {
    await db.insert(messages).values({ text: responseText, sticker, sender: "bot" });
  } else {
    await db.insert(messages).values({ text: responseText, sender: "bot" });
  }

  res.json({ response: responseText, sticker: sticker || null });
});

app.get("/messages", async (_req: Request, res: Response) => {
  const allMessages = await db.select().from(messages);
  res.json(allMessages);
});

app.get('/', (req, res) => {
  res.json({ message: 'Hello from backend' });
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
