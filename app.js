const express = require('express');
const config = require('./config/config.js');

const app = express();

app.get('/', (req, res) => {
  res.json({ answer: 'Congrats!' });
});

const { PORT } = config || process.env || { PORT: 9000 };

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`App has been started on port ${PORT}`);
    });
  } catch (err) {
    console.log('Server error', err.message);
    process.exit(1);
  }
};

start();
