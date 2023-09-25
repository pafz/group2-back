const express = require('express');
require('dotenv').config({ path: `.env.${process.env.NODE_ENV}` });
console.log(process.env.NODE_ENV)
const { dbConnection } = require('./config/config');
const app = express();
const cors = require('cors');
const path = require('path');
const { handleTypeError } = require('./middlewares/errors');
const PORT = process.env.PORT || 3001;
const axios = require("axios");

dbConnection();

app.use(express.json());
app.use(cors());

// Configurar middleware para servir archivos estáticos
app.use(
  '/assets/images',
  express.static(path.join(__dirname, 'assets/images'))
);

// Configurar las rutas estáticas para las imágenes
app.use('/assets/images/user', express.static('/assets/images/user'));
app.use('/assets/images/event', express.static('/assets/images/event'));
// app.use('/assets/images/review', express.static('/assets/images/review'));

app.post("/authenticate", async (req, res) => {
    const { username } = req.body;
  
    try {
      const r = await axios.put(
        "https://api.chatengine.io/users/",
        { username: username, secret: username, first_name: username },
        { headers: { "Private-Key": "535124c2-581e-4365-b038-14ddd145d9f6" } }
      );
      return res.status(r.status).json(r.data);
    } catch (e) {
      return res.status(e.response.status).json(e.response.data);
    }
  });

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
app.use('/questions', require('./routes/questions'));
app.use('/orders', require('./routes/orders'));

app.use(handleTypeError);

const server = app.listen(PORT, () =>
  console.log(`Servidor levantado en el puerto ${PORT}`)
);

app.server = server;

module.exports = app;
