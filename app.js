const express = require('express');
const cookieParser = require('cookie-parser');
const config = require('./config/config.js');

const app = express();

app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ answer: 'Congrats!' });
});

app.use('/spotify', require('./routes/spotify.js'));

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
