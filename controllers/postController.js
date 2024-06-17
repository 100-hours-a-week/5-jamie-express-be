const Post = require("../model/postModel.js");

const getPosts = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "로그인 정보 없음" });
        return;
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;

    try {
        Post.getPosts(page, limit, (result) => {
            const { status, posts } = result;

            if (status === 401) {
                res.status(401).json({ message: "게시글 정보 없음" });
            } else if (status === 200) {
                res.status(200).json({
                    posts: posts,
                });
            }
        });
    } catch (error) {
        console.error("게시글 불러오기 에러: ", error);
        res.status(500).send("Internal Server Error");
    }
};

const getPostById = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "로그인 정보 없음" });
        return;
    }

    const { post_id } = req.params;

    try {
        Post.getPostById(post_id, (result) => {
            const { status, post } = result;

            if (status === 404) {
                res.status(404).json({ message: "게시글 정보 없음" });
            } else if (status === 401) {
                res.status(401).json({ message: "조회수 업데이트 실패" });
            } else if (status === 200) {
                const current_user_id = req.session.user.user_id;
                res.status(200).json({ post: post, current_user_id: current_user_id });
            }
        });
    } catch (error) {
        console.error("게시글 불러오기 에러: ", error);
        res.status(500).send("Internal Server Error");
    }
};

const createPost = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "로그인 정보 없음" });
        return;
    }

    const { user_id } = req.session.user;
    const { title, content } = req.body;
    const image = req.file;

    try {
        Post.createPost(
            {
                user_id,
                title,
                content,
                image,
            },
            (result) => {
                const { status, post_id } = result;

                if (status === 400) {
                    res.status(400).json({ message: "누락된 정보가 있습니다." });
                } else if (status === 200) {
                    res.status(200).json({ post_id: post_id });
                }
            }
        );
    } catch (error) {
        console.error("게시글 작성 에러: ", error);
        res.status(500).send("Internal Server Error");
    }
};

const updatePost = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "로그인 정보 없음" });
        return;
    }

    const { user_id } = req.session.user;
    const { post_id } = req.params;
    const { title, content } = req.body;
    const image = req.file;

    try {
        Post.updatePost(
            {
                user_id,
                post_id,
                title,
                content,
                image,
            },
            (result) => {
                const { status, post_updated_id } = result;

                if (status === 404) {
                    res.status(404).json({ message: "게시글 정보 없음" });
                } else if (status === 409) {
                    res.status(409).json({ message: "게시글 수정 권한 없음" });
                } else if (status === 200) {
                    res.status(200).json({ post_id: post_updated_id });
                }
            }
        );
    } catch (error) {
        console.error("게시글 수정 에러: ", error);
        res.status(500).send("Internal Server Error");
    }
};

const deletePost = async (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "로그인 정보 없음" });
        return;
    }

    const { user_id } = req.session.user;
    const { post_id } = req.params;

    try {
        Post.deletePost({ user_id, post_id }, (result) => {
            const { status, post_deleted_id } = result;

            if (status === 404) {
                res.status(404).json({ message: "게시글 정보 없음" });
            } else if (status === 409) {
                res.status(409).json({ message: "게시글 삭제 권한 없음" });
            } else if (status === 200) {
                res.status(200).json({ post_id: post_deleted_id });
            }
        });
    } catch (error) {
        console.error("게시글 삭제 에러: ", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};
