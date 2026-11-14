const User = require("../models/Users");

// GET LOGGED-IN USER PROFILE
exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
            .select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// GET ALL USERS
exports.getUsers = async (req, res) => {
    try {
        const users = await User.find()
            .select("-password")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// UPDATE USER PROFILE
exports.updateUser = async (req, res) => {
    try {
        const { name, email, avatar, role } = req.body;

        const userId = req.params.id;

        // Only admins can update other users
        const isAdmin = req.user.role === "admin";
        const isOwnProfile = req.user._id.toString() === userId;

        if (!isAdmin && !isOwnProfile) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to update this profile"
            });
        }

        const updateData = {};

        if (name !== undefined) updateData.name = name;
        if (email !== undefined) updateData.email = email;
        if (avatar !== undefined) updateData.avatar = avatar;

        // Only admins can change roles
        if (role !== undefined && isAdmin) {
            updateData.role = role;
        }

        const user = await User.findByIdAndUpdate(
            userId,
            updateData,
            {
                new: true,
                runValidators: true
            }
        ).select("-password");

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "User updated successfully",
            user
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// DELETE USER
exports.deleteUser = async (req, res) => {
    try {
        // Only admins can delete users
        if (req.user.role !== "admin") {
            return res.status(403).json({
                success: false,
                message: "Only admins can delete users"
            });
        }

        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        // Prevent admin from deleting their own account
        if (user._id.toString() === req.user._id.toString()) {
            return res.status(400).json({
                success: false,
                message: "You cannot delete your own account"
            });
        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            success: true,
            message: "User deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};