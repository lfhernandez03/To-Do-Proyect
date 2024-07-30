import { pool } from "../config/connectionPostgre.js";

export const postTareas = async (req, res) => {
  try {
    const response = await pool.query(
      'INSERT INTO public."Tareas" (titulo, descripcion, fecha, estado) VALUES ($1, $2, $3, $4) RETURNING *',
      [req.body.titulo, req.body.descripcion, req.body.fecha, req.body.estado]
    );
    res.status(201).json(response.rows[0]); // Asegúrate de enviar una respuesta aquí también
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Error al insertar tarea" }); // Enviar una respuesta de error
  }
};

export const getTareas = async (req, res) => {
  try {
    const response = await pool.query('SELECT * FROM public."Tareas" ORDER BY id_tarea ASC');
    res.status(200).json(response.rows);
    console.log("Tareas obtenidas: ", response.rows);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Error al obtener tareas" });
  }
};


export const putTareas = async (req, res) => {
  try {
    const response = await pool.query(
      'UPDATE public."Tareas" SET estado = $1 WHERE id_tarea = $2 RETURNING *',
      [req.body.estado, req.params.id_tarea]
    );
    console.log("Tarea actualizada: ", response.rows[0]);
    if (response.rows.length === 0) {
      return res.status(404).json({ error: "No se encontró la tarea" });
    }
    res.status(200).json(response.rows[0]);
  } catch (error) {
    console.log("error: ", error);
    res.status(500).json({ error: "Error al actualizar tarea" }); // Enviar una respuesta de error
  }
};
