require("dotenv").config();

const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("./db.sqlite");
const express = require("express");
const app = express();
const Telegraf = require("telegraf");
const bot = new Telegraf(process.env.TELEGRAM_KEY);
const axios = require("axios");
const port = process.env.PORT || 3000;
const apiurl = process.env.API_ENDPOINT

app.get("/", function(req, res) {
  db.serialize(function() {
    db.each("SELECT content FROM wod  ORDER BY RANDOM() LIMIT 1", function(
      err,
      row
    ) {
      res.send(row.content);
    });
  });
});

app.get("/:string", function(req, res) {
  db.serialize(function() {
    db.each(
      `SELECT content FROM wod WHERE content LIKE '%${req.params.string}%' ORDER BY RANDOM() LIMIT 1`,
      function(err, row) {
        res.send(row.content);
      }
    );
  });
});

bot.start(message => {
  console.log("started:", message.from.id);
  return message.replyWithMarkdown(
    "*Hello crossfitter* 🏋️‍♀️🤸‍♀️🏃‍♀️ start typing _generate_ or _genera_ or _random_ and you will get a wod or just write your favorite exercise ed. thruster and watch the magic!"
  );
});

bot.hears(/\b(?:genera|generate|create|random)\b/, message => {
  axios
    .get(`${apiurl}`)
    .then(res => {
      const data = res.data;

      return message.reply(data);
    })
    .catch(err => {
      console.log(err);
      return message.reply(
        "try to another search (in english) or contact me at:pierdomenicoreitano@gmail.com"
      );
    });
});

bot.on("text", message => {
  const substr = message.message.text;
  axios
    .get(`${apiurl}${substr}`)
    .then(res => {
      const data = res.data;

      return message.reply(data);
    })
    .catch(err => {
      console.log(err);
      return message.reply(
        "try to another search (in english) or contact me at:pierdomenicoreitano@gmail.com"
      );
    });
});

bot.message;

bot.startPolling();
app.listen(port)