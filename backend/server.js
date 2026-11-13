const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Welcome to KLYRO",
        platform: "Smart Team Collaboration Platform"
    });
});

app.get("/api/health", (req, res) => {
    res.status(200).json({
        success: true,
        status: "Healthy"
    });
});

app.listen(PORT, () => {
    console.log(`KLYRO Server running on port ${PORT}`);
});