import React, { useState, useEffect } from "react";
import "./CounterApp.css";

const CounterApp = () => {
    const [maleCount, setMaleCount] = useState(0);
    const [femaleCount, setFemaleCount] = useState(0);
    const [logs, setLogs] = useState([]);

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

    const save = async () => {
        const total = maleCount + femaleCount; // คำนวณผลรวม
        const response = await fetch("http://localhost:3000/save", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ male: maleCount, female: femaleCount, total })
        });
        const data = await response.json();
        setLogs(data.logs);
    };

    const reset = async () => {
        setMaleCount(0);
        setFemaleCount(0);
        await fetch("http://localhost:3000/reset", { method: "POST" });
        setLogs([]);
    };

    const fetchLogs = async () => {
        const response = await fetch("http://localhost:3000/logs");
        const logs = await response.json();
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
            <h2>Saved Logs</h2>
            <div className="logs-container">
                {logs.map((log, index) => (
                    <p className="logs" key={index}>
                        [{log.timestamp}]: men {log.male} - woman {log.female} ➝ total: {log.total}
                    </p>
                ))}
            </div>

        </div>
    );
};

export default CounterApp;
