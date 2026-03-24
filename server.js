require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    ssl: { minVersion: 'TLSv1.2', rejectUnauthorized: true },
    waitForConnections: true,
    connectionLimit: 10
});

// 1. Get Profile Info
app.get('/api/me', (req, res) => {
    pool.query('SELECT * FROM my_info LIMIT 1', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results[0]);
    });
});

// 2. Get Education (New)
app.get('/api/education', (req, res) => {
    pool.query('SELECT * FROM my_education ORDER BY id DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

// 3. Get Skills (New)
app.get('/api/skills', (req, res) => {
    // Make sure the table name matches exactly what you created in TiDB
    pool.query('SELECT * FROM my_skills', (err, results) => {
        if (err) {
            console.error("Database error:", err); // This will show the error in Render logs
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

// 4. Contact & Admin Routes
app.post('/api/contact', (req, res) => {
    const { name, email, message } = req.body;
    pool.query('INSERT INTO contact_messages (name, email, message) VALUES (?, ?, ?)', [name, email, message], (err) => {
        if (err) return res.status(500).json({ success: false });
        res.json({ success: true });
    });
});

app.get('/api/messages', (req, res) => {
    pool.query('SELECT * FROM contact_messages ORDER BY created_at DESC', (err, results) => {
        if (err) return res.status(500).json(err);
        res.json(results);
    });
});

app.delete('/api/messages/:id', (req, res) => {
    pool.query('DELETE FROM contact_messages WHERE id = ?', [req.params.id], (err) => {
        if (err) return res.status(500).json(err);
        res.json({ success: true });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
