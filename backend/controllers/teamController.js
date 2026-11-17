const Team = require("../models/Team");
const User = require("../models/Users");

// CREATE TEAM
exports.createTeam = async (req, res) => {
    try {
        const { name, description } = req.body;

        if (!name) {
            return res.status(400).json({
                success: false,
                message: "Team name is required"
            });
        }

        const team = await Team.create({
            name,
            description,
            owner: req.user._id,
            members: [req.user._id]
        });

        res.status(201).json({
            success: true,
            message: "Team created successfully",
            team
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET MY TEAMS
exports.getMyTeams = async (req, res) => {
    try {
        const teams = await Team.find({
            members: req.user._id
        })
        .populate("owner", "name email")
        .populate("members", "name email");

        res.status(200).json({
            success: true,
            count: teams.length,
            teams
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET SINGLE TEAM
exports.getTeamById = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id)
            .populate("owner", "name email")
            .populate("members", "name email");

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        const isMember = team.members.some(
            member => member._id.toString() === req.user._id.toString()
        );

        if (!isMember) {
            return res.status(403).json({
                success: false,
                message: "Access denied"
            });
        }

        res.status(200).json({
            success: true,
            team
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE TEAM
exports.updateTeam = async (req, res) => {
    try {
        const { name, description } = req.body;

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        if (team.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only team owner can update team"
            });
        }

        if (name !== undefined) team.name = name;
        if (description !== undefined) {
            team.description = description;
        }

        await team.save();

        res.status(200).json({
            success: true,
            message: "Team updated successfully",
            team
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ADD TEAM MEMBER
exports.addMember = async (req, res) => {
    try {
        const { userId } = req.body;

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        if (team.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only team owner can add members"
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const alreadyMember = team.members.some(
            member => member.toString() === userId
        );

        if (alreadyMember) {
            return res.status(400).json({
                success: false,
                message: "User is already a team member"
            });
        }

        team.members.push(userId);

        await team.save();

        res.status(200).json({
            success: true,
            message: "Member added successfully",
            team
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// REMOVE TEAM MEMBER
exports.removeMember = async (req, res) => {
    try {
        const { userId } = req.body;

        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        if (team.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only team owner can remove members"
            });
        }

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "User ID is required"
            });
        }

        if (team.owner.toString() === userId) {
            return res.status(400).json({
                success: false,
                message: "Team owner cannot be removed"
            });
        }

        team.members = team.members.filter(
            member => member.toString() !== userId
        );

        await team.save();

        res.status(200).json({
            success: true,
            message: "Member removed successfully",
            team
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE TEAM
exports.deleteTeam = async (req, res) => {
    try {
        const team = await Team.findById(req.params.id);

        if (!team) {
            return res.status(404).json({
                success: false,
                message: "Team not found"
            });
        }

        if (team.owner.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "Only team owner can delete team"
            });
        }

        await Team.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "Team deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};