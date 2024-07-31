import { pool } from "../config/connectionPostgre.js";

export const postMetas = async (req, res) => {
  try {
    const response = await pool.query(
      'INSERT INTO public."Metas" (titulo, descripcion, fecha) VALUES ($1, $2, $3) RETURNING *',
      [req.body.titulo, req.body.descripcion, req.body.fecha]
    );
    res.status(201).json(response.rows[0]);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Error al insertar meta" });
  }
};

export const getMetas = async (req, res) => {
  try {
    const response = await pool.query('SELECT * FROM public."Metas" ORDER BY id_meta ASC');
    res.status(200).json(response.rows);
    console.log("Metas obtenidas: ", response.rows);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Error al obtener metas" });
  }
};