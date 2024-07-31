import express from 'express';
import {postMetas, getMetas} from '../utils/metasDB.js';

const router = express.Router();

// Middleware para parsear JSON
router.use(express.json());

router.post('/', (req, res) => {
    const nuevaMeta = req.body;
    console.log('Meta creada: ', nuevaMeta);
    postMetas(req, res);
});

router.get('/', (req, res) => {
    getMetas(req, res);
});

export default router; 