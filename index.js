const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

app.post('/log', (req, res) => {
  const { user_input, user_id } = req.body;
  const timestamp = new Date().toISOString();

  const logEntry = { user_input, user_id, timestamp };
  const logPath = path.join(__dirname, 'logs.json');

  // 既存のログを読み込み（ファイルがあれば）
  let logs = [];
  if (fs.existsSync(logPath)) {
    const existing = fs.readFileSync(logPath, 'utf8');
    logs = JSON.parse(existing);
  }

  // 新しいログを追加
  logs.push(logEntry);

  // ファイルに保存
  fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));

  console.log(`💬 [${timestamp}] ${user_id}: ${user_input}`);
  res.status(200).json({ message: 'Logged and saved successfully' });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
