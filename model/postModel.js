const db = require("../config/mysql.js");
const conn = db.init();

const getPosts = (page, limit, callback) => {
    console.log("============ [POST] GET posts");

    if (!conn) {
        console.error("[POST] GET posts: DB connection error");
        return callback({ status: 500 });
    }

    const sql = `SELECT Posts.*, Users.nickname, Users.profileImage
                FROM Posts
                LEFT JOIN Users ON Posts.userId = Users.id
                WHERE Posts.isActive = 1
                ORDER BY Posts.id DESC
                `;

    conn.query(sql, function (err, result) {
        if (err) {
            console.error("[POST] GET posts: ", err);
            return callback({ status: 401 });
        } else {
            const startIndex = (page - 1) * limit;
            const endIndex = page * limit;
            const paginatedPosts = result.slice(startIndex, endIndex);

            console.log(`[POST] GET posts from ${startIndex} to ${endIndex}`);
            return callback({
                status: 200,
                posts: paginatedPosts,
            });
        }
    });
};

const getPostById = (post_id, callback) => {
    console.log("============ [POST] GET post by id");

    if (!conn) {
        console.error("[POST] GET post by id: DB connection error");
        return { status: 500 };
    }

    const sql = `SELECT Posts.*,
                        Users.nickname, 
                        Users.profileImage, 
                        Comments.id AS commentId, 
                        Comments.userId AS commentUserId, 
                        Comments.content AS commentContent, 
                        Comments.createdAt AS commentCreatedAt,
                        Comments.updatedAt AS commentUpdatedAt
                FROM Posts 
                JOIN Users ON Posts.userId = Users.id 
                LEFT JOIN Comments ON Posts.id = Comments.postId 
                WHERE Posts.id = ? AND Posts.isActive = 1`;

    let post;
    conn.query(sql, [post_id], function (err, result) {
        if (err) {
            console.error("[POST] GET post by id: ", err);
            return callback({ status: 404 });
        } else {
            console.log("[POST] GET post by id: ", result);
            post = result[0];

            const updateSql = `UPDATE Posts SET hits = hits + 1 WHERE id = ?`;
            conn.query(updateSql, [post_id], function (err, result) {
                if (err) {
                    console.error("[POST] UPDATE post hits: ", err);
                    return callback({ status: 401 });
                } else {
                    console.log("[POST] UPDATE post hits: ", result);
                    return callback({ status: 200, post: post });
                }
            });
        }
    });
};

const createPost = ({ user_id, title, content, image }, callback) => {
    console.log("============ [POST] CREATE post");

    if (!conn) {
        console.error("[POST] CREATE post: DB connection error");
        return callback({ status: 500 });
    }

    if (!title || !content || !user_id) {
        return callback({ status: 400 });
    }

    const sql = `INSERT INTO Posts (title, content, image, userId, createdAt)
                VALUES (?, ?, ?, ?, now())`;

    conn.query(sql, [title, content, image, parseInt(user_id)], function (err, result) {
        if (err) {
            console.error("[POST] CREATE post: ", err);
            return callback({ status: 400 });
        } else {
            console.log("[POST] CREATE post: ", result);
            return callback({ status: 200, post_id: result.insertId });
        }
    });
};

const updatePost = ({ user_id, post_id, title, content, image }, callback) => {
    console.log("============ [POST] UPDATE post");

    if (!conn) {
        console.error("[POST] UPDATE post: DB connection error");
        return callback({ status: 500 });
    }

    let sql = `UPDATE Posts SET `;
    const updates = [];
    const params = [];

    if (title !== undefined) {
        updates.push("title = ?");
        params.push(title);
    }
    if (content !== undefined) {
        updates.push("content = ?");
        params.push(content);
    }
    if (image !== undefined) {
        updates.push("image = ?");
        params.push(image.path);
    }

    sql += updates.join(", ");
    sql += `, updatedAt = now() 
            WHERE id = ?`;
    params.push(post_id);

    conn.query(sql, params, function (err, result) {
        if (err) {
            console.error("[POST] UPDATE post: ", err);
            return callback({ status: 400 });
        } else {
            console.log("[POST] UPDATE post: ", result);
            return callback({ status: 200, post_updated_id: post_id });
        }
    });
};

const deletePost = ({ user_id, post_id }, callback) => {
    console.log("============ [POST] DELETE post");

    if (!conn) {
        console.error("[POST] DELETE post: DB connection error");
        return callback({ status: 500 });
    }

    const sql = `DELETE FROM Posts WHERE id = ? AND userId = ?`;

    conn.query(sql, [post_id, user_id], function (err, result) {
        if (err) {
            console.error("[POST] DELETE post: ", err);
            return callback({ status: 400 });
        } else {
            console.log("[POST] DELETE post: ", result);
            return callback({ status: 200, post_deleted_id: post_id });
        }
    });
};

// ===== EXPORT =====

module.exports = {
    getPosts,
    getPostById,
    createPost,
    updatePost,
    deletePost,
};
