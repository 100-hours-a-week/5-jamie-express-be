const express = require("express");
const path = require("path");
const cors = require("cors");
const app = express();

require("dotenv").config();
const { PORT, SECRET_KEY } = process.env;

const usersRouter = require("./routes/usersRouter");
const postsRouter = require("./routes/postsRouter");

// json 형식의 데이터를 파싱하기 위한 미들웨어
app.use(express.json());
app.use(
    cors({
        origin: "http://localhost:3001",
        credentials: true,
    })
);

// 쿠키, 세션 설정
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(cookieParser());
app.use(
    session({
        secret: SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: {
            httpOnly: true,
            secure: false,
            maxAge: 1000 * 60 * 60, // 1시간
        },
    })
);

// 정적 파일 제공
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// 라우터 등록
app.use("/users", usersRouter);
app.use("/posts", postsRouter);

// listen for requests
app.listen(PORT, () => {
    console.log("==================== BACKEND SERVER START ====================");
    console.log(`Server running on port ${PORT}`);
});
