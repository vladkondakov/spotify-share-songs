const express = require('express');
const cookieParser = require('cookie-parser');
const config = require('./config/config.js');
const apiErrorHandler = require('./error/apierror-handler.js');

const app = express();

app.use(cookieParser());

app.get('/', (req, res) => {
  res.json({ answer: 'Congrats!' });
});

app.use('/spotify', require('./routes/spotify-route.js'));

// app.use((req, res, next) => {
//   const err = Error(`The url you are trying to reach is not hosted on the server.`);
//   return next(err);
// });

app.use(apiErrorHandler);

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
