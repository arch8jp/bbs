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
  post_id INTEGER PRIMARY KEY AUTOINCREMENT,
  message STRING,
  user STIRNG,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT (DATETIME('now','localtime')))`
);

db.run(
  `CREATE TABLE IF NOT EXISTS replies(
  reply_id INTEGER PRIMARY KEY AUTOINCREMENT,
  post_id INTEGER,
  message STRING,
  user STIRNG,
  created_at TIMESTAMP DEFAULT (DATETIME('now','localtime')))`
);

const dbAll = util.promisify((sql, arg, callback) =>
  db.all(sql, arg, callback)
);

const dbRun = util.promisify((sql, arg, callback) =>
  db.run(sql, arg, callback)
);

const addPost = message =>
  dbRun("INSERT INTO posts(message) VALUES(?)", [String(message)]);

const addReply = (post_id, message) => {
  dbRun("INSERT INTO replies(post_id, message) VALUES(?, ?)", [
    post_id,
    String(message)
  ]);
  dbRun("UPDATE posts SET reply_count=reply_count+1 WHERE post_id=?", [
    post_id
  ]);
};

const getPosts = async (limit, offset) => {
  try {
    return await dbAll(
      "SELECT post_id, message, reply_count, created_at FROM posts LIMIT ? OFFSET ?",
      [limit, offset]
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

const getReplies = async (post_id, limit, offset) => {
  try {
    return await dbAll(
      "SELECT message, created_at FROM replies WHERE post_id=? LIMIT ? OFFSET ?",
      [post_id, limit, offset]
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

const GET_LIMIT = 10;

app.set("port", port);

app.use(bodyParser.json());

app.get("/", async (req, res, next) => {
  const posts = await getPosts(GET_LIMIT, 0);
  res.data = { posts };
  next();
});

app.get("/posts", async (req, res) => {
  const offset = req.query.offset || 0;
  const limit = req.query.limit || GET_LIMIT;
  const posts = await getPosts(limit, offset);
  res.json({ posts });
  res.end();
});

app.get("/replies", async (req, res) => {
  const limit = req.query.limit || GET_LIMIT;
  const offset = req.query.offset || 0;
  const replies = await getReplies(req.query.post_id, limit, offset);
  res.json({ replies });
  res.end();
});

app.post("/", (req, res) => {
  addPost(req.body.message);
  res.end();
});

app.post("/reply", (req, res) => {
  addReply(req.body.post_id, req.body.message);
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
