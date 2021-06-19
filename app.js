require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const process = require('process');
const cors = require('cors');
const mongoose = require('mongoose');
const config = require('./config/config.js');
const apiErrorHandler = require('./error/apierror-handler.js');

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

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
