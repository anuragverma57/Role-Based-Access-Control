const express = require("express");
const {
    getAllUsers,
    getUserById,
    changeRole,
    getProfile,
    updateUserProfile,
    changeUserStatus,
    banUser,
    unbanUser,
    getUsersStats
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const roleCheck = require("../middlewares/roleMiddleware");

const router = express.Router();

// Route for getting the current user's profile (accessible by all authenticated users)
router.get("/profile", protect, getProfile);
router.patch("/update-profile", protect, updateUserProfile);
router.patch("/status-change", protect, roleCheck(['admin', 'moderator', 'user']), changeUserStatus);



router.get("/", protect, roleCheck(["admin", "moderator"]), getAllUsers);
router.get("/stats", protect, roleCheck(['moderator', 'admin']), getUsersStats);
router.get("/:id", protect, roleCheck(["admin", "moderator"]), getUserById);


router.patch("/change-role", protect, roleCheck(["admin"]), changeRole);
router.patch("/:id/ban", protect, roleCheck(['admin']), banUser);
router.patch("/:id/unban", protect, roleCheck(['admin']), unbanUser);


module.exports = router;
