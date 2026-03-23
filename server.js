const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// This is your Backend "Route"
app.post('/contact', (req, res) => {
    const { name, email, message } = req.body;
    console.log("New Message Received:", name, email, message);
    
    // In a professional project, you'd save this to a database like MongoDB here.
    // For now, we return a success response to the Frontend.
    res.status(200).json({ message: "Data received by the Node.js Backend!" });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});