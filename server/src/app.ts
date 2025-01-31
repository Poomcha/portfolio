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
  const { prompt, stream } = req.body;

  if (stream) {
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");
  } else {
    res.setHeader("Content-Type", "application/json");
  }

  const mistralClient = new MistralClient();

  if (stream) {
    try {
      const chatStreamResponse = await mistralClient.chatStream(prompt);

      // Stream back chatStreamResponse
      for await (const event of chatStreamResponse) {
        res.status(200).write(event.data.choices[0].delta.content);
      }
    } catch (error) {
      console.log(error);

      res.status(500).json(error);
    }
  } else {
    try {
      const chatResponse = await mistralClient.chat(prompt);

      res.status(200).json(JSON.stringify(chatResponse));
    } catch (error) {
      console.error(error);

      res.status(500).json(error);
    }
  }

  res.end();
  return;
});

app.get("/* ", (req, res) => {
  return res.sendFile(path.join(clientPath, "index.html"));
});

export { app };
