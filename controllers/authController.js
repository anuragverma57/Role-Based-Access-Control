const { log } = require("console");
const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");
const bcrypt = require("bcryptjs");

// Registering a new user
const register = async (req, res) => {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const user = await User.create({ name, email, password: hashedPassword });
        res.status(201).json({
            message: "User registered successfully",
            userId: user._id,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({ message: "User already exists" });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (user.banned) return res.status(401).json({ message: "Your account is banned. Please contact admin." });
    if (user && (await bcrypt.compare(password, user.password))) {
        res.status(200).json({
            message: "User Logged In successfully",
            id: user._id,
            role: user.role,
            token: generateToken(user._id, user.role),
        });
    } else {
        res.status(401).json({ message: "Invalid email or password" });
    }
};

module.exports = { register, login };
