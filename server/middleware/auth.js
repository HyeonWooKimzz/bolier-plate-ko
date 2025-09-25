const { User } = require("../models/User");

let auth = async (req, res, next) => {
    try {
        // Client Cookie에서 Token을 가져옴
        let token = req.cookies.x_auth;

        // Token 복호화 및 유저 찾기
        const user = await User.findByToken(token);

        if (!user) {
            return res.json({ isAuth: false, error: true });
        }

        // req에 유저 정보와 토큰 넣기
        req.token = token;
        req.user = user;

        next();
    } catch (err) {
        return res.status(401).json({ isAuth: false, error: err.message });
    }
};

module.exports = { auth };
