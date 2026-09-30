const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const frontendDirectory = path.join(__dirname, '..', 'frontend');
const projectsFile = path.join(__dirname, 'data.json');
const profileFile = path.join(__dirname, 'profile.json');
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(frontendDirectory));
app.use('/portfolio', express.static(frontendDirectory));

app.get('/portfolio', (req, res) => {
    res.redirect('/portfolio/');
});
app.get('/api/projects', (req, res) => {
    try {
        const projects = JSON.parse(fs.readFileSync(projectsFile, 'utf8'));
        res.json(projects);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to load projects' });
    }
});

// Configure email (Gmail)
const emailUser = process.env.EMAIL_USER;
const emailPassword = process.env.EMAIL_PASS;
const emailConfigured = Boolean(emailUser && emailPassword);
const contactLogFile = path.join(__dirname, 'contact_submissions.log');
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: emailUser,
        pass: emailPassword,
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

app.post('/api/contact', async (req, res) => {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ success: false, message: 'Invalid email format' });
    }

    try {
        fs.appendFileSync(contactLogFile, JSON.stringify({
            timestamp: new Date().toISOString(),
            name,
            email,
            message,
        }) + '\n');

        if (!emailConfigured) {
            return res.json({
                success: true,
                message: 'Thank you! Your message has been saved. Email delivery is not configured yet.',
            });
        }

        await transporter.sendMail({
            from: emailUser,
            replyTo: email,
            to: emailUser,
            subject: 'New Portfolio Message',
            text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
        });

        res.json({ success: true, message: 'Thank you! Your message has been received.' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to send your message right now.' });
    }
});

// Serve static files
app.get(['/', '/index.html', '/home.html'], (req, res) => {
    res.sendFile(path.join(frontendDirectory, 'index.html'));
});

app.get(['/about.html', '/project.html', '/contact.html', '/protofile.html'], (req, res) => {
    const pageName = path.basename(req.path);
    res.sendFile(path.join(frontendDirectory, 'pages', pageName));
});

app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.json({});
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});

app.get('/api/profile', (req, res) => {
    try {
        const profile = JSON.parse(fs.readFileSync(profileFile, 'utf8'));
        res.json(profile);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Unable to load profile' });
    }
});