import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import apiRouter from "./routes/api.js";

dotenv.config();

const server = express();
server.use(cors());
server.use(express.json());

server.get("/ping", (req, res) => res.json({ pong: true }));

server.use(apiRouter);

server.use((req, res) => {
  res.status(404);
  res.json({ error: "Endpoint não encontrado." });
});

const PORTA = process.env.PORT;

server.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
