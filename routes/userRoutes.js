const express = require("express");
const {
    getAllUsers,
    getUserById,
    changeRole,
    getProfile,
    updateUserProfile
} = require("../controllers/userController");
const protect = require("../middlewares/authMiddleware");
const roleCheck = require("../middlewares/roleMiddleware");

const router = express.Router();

// Route for getting the current user's profile (accessible by all authenticated users)
router.get("/profile", protect, getProfile);

router.patch("/update-profile", protect, updateUserProfile);

router.get("/", protect, roleCheck(["admin", "moderator"]), getAllUsers);
router.get("/:id", protect, roleCheck(["admin", "moderator"]), getUserById);
router.patch("/change-role", protect, roleCheck(["admin"]), changeRole);

module.exports = router;
