const db = require("../config/mysql.js");
const conn = db.init();

const createComment = ({ user_id, post_id, content }, callback) => {
    console.log("============ [COMMENT] CREATE comment");
    if (!conn) {
        console.error("[COMMENT] CREATE comment: DB connection error");
        return callback({ status: 500 });
    }

    const sql = `INSERT INTO Comments (content, userId, postId, createdAt)
                VALUES (?, ?, ?, now())`;

    conn.query(sql, [content, parseInt(user_id), parseInt(post_id)], function (err, result) {
        if (err) {
            console.error("[COMMENT] CREATE comment: ", err);
            return callback({ status: 400 });
        } else {
            console.log("[COMMENT] CREATE comment: ", result);
            return callback({ status: 200, comment_id: result.insertId });
        }
    });
};

const updateComment = ({ user_id, post_id, comment_id, content }, callback) => {
    console.log("============ [COMMENT] UPDATE comment");

    if (!conn) {
        console.error("[COMMENT] UPDATE comment: DB connection error");
        return callback({ status: 500 });
    }

    const sql = `UPDATE Comments
                SET content = ?, updatedAt = now()
                WHERE id = ? AND userId = ? AND postId = ?`;

    console.log("update_form: ", content);
    conn.query(
        sql,
        [content, parseInt(comment_id), parseInt(user_id), parseInt(post_id)],
        function (err, result) {
            if (err) {
                console.error("[COMMENT] UPDATE comment: ", err);
                return callback({ status: 400 });
            } else {
                console.log("[COMMENT] UPDATE comment: ", result);
                return callback({ status: 200, comment_updated_id: comment_id });
            }
        }
    );
};

const deleteComment = ({ user_id, post_id, comment_id }, callback) => {
    console.log("============ [COMMENT] DELETE comment");

    if (!conn) {
        console.error("[COMMENT] DELETE comment: DB connection error");
        return callback({ status: 500 });
    }

    const sql = `UPDATE Comments
                SET isActive = 0, deletedAt = now()
                WHERE id = ? AND userId = ? AND postId = ?`;

    conn.query(
        sql,
        [parseInt(comment_id), parseInt(user_id), parseInt(post_id)],
        function (err, result) {
            if (err) {
                console.error("[COMMENT] DELETE comment: ", err);
                return callback({ status: 400 });
            } else {
                console.log("[COMMENT] DELETE comment: ", result);
                return callback({ status: 200, comment_deleted_id: comment_id });
            }
        }
    );
};

module.exports = {
    createComment,
    updateComment,
    deleteComment,
};
