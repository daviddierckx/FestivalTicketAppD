const jwt = require("jsonwebtoken");
const User = require("../models/user.model");
const UserToken = require("../models/userToken");

const generateTokens = async (user) => {
    try {
        const payload = { _id: user.id, roles: user.roles };

        const accessToken = jwt.sign(
            payload,
            process.env.ACCESS_TOKEN_PRIVATE_KEY,
            { expiresIn: "14m" }
        );
        const refreshToken = jwt.sign(
            payload,
            process.env.REFRESH_TOKEN_PRIVATE_KEY,
            { expiresIn: "30d" }
        );

        const userToken = await UserToken.findOne({ userId: user._id });

        if (userToken) await userToken.remove();

        await new UserToken({ userId: user._id, token: refreshToken }).save();
        return Promise.resolve({ accessToken, refreshToken });
    } catch (err) {
        return Promise.reject(err);
    }
};

module.exports = generateTokens;