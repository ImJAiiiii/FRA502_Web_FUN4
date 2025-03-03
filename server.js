const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const PORT = 3000;

app.use(express.json()); // ให้ Express อ่าน JSON
app.use(cors()); // อนุญาตให้ Frontend เรียก API ได้

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "imjai464",
    database: "counterDB",
    port: 3306
});

db.connect(err => {
    if (err) {
        console.error("Database connection failed: ", err);
        return;
    }
    console.log("MySQL Connected...");
});

// API บันทึกค่าการนับลง MySQL
app.post("/save", (req, res) => {
    const { male, female } = req.body;
    const total = male + female;
    
    const query = "INSERT INTO logs (male_count, female_count, total_count) VALUES (?, ?, ?)";
    
    db.query(query, [male, female, total], (err, result) => {
        if (err) {
            console.error("Error saving log:", err);
            return res.status(500).json({ error: "Failed to save log" });
        }
        console.log("Log saved successfully");
        res.json({ message: "Saved successfully", total });
    });
});

// API ลบข้อมูลทั้งหมด
app.post("/reset", (req, res) => {
    const query = "DELETE FROM logs";  // ลบข้อมูลทั้งหมดในตาราง logs

    db.query(query, (err, result) => {
        if (err) {
            console.error("Error resetting logs:", err);
            return res.status(500).json({ error: "Failed to reset logs" });
        }
        console.log("Logs reset successfully");
        res.json({ message: "Logs reset successfully" });
    });
});

// API ดึงข้อมูล Logs ทั้งหมด
app.get("/logs", (req, res) => {
    const query = "SELECT * FROM logs ORDER BY timestamp DESC";

    db.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching data:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// API ดึง Logs ตามช่วงเวลา
app.get("/logs/filter", (req, res) => {
    let { startDate, endDate } = req.query;

    if (!startDate || !endDate) {
        return res.status(400).json({ error: "Missing startDate or endDate" });
    }

    console.log("Received filter request (from UI - UTC):", startDate, endDate);

    // ใช้ MySQL `DATE_ADD()` เพื่อแปลงจาก UTC → GMT+7 ก่อน Query
    const query = `
        SELECT * FROM logs 
        WHERE timestamp BETWEEN DATE_ADD(?, INTERVAL 7 HOUR) AND DATE_ADD(?, INTERVAL 7 HOUR) 
        ORDER BY timestamp DESC;
    `;

    db.query(query, [startDate, endDate], (err, results) => {
        if (err) {
            console.error("Error fetching filtered logs:", err);
            return res.status(500).json([]);
        }
        console.log("✅ Filtered logs from MySQL:", results);
        res.json(results || []);
    });
});


// รันเซิร์ฟเวอร์
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
