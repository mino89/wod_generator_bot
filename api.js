module.exports = function() {
  require("dotenv").config();
  const port = process.env.PORT || 3000;
  const sqlite3 = require("sqlite3").verbose();
  const db = new sqlite3.Database("./db.sqlite");
  const express = require("express");
  const wakeUpDyno = require("./wokeDyno.js"); // my module!
  const apiurl = process.env.API_ENDPOINT;
  const data = [];

  db.serialize(function() {
    db.each("SELECT * FROM wod", function(err, row) {
      if (err) {
        console.log("Getting an error : ", err);
      } else {
        data.push(row);
      }
    });
  });

  db.close();

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  function filterByValue(array, value) {
    return array.filter( (data) =>  { 
      return JSON.stringify(data).toLowerCase().indexOf(value.toLowerCase()) !== -1
    });
  }

  const app = express();

  app.get("/wods/", function(req, res) {
    res.send(data);
  });

  app.get("/wods/random", function(req, res) {
    let index = getRandomInt(0, data.length);
    res.send(data[index]);
  });

  app.get("/wods/:string", function(req, res) {
    let filtered = filterByValue(data, req.params.string)
    let index = getRandomInt(0, filtered.length);
    res.send(filtered[index]);
  });
  app.listen(port, () => {
    wakeUpDyno(apiurl);
  });
};
