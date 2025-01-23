import express from "express";
import MistralClient from "./mistral";

const app = express();

app.use(express.json());

app.use("/api/chat", async (req, res) => {
  const { prompt } = req.body;

  const mistralClient = new MistralClient();

  try {
    const chatStreamResponse = await mistralClient.chatStream(prompt);

    // Stream back chatStreamResponse 
    for await (const event of chatStreamResponse) {
      res.write(JSON.stringify(event));
    }

    res.end();
  } catch (error) {
    console.log(error);

    throw new Error("Service Unavailable.");
  }
});

export { app };
