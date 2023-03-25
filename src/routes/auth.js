const Router = require("express");
const User = require("../models/user.model")
const neo = require('../../neo')


const bcryptjs = require("bcryptjs");
const generateTokens = require("../utils/generateToken");
const { signUpBodyValidation, lo, logInBodyValidation } = require("../utils/validationSchema");
const router = Router();

//signup
router.post("/signUp", async (req, res) => {
    try {
        const { error } = signUpBodyValidation(req.body);

        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message })
        }
        const user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ error: true, message: "User with given email already exist" })
        }

        const salt = await bcryptjs.genSalt(Number(process.env.SALT));

        const hashPassword = await bcryptjs.hash(req.body.password, salt);

        await new User({ ...req.body, password: hashPassword }).save();

        // open a neo session
        const session = neo.session()

        // store the purchase in neo
        await session.run(neo.addUser, {
            userName: req.body.userName.toString(),
            email: req.body.email.toString(),
        })

        // close the neo session
        session.close()
        res.status(201).json({ error: false, message: "Account created sucessfully" })
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})

//login
router.post("/logIn", async (req, res) => {
    try {
        const { error } = logInBodyValidation(req.body);
        if (error) {
            return res.status(400).json({ error: true, message: error.details[0].message })
        }
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(401).json({ error: true, message: "Invalid email or password" })
        }

        const verifiedPassword = await bcryptjs.compare(req.body.password, user.password)

        if (!verifiedPassword) {
            return res.status(401).json({ error: true, message: "Invalid email or password" });
        }

        //generate access and refresh token
        const { accessToken, refreshToken } = await generateTokens(user);

        res.status(200).json({
            error: false,
            accessToken,
            refreshToken,
            message: "Logged in sucessfully",
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: true, message: "Internal Server Error" })
    }
})

module.exports = router;