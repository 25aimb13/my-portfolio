require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // <--- ADD THIS LINE HERE
app.use(express.static('.'));

// Replace your old connection code with this
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 10,
    enableKeepAlive: true, 
    keepAliveInitialDelay: 10000
});

// Add a "Ping" to prevent the database from sleeping
setInterval(() => {
    pool.query('SELECT 1');
    console.log('Keeping the connection alive...');
}, 60000);

// Use 'pool' instead of 'connection' for your routes
app.get('/api/me', (req, res) => {
    pool.query('SELECT * FROM my_info LIMIT 1', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
});

app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    const sql = 'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
    pool.query(sql, [name, email, message], (err, result) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});
// Route to get your data
app.get('/api/me', (req, res) => {
    connection.query('SELECT * FROM my_info LIMIT 1', (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results[0]);
    });
});
// Route to handle form submissions
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;

    const sql = 'INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)';
    db.query(sql, [name, email, message], (err, result) => {
        if (err) {
            console.error("Database error:", err);
            return res.status(500).json({ error: "Failed to save message" });
        }
        res.json({ success: true, message: "Message saved to TiDB!" });
    });
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
