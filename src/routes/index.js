import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRoutes from './indexRoutes.js';
import tareas from './tareas.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware para servir archivos estáticos
app.use('/public/CSS', express.static(path.join(__dirname,'..' ,'..' , 'public', 'CSS')));
app.use('/public/JS', express.static(path.join(__dirname, '..' ,'..' ,'public', 'JS')));

// Usar las rutas definidas en src/routes/indexRoutes.js
app.use('/', indexRoutes);

// Usar las rutas definidas en src/routes/tareas.js
app.use('/api/tareas', tareas);

// Middleware para manejar errores 404
app.use((req, res) => {
    res.status(404).send('Error 404');
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Server escuchando en http://localhost:${PORT}`);
});
