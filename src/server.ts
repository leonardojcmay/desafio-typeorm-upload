import 'reflect-metadata';
import 'express-async-errors';

import routes from './routes';
import app from './app';

// importando conexao com o banco de dados
import './database';

app.use(routes);

app.listen(3333, () => {
  console.log('🚀 Server started on port 3333!');
});
