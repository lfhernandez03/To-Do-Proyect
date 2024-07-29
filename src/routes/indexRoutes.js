import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
const router = express.Router();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Ruta para la página principal
router.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../views/index.html'));
});

export default router;