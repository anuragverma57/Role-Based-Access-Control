const User = require("../models/userModel");
const bcrypt = require("bcryptjs");

// Get Profile
const getProfile = async (req, res) => {
    try {
        // Get the user ID from the JWT (assumes 'protect' middleware decoded the token)
        const userId = req.user.id;

        // Find the user in the database
        const user = await User.findById(userId).select("-password");  // Excluding password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Return the user's profile
        return res.status(200).json({ user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Server error" });
    }
};

// Get all users
const getAllUsers = async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
};

// Get user by ID
const getUserById = async (req, res) => {
    const user = await User.findById(req.params.id).select("-password");
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({ message: "User not found" });
    }
};

// Change role (Admin only)
const changeRole = async (req, res) => {

    try {
        const { userId, role } = req.body;
        const user = await User.findById(userId);

        if (!user || user.role === "admin") {
            return res.status(400).json({ message: "Cannot modify this user" });
        }

        if (user.role === role) {
            return res.status(200).json({ message: "Already at the same role" });

        }
        user.role = role;
        await user.save();
        res.status(200).json({ message: "Role updated successfully" });
    } catch (error) {
        console.log("error : ", error.message)
        res.status(400).json({ error: error.message });
    }


};


// Update user profile (username, password)
const updateUserProfile = async (req, res) => {
    const { name, password } = req.body;

    if (!name && !password) {
        return res.status(400).json({ message: "Please provide either a new name or password." });
    }

    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the name if provided
        if (name) {
            user.name = name;
        }

        // Update the password if provided
        if (password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt);
        }

        await user.save();
        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getAllUsers, getUserById, changeRole, getProfile, updateUserProfile };
