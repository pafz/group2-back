const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./config/config');
const app = express();
const cors = require('cors');
const { handleTypeError } = require('./middlewares/errors');
const PORT = process.env.PORT || 3001;

dbConnection();

app.use(express.json());
app.use(cors());

app.get('/', (req, res) =>
  res
    .status(200)
    .send(
      '<pre>Welcome</pre><pre>Read the <a href="https://github.com/pafz/group2-back/blob/main/README.md">API docs</a>.</pre>'
    )
);
app.use('/uploads', express.static('uploads'));
app.use('/users', require('./routes/users'));
app.use('/events', require('./routes/events'));
app.use('/reviews', require('./routes/reviews'));

app.use(handleTypeError);

app.listen(PORT, () => console.log(`Servidor levantado en el puerto ${PORT}`));

module.exports = app;
