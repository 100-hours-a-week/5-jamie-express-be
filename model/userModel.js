const db = require("../config/mysql.js");
const conn = db.init();

const createUser = ({ email, password, nickname, profile_image }, callback) => {
    console.log("============ [USER] CREATE user");

    if (!conn) {
        console.error("[USER] CREATE user: DB connection error");
        return { status: 500 };
    }

    const sql = `INSERT INTO Users (email, password, nickname, profileImage, createdAt)
                VALUES (?, ?, ?, ?, NOW())`;

    conn.query(sql, [email, password, nickname, profile_image.path], function (err, result) {
        if (err) {
            console.error("[USER] CREATE user: ", err);
            return callback({ status: 401 });
        } else {
            console.log("[USER] CREATE user: ", result);

            conn.query(
                `SELECT id
                        FROM Users
                        WHERE email = ?`,
                [email],
                function (err, result) {
                    console.log("[USER] CREATE user: ", result);
                    return callback({ status: 200, user_id: result[0].id });
                }
            );
        }
    });
};

const checkEmail = (email, callback) => {
    console.log("============ [USER] CHECK email");

    if (!conn) {
        console.error("[USER] CHECK email: DB connection error");
        return { status: 500 };
    }

    const sql = `SELECT email, id
                FROM Users
                WHERE email = ?`;

    conn.query(sql, [email], function (err, result) {
        if (err) {
            console.error("[USER] CHECK email: ", err);
            return callback({ status: 401 });
        } else {
            console.log("[USER] CHECK email: ", result);
            if (result.length > 0) {
                return callback({ status: 401 });
            } else {
                return callback({ status: 200 });
            }
        }
    });
};

const checkNickname = (nickname, callback) => {
    console.log("============ [USER] CHECK nickname");

    if (!conn) {
        console.error("[USER] CHECK nickname: DB connection error");
        return { status: 500 };
    }

    const sql = `SELECT nickname, id
                FROM Users
                WHERE nickname = ?`;

    conn.query(sql, [nickname], function (err, result) {
        if (err) {
            console.error("[USER] CHECK nickname: ", err);
            return callback({ status: 401 });
        } else {
            console.log("[USER] CHECK nickname: ", result);
            if (result.length > 0) {
                return callback({ status: 401 });
            } else {
                return callback({ status: 200 });
            }
        }
    });
};

const checkUser = ({ email, password }, callback) => {
    console.log("============ [USER] CHECK user");

    if (!conn) {
        console.error("[USER] CHECK user: DB connection error");
        return { status: 500 };
    }

    const sql = `SELECT * 
                FROM Users 
                WHERE email = ? AND password = ?
                LIMIT 1
                `;

    conn.query(sql, [email, password], function (err, result) {
        if (err) {
            console.error("[USER] CHECK user: ", err);
            return callback({ status: 500 });
        } else if (result.length === 0) {
            console.log("[USER] CHECK user: ", result);
            return callback({ status: 401 });
        } else {
            console.log("[USER] CHECK user: ", result);
            return callback({ status: 200, user_id: result[0].id });
        }
    });
};

const getUserById = (user_id, callback) => {
    console.log("============ [USER] GET user by id");

    if (!conn) {
        console.error("[USER] GET user by id: DB connection error");
        return { status: 500 };
    }

    const sql = `SELECT id, email, nickname, profileImage, createdAt
                FROM Users
                WHERE id = ?
                LIMIT 1`;

    conn.query(sql, [user_id], function (err, result) {
        if (err) {
            console.error("[USER] GET user by id: ", err);
            return callback({ status: 401 });
        } else {
            console.log("[USER] GET user by id: ", result);
            return callback({ status: 200, userInfo: result[0] });
        }
    });
};

const updateUser = ({ user_id, profile_image, nickname }, callback) => {
    console.log("============ [USER] UPDATE user");

    if (!conn) {
        console.error("[USER] UPDATE user: DB connection error");
    }

    let sql = `UPDATE Users SET `;
    const updates = [];
    const params = [];

    if (profile_image !== undefined) {
        updates.push("profile_image = ?");
        params.push(profile_image);
    }

    if (nickname !== undefined) {
        updates.push("nickname = ?");
        params.push(nickname);
    }

    sql += updates.join(", ");
    sql += " WHERE id = ? LIMIT 1";
    params.push(user_id);

    conn.query(sql, [params], function (err, result) {
        if (err) {
            console.error("[USER] UPDATE user: ", err);
            return callback({ status: 400 });
        } else {
            console.log("[USER] UPDATE user: ", result);
            return callback({ status: 200, updatedUser: result });
        }
    });
};

const updateUserPassword = ({ user_id, password }) => {
    console.log("============ [USER] UPDATE user password");

    if (!conn) {
        console.error("[USER] UPDATE user password: DB connection error");
    }

    const sql = `UPDATE Users SET password = ? WHERE id = ? LIMIT 1`;

    conn.query(sql, [password, user_id], function (err, result) {
        if (err) {
            console.error("[USER] UPDATE user password: ", err);
            return callback({ status: 400 });
        } else {
            console.log("[USER] UPDATE user password: ", result);

            const sql = `SELECT id, email, nickname, profileImage, createdAt
                        FROM Users
                        WHERE id = ?
                        LIMIT 1`;

            conn.query(sql, [user_id], function (err, result) {
                console.log("[USER] UPDATE user password: ", result);
                return callback({ status: 200, updatedUser: result[0] });
            });
        }
    });
};

const deleteUser = (user_id) => {
    console.log("============ [USER] DELETE user");

    if (!conn) {
        console.error("[USER] DELETE user: DB connection error");
    }

    const sql = `START TRANSACTION;
                DELETE FROM Users WHERE id = ?;
                DELETE FROM Posts WHERE user_id = ?;
                DELETE FROM Comments WHERE user_id = ?;
                COMMIT;`;

    conn.query(sql, [user_id], function (err, result) {
        if (err) {
            console.error("[USER] DELETE user: ", err);
            return { status: 400 };
        } else {
            console.log("[USER] DELETE user: ", result);
            return { status: 200 };
        }
    });
};

module.exports = {
    createUser,
    checkEmail,
    checkNickname,
    checkUser,
    getUserById,
    updateUser,
    updateUserPassword,
    deleteUser,
};
