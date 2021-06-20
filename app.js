const path = require('path');
const process = require('process');
const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config.js');
const apiErrorHandler = require('./error/apierror-handler.js');

let envFileName;

if (process.env.NODE_ENV === 'production') {
  envFileName = '.production.env';
} else {
  envFileName = '.development.env';
}

require('dotenv').config({ path: path.resolve(process.cwd(), envFileName) });

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);

app.get('/', (req, res) => {
  res.json({ answer: 'Congrats!' });
});

app.use('/api/auth', require('./routes/auth-route.js'));
app.use('/spotify', require('./routes/spotify-route.js'));

app.use(apiErrorHandler);

const PORT = process.env.PORT || config.PORT || 9000;

const start = async () => {
  try {
    await mongoose.connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    app.listen(PORT, () => {
      console.log(`App has been started on port ${PORT}`);
    });
  } catch (err) {
    console.log('Server error', err.message, err);
    process.exit(1);
  }
};

start();
