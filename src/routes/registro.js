import express from 'express';
import {postRegistro} from '../utils/registroDB.js';

const router = express.Router();

// Middleware para parsear JSON
router.use(express.json());

router.post('/', (req, res) => {
    const nuevoUsuario = req.body;
    console.log('Usuario recibido: ', nuevoUsuario);
    postRegistro(req, res);
});

export default router;