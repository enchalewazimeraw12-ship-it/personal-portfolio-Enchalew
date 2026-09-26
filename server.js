const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));
app.use('/portfolio', express.static(__dirname));

// Configure email (Gmail)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'enchalewazimeraw12@gmail.com',
        pass: 'YOUR_GMAIL_APP_PASSWORD', // Gmail App Password
    },
});

// API to receive form data and send email
app.post('/send-email', async (req, res) => {
    const { name, email, message } = req.body;

    try {
        await transporter.sendMail({
            from: `"Portfolio Contact" <${email}>`,
            to: 'enchalewazimeraw12@gmail.com',
            subject: '📩 New Portfolio Message',
            html: `
                <h3>New Message Received</h3>
                <p><b>Name:</b> ${name}</p>
                <p><b>Email:</b> ${email}</p>
                <p><b>Message:</b></p>
                <p>${message}</p>
            `,
        });

        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// Serve static files
app.get(['/', '/index.html', '/home.html'], (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get(['/about.html', '/project.html', '/contact.html', '/protofile.html'], (req, res) => {
    const pageName = path.basename(req.path);
    res.sendFile(path.join(__dirname, 'pages', pageName));
});

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.json({});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});