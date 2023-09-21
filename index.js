const express = require('express');
require('dotenv').config();
const { dbConnection } = require('./config/config');
const app = express();
const cors = require('cors');
const path = require('path'); 
const { handleTypeError } = require('./middlewares/errors');
const PORT = process.env.PORT || 3001;

dbConnection();

app.use(express.json());
app.use(cors());

// Configurar middleware para servir archivos estáticos
app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')));

// Configurar las rutas estáticas para las imágenes
app.use('/assets/images/user', express.static('/assets/images/user'));
app.use('/assets/images/event', express.static('/assets/images/event'));
app.use('/assets/images/review', express.static('/assets/images/review'));

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

app.use(handleTypeError);

app.listen(PORT, () => console.log(`Servidor levantado en el puerto ${PORT}`));

module.exports = app;
