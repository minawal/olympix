const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const { 
    getEvents, 
    getEvent,
    setEvent, 
    updateEvent, 
    deleteEvent 
} = require("../controllers/eventController");

router.use(protect);

router.get("/:category", getEvents);

router.get("/:category/:id", getEvent);

router.post("/", setEvent);

router.patch("/:id", updateEvent);

router.delete("/:id", deleteEvent);

module.exports = router;