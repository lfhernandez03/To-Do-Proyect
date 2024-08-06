import {pool} from "../config/connectionPostgre.js";

export const postRegistro = async (req, res) => {
    try {
        const response = await pool.query(
        'INSERT INTO public."Usuario" (nombre, apellido, correo_electronico, nombre_usuario, contrasenia) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [req.body.nombre, req.body.apellido, req.body.correo_electronico, req.body.nombre_usuario ,req.body.contrasenia]
        );
        res.status(201).json(response.rows[0]);
    } catch (error) {
        console.log("error: ", error);
        res.status(500).json({ error: "Error al insertar usuario" });
    }
    }