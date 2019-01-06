const util = require("util");
const express = require("express");
const bodyParser = require("body-parser");
const consola = require("consola");
const sqlite3 = require("sqlite3").verbose();
const { Nuxt, Builder } = require("nuxt");
const app = express();
const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 3000;

const db = new sqlite3.Database("bbs.db");
db.run(
  `CREATE TABLE IF NOT EXISTS posts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  message STRING,
  user STIRNG)`
);
const dbAll = util.promisify((sql, arg, callback) =>
  db.all(sql, arg, callback)
);
const dbRun = util.promisify((sql, arg, callback) =>
  db.run(sql, arg, callback)
);
const addPost = message =>
  dbRun("INSERT INTO posts(message) VALUES(?)", [message]);

const getPostMessages = async (limit = 100) => {
  try {
    const posts = await dbAll("SELECT id, message FROM posts LIMIT ?", [limit]);
    const messages = posts.map(post => post.message);
    return messages;
  } catch (error) {
    return [];
  }
};
const GET_LIMIT = 100;

app.set("port", port);

app.use(bodyParser.json());

app.get("/", async (req, res, next) => {
  const messages = await getPostMessages(GET_LIMIT);
  res.data = { messages };
  next();
});

app.post("/", (req, res) => {
  addPost(req.body.message);
  res.end();
});

// Import and Set Nuxt.js options
const config = require("../nuxt.config.js");
config.dev = !(process.env.NODE_ENV === "production");

async function start() {
  // Init Nuxt.js
  const nuxt = new Nuxt(config);

  // Build only in dev mode
  if (config.dev) {
    const builder = new Builder(nuxt);
    await builder.build();
  }

  // Give nuxt middleware to express
  app.use(nuxt.render);

  // Listen the server
  app.listen(port, host);
  consola.ready({
    message: `Server listening on http://${host}:${port}`,
    badge: true
  });
}
start();
