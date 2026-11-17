const express = require("express");
const router = express.Router();

const {
    createTeam,
    getMyTeams,
    getTeamById,
    updateTeam,
    addMember,
    removeMember,
    deleteTeam
} = require("../controllers/teamController");

const { protect } = require("../middleware/auth");

router.post("/", protect, createTeam);

router.get("/my", protect, getMyTeams);

router.get("/:id", protect, getTeamById);

router.put("/:id", protect, updateTeam);

router.post("/:id/members", protect, addMember);

router.delete("/:id/members", protect, removeMember);

router.delete("/:id", protect, deleteTeam);

module.exports = router;