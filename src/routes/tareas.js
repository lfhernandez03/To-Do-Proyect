import express from 'express';

const router = express.Router();

// Middleware para parsear JSON
router.use(express.json());

router.post('/', (req, res) => {
    const nuevaTarea = req.body;
    console.log('Tarea recibida: ', nuevaTarea);
    res.status(201).json({ message: 'Tarea recibida', tarea: nuevaTarea });
    
});

export default router;