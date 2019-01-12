const util = require("util");
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("bbs.db");

db.run(
  `CREATE TABLE IF NOT EXISTS posts(
    post_id INTEGER PRIMARY KEY AUTOINCREMENT,
    message STRING,
    user STIRNG,
    reply_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
);

db.run(
  `CREATE TABLE IF NOT EXISTS replies(
    reply_id INTEGER PRIMARY KEY AUTOINCREMENT,
    post_id INTEGER,
    message STRING,
    user STIRNG,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`
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
      "SELECT post_id, message, reply_count, created_at FROM posts ORDER BY post_id DESC LIMIT ? OFFSET ?",
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
      "SELECT message, created_at FROM replies WHERE post_id=?  ORDER BY reply_id DESC LIMIT ? OFFSET ?",
      [post_id, limit, offset]
    );
  } catch (error) {
    console.log(error);
    return [];
  }
};

module.exports = {
  addPost,
  addReply,
  getPosts,
  getReplies
};
