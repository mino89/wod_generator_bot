module.exports = function() {
  require("dotenv").config();
  const port = process.env.PORT || 3000;
  const sqlite3 = require("sqlite3").verbose();
  const db = new sqlite3.Database("./db.sqlite");
  const express = require("express");
  const wakeUpDyno = require("./wokeDyno.js"); // my module!
  const apiurl = process.env.API_ENDPOINT;

  const app = express();
  app.get("/", function(req, res) {
    db.serialize(function() {
      db.each("SELECT content FROM wod  ORDER BY RANDOM() LIMIT 1", function(
        err,
        row
      ) {
        res.json({ content: row.content });
      });
    });
  });

  app.get("/:string", function(req, res) {
    db.serialize(function() {
      db.each(
        `SELECT content FROM wod WHERE content LIKE '%${req.params.string}%' ORDER BY RANDOM() LIMIT 1`,
        function(err, row) {
          res.json({ content: row.content });
        }
      );
    });
  });
  app.listen(port,()=>{
    wakeUpDyno(apiurl)
  })
};
