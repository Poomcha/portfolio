import express from "express";
import helmet from "helmet";
import cors from "cors";
import path from "path";

import MistralClient from "./mistral";

const app = express();

const clientPath = path.join(__dirname, "..", "..", "client", "dist");

app.use(express.json());
app.use(express.static(clientPath));

app.use(
  cors({
    origin: [
      `${process.env.CLIENT_SERVER_URL}:${process.env.PORT}`,
      `${process.env.CLIENT_SERVER_URL}:${process.env.CLIENT_SERVER_PORT}`,
    ],
    methods: ["OPTION", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);
app.use(helmet());

app.use("/api/chat", async (req, res) => {
  res.setHeader("Content-Type", "text/plain");
  res.setHeader("Transfer-Encoding", "chunked");

  const { prompt } = req.body;

  const mistralClient = new MistralClient();

  try {
    const chatStreamResponse = await mistralClient.chatStream(prompt);

    // Stream back chatStreamResponse
    for await (const event of chatStreamResponse) {
      res.write(event.data.choices[0].delta.content);
    }

    res.end();
  } catch (error) {
    throw new Error("Service Unavailable.");
  }
});

app.get("/* ", (req, res) => {
  return res.sendFile(path.join(clientPath, "index.html"));
});

export { app };
