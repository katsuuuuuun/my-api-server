const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// ✅ 修正：Renderでも動作しやすいパスに変更
const logPath = path.join('/tmp', 'logs.json');

app.use(cors());
app.use(bodyParser.json());

// POST /log → ログを保存
app.post('/log', (req, res) => {
  const { user_input, user_id } = req.body;
  const timestamp = new Date().toISOString();
  const logEntry = { user_input, user_id, timestamp };

  let logs = [];
  if (fs.existsSync(logPath)) {
    const existing = fs.readFileSync(logPath, 'utf8');
    logs = JSON.parse(existing);
  }

  logs.push(logEntry);
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

  console.log(`💬 [${timestamp}] ${user_id}: ${user_input}`);
  res.status(200).json({ message: 'Logged and saved successfully' });
});

// GET /logs → ログ一覧を取得
app.get('/logs', (req, res) => {
  if (!fs.existsSync(logPath)) {
    return res.status(200).json([]);
  }

  const data = fs.readFileSync(logPath, 'utf8');
  const logs = JSON.parse(data);
  res.status(200).json(logs);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
