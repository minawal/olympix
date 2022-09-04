const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");
const { upload } = require("../middleware/uploadMiddleware");

const { 
    getUser,
    getUserEvents, 
    registerUser, 
    loginUser, 
    updateUser, 
    deleteUser, 
    getUserByEmail,
    updateUserPassword,
    uploadUserImg 
} = require("../controllers/userController");

router.get("/:id", protect, getUser);

router.get("/events/:id", protect, getUserEvents);

router.post("/register", registerUser);

router.post("/login", loginUser);

router.patch("/:id", protect, updateUser);

router.delete("/:id", protect, deleteUser);

router.get("/checkemail/:email", protect, getUserByEmail);

router.patch("/password/:id", protect, updateUserPassword);

router.patch("/upload/:id", upload.single("userImage"), uploadUserImg);

module.exports = router;