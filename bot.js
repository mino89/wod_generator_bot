module.exports = function() {
  require("dotenv").config();
  const Telegraf = require("telegraf");
  const Extra = require("telegraf/extra");
  const Markup = require("telegraf/markup");
  const bot = new Telegraf(process.env.TELEGRAM_KEY);
  const axios = require("axios");
  const apiurl = process.env.API_ENDPOINT;

  bot.use(Telegraf.log());
  bot.start(message => {
    console.log("started:", message.from.id);
    return message.replyWithMarkdown(
      "*Hello crossfitter* 🏋️‍♀️🤸‍♀️🏃‍♀️ start typing _generate_ or _genera_ or _random_ and you will get a wod or just write your favorite exercise ed. thruster and watch the magic!"
    );
  });
  bot.command("help", ({ reply }) =>
    reply(
      "One time keyboard",
      Markup.keyboard(["emom", "amrap", "for time"])
        .oneTime()
        .resize()
        .extra()
    )
  );

  bot.hears(
    /\b(?:Genera|genera|Generate|generate|Create|create|random)\b/,
    message => {
      axios
        .get(apiurl)
        .then(res => {
          const data = res.data.content;

          return message.reply(data);
        })
        .catch(err => {
          console.log(err);
          return message.reply(
            "try to another search (in english) or contact me at:pierdomenicoreitano@gmail.com"
          );
        });
    }
  );

  bot.on("text", message => {
    const substr = message.message.text;
    axios
      .get(apiurl + substr)
      .then(res => {
        const data = res.data.content;

        return message.reply(data);
      })
      .catch(err => {
        console.log(err);
        return message.reply(
          "try to another search (in english) or contact me at:pierdomenicoreitano@gmail.com"
        );
      });
  });

  bot.launch();
};
