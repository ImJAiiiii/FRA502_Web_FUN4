import React, { useState, useEffect } from "react";
import "./CounterApp.css";

const CounterApp = () => {
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);
    const [logs, setLogs] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");


    useEffect(() => {
        fetchLogs();
    }, []);

    const updateCounter = (gender, value) => {
        if (gender === "male") {
            setMaleCount(prev => prev + value);
        } else if (gender === "female") {
            setFemaleCount(prev => prev + value);
        }
    };

    async function save() {
        const response = await fetch("http://localhost:3000/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ male: maleCount, female: femaleCount })
        });
    
        const data = await response.json();
        
        if (data.message) {
            const currentTime = new Date().toLocaleString("en-GB", { timeZone: "Asia/Bangkok" });
            console.log(`Log saved successfully at ${currentTime}`);
        }
        
        // รีเซ็ตค่า Counter เป็น 0
        setMaleCount(0);
        setFemaleCount(0);
    }
       
    async function reset() {
        const response = await fetch("http://localhost:3000/reset", {
            method: "POST"
        });
    
        const data = await response.json();
        console.log(data.message); // ดูว่าได้ข้อความตอบกลับ "Logs reset successfully" หรือไม่
        fetchLogs();  // รีเฟรช logs หลังจากรีเซ็ต
    }
     
    
    const fetchLogs = async () => {
        if (!startDate || !endDate) {
            alert("Please select both start and end date.");
            return;
        }
    
        console.log("Raw startDate:", startDate);
        console.log("Raw endDate:", endDate);
    
        // แปลงเป็น GMT+7
        const localStartDate = new Date(startDate);
        localStartDate.setHours(localStartDate.getHours() + 7); // เพิ่ม 7 ชั่วโมง
    
        const localEndDate = new Date(endDate);
        localEndDate.setHours(localEndDate.getHours() + 7); // เพิ่ม 7 ชั่วโมง
    
        const formattedStartDate = localStartDate.toISOString().slice(0, 19).replace("T", " ");
        const formattedEndDate = localEndDate.toISOString().slice(0, 19).replace("T", " ");
    
        console.log("Formatted GMT+7 startDate (Sent to API):", formattedStartDate);
        console.log("Formatted GMT+7 endDate (Sent to API):", formattedEndDate);
    
        const response = await fetch(`http://localhost:3000/logs/filter?startDate=${formattedStartDate}&endDate=${formattedEndDate}`);
        const logs = await response.json();
    
        console.log("Logs received from API:", logs);
        
        setLogs(logs);
    };
    
    
    
    
    return (
        <div>
            <h1>Counter User</h1>
            <div className="counter-container">
                <div className="counter-box male-box">
                    <h2 className="male-text">Man</h2>
                    <div className="counter">{maleCount}</div>
                    <button className="btn-up" onClick={() => updateCounter("male", 1)}>UP</button>
                    <button className="btn-down" onClick={() => updateCounter("male", -1)}>DOWN</button>
                </div>
                <div className="counter-box female-box">
                    <h2 className="female-text">Woman</h2>
                    <div className="counter">{femaleCount}</div>
                    <button className="btn-up" onClick={() => updateCounter("female", 1)}>UP</button>
                    <button className="btn-down" onClick={() => updateCounter("female", -1)}>DOWN</button>
                </div>
            </div>

            <div className="button-container">
                <button className="btn-save" onClick={save}>Save</button>
                <button className="btn-reset" onClick={reset}>Reset</button>
            </div>

            <h2>Filter Logs</h2>
            <div className="filter-container">
                <label>Start Date & Time:</label>
                <input type="datetime-local" onChange={(e) => setStartDate(e.target.value)} />

                <label>End Date & Time:</label>
                <input type="datetime-local" onChange={(e) => setEndDate(e.target.value)} />

                <button className="btn-filter" onClick={fetchLogs}>Filter Logs</button>
            </div>

            <h2>Saved Logs</h2>
            <div className="logs-container">
                {logs && logs.length > 0 ? (
                    logs.map((log, index) => (
                        <p className="logs" key={index}>
                            [{log.timestamp}]: men {log.male_count} - woman {log.female_count} ➝ total: {log.total_count}
                        </p>
                    ))
                ) : (
                    <p>No logs available</p>
                )}
            </div>
        </div>
    );
};

export default CounterApp;
