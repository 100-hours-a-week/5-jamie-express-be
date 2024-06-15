const User = require("../model/userModel.js");

const signUp = (req, res) => {
    const profile_image = req.file;
    const { email, password, nickname } = req.body;

    try {
        User.createUser(
            {
                email,
                password,
                nickname,
                profile_image,
            },
            (result) => {
                const { status, user_id } = result;

                res.status(200).json({ user_id: user_id });
            }
        );
    } catch (error) {
        console.error("회원가입 에러: ", error);
        return res.status(500).send("Internal Server Error");
    }
};

const signIn = (req, res) => {
    const { email, password } = req.body;

    try {
        User.checkUser({ email, password }, (result) => {
            const { status, user_id } = result;
            console.log(status, user_id);

            if (status === 401) {
                return res.status(401).send("Unauthorized");
            } else if (status === 200) {
                if (!req.session.user) {
                    req.session.user = { user_id: user_id, authorized: true };
                }
                return res.status(200).json({ user_id: user_id });
            } else if (status === 500) {
                return res.status(500).send("Internal Server Error");
            }
        });
    } catch (error) {
        console.error("로그인 에러: ", error);
        return res.status(500).send("Internal Server Error");
    }
};

const signOut = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.error("Session destroy error: ", err);
            return res.status(500).send("Internal Server Error");
        }
        return res.status(200).send("Logout Success");
    });
};

const withdrawal = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "로그인 정보 없음" });
        return;
    }

    const { user_id } = req.session.user;

    try {
        User.deleteUser(user_id, (result) => {
            const { status } = result;

            req.session.destroy((err) => {
                if (err) {
                    console.error("Session destroy error: ", err);
                    return res.status(500).send("Internal Server Error");
                }
                return res.status(200).json({ message: "회원탈퇴 성공" });
            });
        });
    } catch (error) {
        console.error("회원탈퇴 에러: ", error);
        return res.status(500).send("Internal Server Error");
    }
};

const checkDuplication = (req, res) => {
    const email = req.query.email;
    const nickname = req.query.nickname;

    try {
        if (email) {
            User.checkEmail(email, (result) => {
                const { status } = result;

                if (status === 401) {
                    res.status(401).json({ message: `중복된 이메일` });
                } else if (status === 200) {
                    res.status(200).json({ message: `사용 가능한 이메일` });
                }
            });
        } else if (nickname) {
            User.checkNickname(nickname, (result) => {
                const { status } = result;

                if (status === 401) {
                    res.status(401).json({ message: `중복된 닉네임` });
                } else if (status === 200) {
                    res.status(200).json({ message: `사용 가능한 닉네임` });
                }
            });
        }
    } catch (error) {
        console.error(`${name} 중복 체크 에러: `, error);
        return res.status(500).send("Internal Server Error");
    }
};

const getUserById = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "로그인 정보 없음" });
        return;
    }
    const { user_id } = req.session.user;

    try {
        User.getUserById(user_id, (result) => {
            const { status, userInfo } = result;

            if (status === 400) {
                res.status(400).json({ message: "일치하는 유저 정보 없음" });
            } else if (status === 200) {
                res.status(200).json(userInfo);
            }
        });
    } catch (error) {
        console.error("회원정보 불러오기 에러: ", error);
        return res.status(500).send("Internal Server Error");
    }
};

const updateUserInfo = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "로그인 정보 없음" });
        return;
    }

    const { user_id } = req.session.user;
    const profile_image = req.file;
    const { nickname } = req.body;

    try {
        User.updateUser(
            {
                user_id,
                profile_image,
                nickname,
            },
            (result) => {
                const { status, updatedUser } = result;

                if (status === 400) {
                    res.status(400).json({ message: "일치하는 유저 정보 없음" });
                } else if (status === 200) {
                    res.status(200).json(updatedUser);
                }
            }
        );
    } catch (error) {
        console.error("회원정보 업데이트 에러: ", error);
        return res.status(500).send("Internal Server Error");
    }
};

const updateUserPassword = (req, res) => {
    if (!req.session.user) {
        res.status(401).json({ message: "로그인 정보 없음" });
        return;
    }

    const { user_id } = req.session.user;
    const { password } = req.body;

    try {
        User.updateUserPassword({ user_id, password }, (result) => {
            const { status, updatedUser } = result;

            if (status === 400) {
                res.status(400).json({ message: "일치하는 유저 정보 없음" });
            } else if (status === 200) {
                res.status(200).json(updatedUser);
            }
        });
    } catch (error) {
        console.error("회원 비밀번호 업데이트 에러: ", error);
        return res.status(500).send("Internal Server Error");
    }
};

module.exports = {
    signUp,
    signIn,
    signOut,
    checkDuplication,
    getUserById,
    updateUserInfo,
    updateUserPassword,
    withdrawal,
};
