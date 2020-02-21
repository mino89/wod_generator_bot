module.exports = function() {
  require("dotenv").config();
  const Telegraf = require("telegraf");
  const Extra = require("telegraf/extra");
  const Markup = require("telegraf/markup");
  const bot = new Telegraf(process.env.TELEGRAM_KEY);
  const axios = require("axios");
  const apiurl = process.env.API_ENDPOINT;
  const fetch = require("node-fetch");

  bot.use(Telegraf.log());
  bot.start(message => {
    const header = "<b>Hello Crossfitter! 🏋️‍♀️ 🏃‍♀️ 🤸‍♀️</b>";
    const subtitle = "This is a bot that generates wods!";
    const content =
      "type <em>random, generate, create, etc.</em> if you want a random wod or type es.<em>emom, clean&jerk, amrap 25, row, for time </em> or every skill that comes to your mind, for get a matching wod.";
    const footer = "if you need help type /wod command.";
    return message.replyWithHTML(
      `${header}\n\ ${subtitle}\n\ ${content}\n\ ${footer}`
    );
  });

  bot.command("wod", ({ reply }) =>
    reply(
      "Select an option 🏋️‍♂️",
      Markup.keyboard(["emom", "amrap", "for time", "random"])
        .oneTime()
        .resize()
        .extra()
    )
  );

  bot.hears(
    /\b(?:Genera|genera|Generate|generate|Create|create|random|Random)\b/,
    message => {
      axios
        .get(`${apiurl}wods/random`)
        .then(res => {
          const data = res.data.content;

          return message.reply(data);
        })
        .catch(err => {
          console.log(err);
          return message.reply(
            "sorry but our servers has problems pierdomenicoreitano@gmail.com"
          );
        });
    }
  );

  // bot.on("text", message => {
  //   const substr = message.message.text;
  //   axios
  //     .get(`${apiurl}wods/${substr}`)
  //     .then(res => {
  //       const data = res.data.content;

  //       return message.reply(data);
  //     })
  //     .catch(err => {
  //       console.log(err);
  //       return message.reply(
  //         "🏋️‍♀️ sorry but wie didn't find the exericse"
  //       );
  //     });
  // });

  bot.on("inline_query", async ({ inlineQuery, answerInlineQuery }) => {
    const response = await axios
      .get(`${apiurl}wods/${inlineQuery.query}`)
      .then(res => {
        const data = res.data;
        return data;
      })
      .catch(err => {
        console.log(err);
      });

    const wods = await{
        type: "article",
        id: Date.now(),
        title: 'you are searching for:' + inlineQuery.query,
        description: 'click here to get your wod',
        thumb_url: 'https://www.crossfitteramo.it/wp-content/uploads/2016/02/slider3.jpg',
        input_message_content: {
          message_text: response.content ? response.content : 'we had not fount result'
        }
      };

    return answerInlineQuery([wods]);

  });

  bot.launch();
};
