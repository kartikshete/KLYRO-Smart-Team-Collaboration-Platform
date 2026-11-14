const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      required: true
    },

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project"
    },

    content: {
      type: String,
      trim: true,
      default: ""
    },

    messageType: {
      type: String,
      enum: ["Text", "Image", "File"],
      default: "Text"
    },

    attachments: [
      {
        url: {
          type: String
        },
        fileName: {
          type: String
        }
      }
    ],

    isEdited: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Message", messageSchema);