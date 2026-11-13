const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.json({
        message: "Welcome to KLYRO Smart Team Collaboration Platform",
        status: "Server Running Successfully"
    });
});

app.listen(PORT, () => {
    console.log(`KLYRO Server running on port ${PORT}`);
});