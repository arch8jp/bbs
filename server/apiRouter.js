const express = require("express");
const router = express.Router();
const { addPost, addReply, getPosts, getReplies } = require("./db");

const GET_LIMIT = 10;

router.get("/", async (req, res, next) => {
  const posts = await getPosts(GET_LIMIT, 0);
  res.data = { posts };
  next();
});

router.get("/posts", async (req, res) => {
  const offset = req.query.offset || 0;
  const limit = req.query.limit || GET_LIMIT;
  const posts = await getPosts(limit, offset);
  res.json({ posts });
  res.end();
});

router.get("/replies", async (req, res) => {
  const limit = req.query.limit || GET_LIMIT;
  const offset = req.query.offset || 0;
  const replies = await getReplies(req.query.post_id, limit, offset);
  res.json({ replies });
  res.end();
});

router.post("/", (req, res) => {
  addPost(req.body.message);
  res.end();
});

router.post("/reply", (req, res) => {
  addReply(req.body.post_id, req.body.message);
  res.end();
});

module.exports = router;
