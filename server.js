const express = require('express');
const path = require('path');
const cors = require('cors');
const MockProviderA = require('./providers/MockProviderA');
const MockProviderB = require('./providers/MockProviderB');
const EmailService = require('./services/EmailService');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const providers = [new MockProviderA(), new MockProviderB()];
const emailService = new EmailService(providers);

app.post('/send-email', async (req, res) => {
  const { to, subject, body } = req.body;
  const success = await emailService.sendEmail(to, subject, body);
  const message = success ? '✅ Email sent successfully!' : '❌ Email sending failed.';
  res.json({ message, log: emailService.getStatusLog() });
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
