const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

const FILE_PATH = "counter_logs.json";

// โหลดข้อมูล
const loadData = () => {
    try {
        return JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
    } catch (error) {
        return [];
    }
};

// บันทึกข้อมูล
const saveData = (data) => {
    fs.writeFileSync(FILE_PATH, JSON.stringify(data, null, 2));
};

// ดึง Logs ทั้งหมด
app.get("/logs", (req, res) => {
    res.json(loadData());
});
app.get("/", (req, res) => {
    res.send("Server is running! Use /logs to see data.");
});

// บันทึกค่า
app.post("/save", (req, res) => {
    const { male, female, total } = req.body;
    if (typeof male === "number" && typeof female === "number" && typeof total === "number") {
        const logs = loadData();
        const timestamp = new Date().toString();
        logs.push({ timestamp, male, female, total });
        saveData(logs);
        res.json({ message: "Saved successfully", logs });
    } else {
        res.status(400).json({ error: "Invalid data" });
    }
});

// ล้าง Logs
app.post("/reset", (req, res) => {
    saveData([]);
    res.json({ message: "Logs reset successfully" });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
