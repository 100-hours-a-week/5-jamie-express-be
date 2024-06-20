const express = require("express");
const router = express.Router();

const CommentController = require("../controllers/commentController.js");

router.post("/:post_id/comment", CommentController.createComment);
router.patch("/:post_id/comment/:comment_id", CommentController.updateComment);
router.delete("/:post_id/comment/:comment_id", CommentController.deleteComment);

module.exports = router;
