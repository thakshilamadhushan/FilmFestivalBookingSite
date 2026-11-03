
import express from "express";
import { httpServerHandler } from "cloudflare:node";

const app = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Backend running on Cloudflare"
  });
});

app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

app.listen(3000);

export default httpServerHandler({ port: 3000 });
