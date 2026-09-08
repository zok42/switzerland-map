const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const SCORES_FILE = path.join(__dirname, 'scores.json');

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Helper to read high scores
const readScores = () => {
  try {
    if (!fs.existsSync(SCORES_FILE)) {
      return [];
    }
    const data = fs.readFileSync(SCORES_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading scores:', err);
    return [];
  }
};

// Helper to write high scores
const writeScores = (scores) => {
  try {
    fs.writeFileSync(SCORES_FILE, JSON.stringify(scores, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing scores:', err);
  }
};

// GET high scores
app.get('/api/scores', (req, res) => {
  const scores = readScores();
  // Sort by score (descending) and limit to top 10
  const topScores = scores
    .sort((a, b) => b.points - a.score || b.score - a.score)
    .slice(0, 10);
  res.json(topScores);
});

// POST high score
app.post('/api/scores', (req, res) => {
  const { name, score, total, canton, regionMode } = req.body;
  if (!name || typeof score !== 'number') {
    return res.status(400).json({ error: 'Name and score are required.' });
  }

  const scores = readScores();
  scores.push({
    name,
    score,
    total,
    canton: canton || 'Schweiz',
    regionMode: regionMode || 'Schweiz',
    date: new Date().toISOString()
  });
  
  writeScores(scores);
  res.json({ success: true, scores: scores.sort((a, b) => b.score - a.score).slice(0, 10) });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
