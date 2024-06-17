const express = require("express");
const router = express.Router();

const PostController = require("../controllers/postController.js");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.get("/", PostController.getPosts);
router.get("/:post_id", PostController.getPostById);

router.post("/new", upload.single("image"), PostController.createPost);
router.patch("/:post_id", upload.single("image"), PostController.updatePost);
router.delete("/:post_id", PostController.deletePost);

module.exports = router;
