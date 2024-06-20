const Comment = require("../model/commentModel.js");

const createComment = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "로그인 정보 없음" });
        return;
    }

    const { user_id } = req.session.user;
    const { content } = req.body;
    const { post_id } = req.params;

    try {
        Comment.createComment(
            {
                post_id,
                content,
                user_id,
            },
            (result) => {
                const { status, comment_id } = result;

                if (status === 400) {
                    res.status(400).json({ message: "게시글 정보 없음" });
                } else if (status === 200) {
                    res.status(200).json({ comment_id: comment_id });
                }
            }
        );
    } catch (error) {
        console.error("댓글 작성 에러: ", error);
        res.status(500).send("Internal Server Error");
    }
};

const updateComment = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "로그인 정보 없음" });
        return;
    }

    const { user_id } = req.session.user;
    const { post_id, comment_id } = req.params;
    const { content } = req.body;

    try {
        Comment.updateComment(
            {
                user_id,
                post_id,
                comment_id,
                content,
            },
            (result) => {
                const { status, comment_updated_id } = result;

                if (status === 400) {
                    res.status(400).json({ message: "게시글 또는 댓글 정보 없음" });
                } else if (status === 200) {
                    res.status(200).json({ comment_id: comment_updated_id });
                }
            }
        );
    } catch (error) {
        console.error("댓글 수정 에러: ", error);
        res.status(500).send("Internal Server Error");
    }
};

const deleteComment = async (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "로그인 정보 없음" });
        return;
    }

    const { user_id } = req.session.user;
    const { post_id, comment_id } = req.params;

    try {
        Comment.deleteComment(
            {
                user_id,
                post_id,
                comment_id,
            },
            (result) => {
                const { status, comment_deleted_id } = result;

                if (status === 400) {
                    res.status(400).json({ message: "게시글 정보 없음" });
                } else if (status === 404) {
                    res.status(404).json({ message: "댓글 정보 없음" });
                } else if (status === 409) {
                    res.status(409).json({ message: "댓글 삭제 권한 없음" });
                } else if (status === 200) {
                    res.status(200).json({ comment_id: comment_deleted_id });
                }
            }
        );
    } catch (error) {
        console.error("댓글 삭제 에러: ", error);
        res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    createComment,
    updateComment,
    deleteComment,
};
