import express from "express";
import helmet from "helmet";
import cors from "cors";

import MistralClient from "./mistral";

const app = express();

app.use(express.json());
app.use(
  cors({
    origin: `${process.env.CLIENT_SERVER_URL}:${process.env.CLIENT_SERVER_PORT}`,
    methods: ["OPTION", "POST"],
    allowedHeaders: ["Content-Type"]
  })
);
app.use(helmet());

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
    // console.log(error);

    throw new Error("Service Unavailable.");
  }
});

export { app };
