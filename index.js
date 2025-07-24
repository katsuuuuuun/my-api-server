const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Render対応：/tmpに保存
const logPath = path.join('/tmp', 'logs.json');

app.use(cors());
app.use(bodyParser.json());

// POST /log → ログを保存
app.post('/log', (req, res) => {
  const { user_input, user_id } = req.body;
  const timestamp = new Date().toISOString();
  const logEntry = { user_input, user_id, timestamp };

  let logs = [];

  try {
    if (fs.existsSync(logPath)) {
      const content = fs.readFileSync(logPath, 'utf8');
      logs = content ? JSON.parse(content) : [];
    }
  } catch (error) {
    console.error('🛑 ログ読み込みエラー:', error);
    logs = [];
  }

  logs.push(logEntry);

  try {
    fs.writeFileSync(logPath, JSON.stringify(logs, null, 2));
    console.log(`💬 [${timestamp}] ${user_id}: ${user_input}`);
    res.status(200).json({ message: 'Logged and saved successfully' });
  } catch (error) {
    console.error('🛑 ログ書き込みエラー:', error);
    res.status(500).json({ message: 'ログ保存に失敗しました' });
  }
});

// GET /logs → ログ一覧を取得
app.get('/logs', (req, res) => {
  if (!fs.existsSync(logPath)) {
    return res.status(200).json([]);
  }

  try {
    const content = fs.readFileSync(logPath, 'utf8');
    const logs = content ? JSON.parse(content) : [];
    res.status(200).json(logs);
  } catch (error) {
    console.error('🛑 ログ取得エラー:', error);
    res.status(500).json({ message: 'ログ取得に失敗しました' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
