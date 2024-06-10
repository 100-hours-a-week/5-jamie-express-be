const fs = require("fs");
const path = require("path");
const getKoreanDateTime = require("../utils/dateFormat.js");

let usersJSON;

const createUser = ({ email, password, nickname, profile_image }) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const lastUserId = usersJSON.length > 0 ? usersJSON[usersJSON.length - 1].user_id : 0;

    const newUser = {
        user_id: lastUserId + 1,
        email: email,
        password: password,
        nickname: nickname,
        profile_image: profile_image,
        created_at: getKoreanDateTime(),
    };
    usersJSON.push(newUser);
    saveUsers();

    console.log("[USER] CREATE user: ", newUser.user_id);
    return newUser.user_id;
};

const checkEmail = (email) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const user = usersJSON.find((user) => user.email === email);
    if (user) {
        return { status: 401 };
    }

    console.log("[USER] CHECK email: ", email);
    return { status: 200 };
};

const checkNickname = (nickname) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const user = usersJSON.find((user) => user.nickname === nickname);
    if (user) {
        return { status: 401 };
    }

    console.log("[USER] CHECK nickname: ", nickname);
    return { status: 200 };
};

const checkUser = ({ email, password }) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const user = usersJSON.find(
        (user) => user.email === email && user.password === password
    );
    if (!user) {
        return { status: 401 };
    }

    console.log("[USER] CHECK user: ", user.user_id);
    return { status: 200, user_id: user.user_id };
};

const getUserById = (user_id) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const user = usersJSON.find((user) => user.user_id === parseInt(user_id));
    if (!user) {
        return { status: 401 };
    }

    console.log("[USER] GET user by id: ", user.user_id);
    return { status: 200, userInfo: user };
};

const updateUser = ({ user_id, profile_image, nickname }) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const userToUpdate = usersJSON.find((user) => user.user_id === parseInt(user_id));
    if (!userToUpdate) {
        return { status: 400 };
    }

    if (profile_image) {
        userToUpdate.profile_image = profile_image;
    }
    if (nickname) {
        userToUpdate.nickname = nickname;
    }
    saveUsers();

    console.log("[USER] UPDATE user: ", userToUpdate);
    return { status: 200, updatedUser: userToUpdate };
};

const updateUserPassword = ({ user_id, password }) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const userToUpdate = usersJSON.find((user) => user.user_id === parseInt(user_id));
    if (!userToUpdate) {
        return { status: 400 };
    }

    userToUpdate.password = password;
    saveUsers();

    console.log("[USER] update user password: ", userToUpdate);
    return { status: 200, updatedUser: userToUpdate };
};

const deleteUser = (user_id) => {
    usersJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "users.json"), "utf-8")
    );

    const userIndex = usersJSON.findIndex((user) => user.user_id === parseInt(user_id));
    if (userIndex === -1) {
        return { status: 400 };
    }

    usersJSON.splice(userIndex, 1);
    saveUsers();
    deleteUserDataById(user_id);

    console.log("[USER] delete user: ", user_id);
    return { status: 200 };
};

// ===== COMMON FUNCTIONS =====

function saveUsers() {
    fs.writeFileSync(
        path.join(__dirname, "../data", "users.json"),
        JSON.stringify(usersJSON)
    );
}

function deleteUserDataById(user_id) {
    const postsJSON = JSON.parse(
        fs.readFileSync(path.join(__dirname, "../data", "posts.json"), "utf-8")
    );
    const filteredPosts = postsJSON.filter((post) => post.user_id !== parseInt(user_id));
    filteredPosts.forEach((post) => {
        post.comments_list = post.comments_list.filter(
            (comment) => comment.user_id !== parseInt(user_id)
        );
    });

    fs.writeFileSync(
        path.join(__dirname, "../data", "posts.json"),
        JSON.stringify(filteredPosts)
    );
}

// ===== EXPORT =====

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
