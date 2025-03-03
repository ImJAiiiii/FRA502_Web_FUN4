-- สร้างฐานข้อมูลใหม่
CREATE DATABASE IF NOT EXISTS counterDB;
USE counterDB;

-- สร้างตาราง logs เพื่อเก็บข้อมูลการนับ
CREATE TABLE logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    male_count INT NOT NULL,
    female_count INT NOT NULL,
    total_count INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- แสดงข้อมูลที่บันทึกไว้
SELECT * FROM logs;
