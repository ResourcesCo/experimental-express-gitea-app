require("./loadEnv");
const express = require("express");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const initPassport = require("./initPassport");
const { Pool, Client } = require("pg");
const users = require("./users");
const tokens = require("./tokens");

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const app = express();

app.use(morgan("tiny"));

app.use(bodyParser.json());

initPassport(app, db);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.post("/login", (req, res) => {
  let userId;
  users
    .getLoginToken(db, { token: req.body.token })
    .then((token) => {
      if (token && token.active && new Date() < token.expires_at) {
        userId = token.user_id;
        return users.createUserSession(db, { userId });
      } else {
        throw new Error("Invalid token");
      }
    })
    .then(({ id: sessionId }) => {
      res.send(tokens.makeTokens({ userId, sessionId }));
    })
    .catch((err) => {
      console.error(err);
      res.status(422).send({ error: "Invalid token" });
    });
});

app.listen(process.env.PORT, () => {
  console.log(`Example app listening at http://localhost:${process.env.PORT}`);
});
