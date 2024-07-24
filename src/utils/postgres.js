import {pool} from '../config/connectionPostgre.js';

const postUsers = async () => {
    try {
        const response = await pool.query('INSERT INTO public."Usuario" (nombre, apellido, correo_electronico, nombre_usuario, contrasenia) VALUES ($1, $2, $3, $4, $5)', ['Maria', 'Arcos', 'maria@gmail.com','m_arcos','123']);
        console.log(response.rows);
    } catch (error) {
        console.log(error);
    }
}

const getUsers = async () => {
    try {
        const response = await pool.query('SELECT * FROM public."Usuario"');
        console.log(response.rows);
    } catch (error) {
        console.log(error);
    }
};
postUsers();