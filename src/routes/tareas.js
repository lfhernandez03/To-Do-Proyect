import express from 'express';
import {postTareas, getTareas, putTareas} from '../utils/tareasDB.js';

const router = express.Router();

// Middleware para parsear JSON
router.use(express.json());

router.post('/', (req, res) => {
    const nuevaTarea = req.body;
    console.log('Tarea recibida: ', nuevaTarea);
    postTareas(req, res);
});

router.get('/', (req, res) => {
    getTareas(req, res);
});

router.put('/', (req, res) => {
    putTareas(req, res);
    console.log('Actualización exitosa: ', req.body);
});

export default router;