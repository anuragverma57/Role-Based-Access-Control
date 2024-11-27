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

const changeUserStatus = async (req, res) => {
    // const id = req.user._id;
    const { status } = req.body;

    // Check if the status is valid
    if (!['active', 'inactive'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status.' });
    }

    try {
        const user = req.user;
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // // Ensure only the user can change their status
        // if (user._id.toString() !== req.user._id && req.user.role !== 'admin' && req.user.role !== 'moderator') {
        //     return res.status(403).json({ message: 'Unauthorized' });
        // }

        // Change the status
        user.status = status;
        await user.save();
        res.status(200).json({ message: `User status updated to ${status}` });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// (Moderator functionality)
// Get all users
const getAllUsers = async (req, res) => {
    const users = await User.find().select("-password");
    res.status(200).json(users);
};

// Get user by ID
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select("-password");
        if (user) {
            res.status(200).json(user);
        } else {
            res.status(404).json({ message: "User not found" });
        }
    }
    catch (error) {
        console.log("error getUserById : ", error);
        res.status(404).json({ message: "User not found" });
    }
};

// Get all users Stats 
const getUsersStats = async (req, res) => {
    try {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ status: 'active' });
        const inactiveUsers = await User.countDocuments({ status: 'inactive' });
        const bannedUsers = await User.countDocuments({ banned: true });
        const UnbannedUsers = await User.countDocuments({ banned: false });

        res.status(200).json({
            totalUsers,
            activeUsers,
            inactiveUsers,
            bannedUsers,
            UnbannedUsers
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// (Admin only)
// Change role 
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

// Ban a user
const banUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot ban an admin' });
        }

        user.banned = true;
        await user.save();
        res.status(200).json({ message: 'User banned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Unban a user
const unbanUser = async (req, res) => {
    const { id } = req.params;
    try {
        const user = await User.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.role === 'admin') {
            return res.status(400).json({ message: 'Cannot unban an admin' });
        }

        user.banned = false;
        await user.save();
        res.status(200).json({ message: 'User unbanned successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


module.exports = {
    getAllUsers,
    getUserById,
    changeRole,
    getProfile,
    updateUserProfile,
    changeUserStatus,
    banUser,
    unbanUser,
    getUsersStats
};
