import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import indexRoutes from './indexRoutes.js';
import tareas from './tareas.js';
import { putTareas } from '../utils/tareasDB.js';
import metas from './metas.js';
import registro from './registro.js';

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Middleware para servir archivos estáticos
app.use('/public/CSS', express.static(path.join(__dirname,'..' ,'..' , 'public', 'CSS')));
app.use('/public/JS', express.static(path.join(__dirname, '..' ,'..' ,'public', 'JS')));

// Middleware para parsear JSON
app.use(express.json());

// Usar las rutas definidas en src/routes/indexRoutes.js
app.use('/', indexRoutes);

// Usar las rutas definidas en src/routes/tareas.js
app.use('/api/tareas/crear', tareas);
app.use('/api/tareas/obtener', tareas);
app.use('/api/tareas/actualizar/:id_tarea', putTareas);


// Usar las rutas definidas en src/routes/metas.js
app.use('/api/metas/crear', metas);
app.use('/api/metas/obtener', metas);

// Usar las rutas definidas en src/routes/registro.js
app.use('/api/registro', registro);

// Middleware para manejar errores 404
app.use((req, res) => {
    res.status(404).send('Error 404');
});

const PORT = process.env.PORT ?? 3000;
app.listen(PORT, () => {
    console.log(`Server escuchando en http://localhost:${PORT}`);
});
