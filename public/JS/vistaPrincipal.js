let tareasArray = [];
let metasArray = [];
let taskIdCounter = 1;
let goalIdCounter = 1;
let isSubmitEventBoundTareas = false;
let isSubmitEventBoundMetas = false;

/*TAREAS*/

// Función para asignar valores y agregar eventos al formulario de tareas
const darValores = () => {
  const formulario = document.getElementById("form");
  const titulo = document.getElementById("title");
  const descripcion = document.getElementById("description");
  const fecha = document.getElementById("date");

  // Función para agregar una nueva tarea
  const agregarTarea = (event) => {
    event.preventDefault();

    const tarea = {
      titulo: titulo.value,
      descripcion: descripcion.value,
      fecha: fecha.value,
      estado: "pendiente",
    };

    tareasArray.push(tarea);

    // Limpiar los campos del formulario
    titulo.value = "";
    descripcion.value = "";
    fecha.value = "";

    enviarTarea(tarea);
  };

  // Verificar si el evento submit ya está vinculado
  if (!isSubmitEventBoundTareas) {
    formulario.addEventListener("submit", agregarTarea);
    isSubmitEventBoundTareas = true;
  }
  tareasVacio();
};

// Función para enviar una tarea al servidor
const enviarTarea = (tarea) => {
  fetch("/api/tareas/crear", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tarea),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Envío exitoso", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// Función para recibir tareas del servidor
const recibirTareas = () => {
  fetch("/api/tareas/obtener", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      tareasArray = data.map((tarea) => ({
        id_tarea: tarea.id_tarea,
        titulo: tarea.titulo,
        descripcion: tarea.descripcion,
        fecha: tarea.fecha,
        estado: tarea.estado,
      }));
      vistaTareas();
      console.log("Tareas recibidas", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// Función para actualizar una tarea en el servidor
const actualizarTareas = (tareaActualizada) => {
  console.log("Actualizando tarea:", tareaActualizada);

  // Realiza una solicitud fetch para actualizar la tarea en el servidor
  fetch(`/api/tareas/actualizar/${tareaActualizada.id_tarea}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(tareaActualizada), // Convierte la tarea actualizada a una cadena JSON
  })
    .then(async (response) => {
      // Verifica si la respuesta no es exitosa
      if (!response.ok) {
        const errorData = await response.json(); // Obtiene los datos de error del cuerpo de la respuesta
        throw new Error(errorData.error || "Error al actualizar tarea"); // Lanza un error con el mensaje recibido o un mensaje por defecto
      }
      return response.json(); // Convierte la respuesta a JSON
    })
    .then((data) => {
      console.log("Tarea actualizada", data);

      // Encuentra el índice de la tarea actualizada en el array local
      const index = tareasArray.findIndex(
        (tarea) => tarea.id_tarea === data.id_tarea
      );

      // Si la tarea se encuentra en el array local, actualiza la tarea en el array
      if (index !== -1) {
        tareasArray[index] = data;
        vistaTareas(); // Actualiza la vista de las tareas
      } else {
        // Si no se encuentra la tarea en el array local, imprime un error en la consola
        console.error("No se encontró la tarea en el array local");
      }
    })
    .catch((error) => {
      // Imprime cualquier error que ocurra durante el proceso en la consola
      console.error("Error:", error);
    });
};

// Función para realizar cambios en todas las tareas
const realizarCambiosEnTareas = () => {
  tareasArray.forEach((tarea) => {
    actualizarTareas(tarea);
  });
};

// Función para mostrar las tareas en la vista
const vistaTareas = () => {
  const tareas = document.getElementById("espacio-tareas");
  tareas.innerHTML = "";
  tareasArray.forEach((tarea, index) => {
    const tareaDiv = document.createElement("div");
    tareaDiv.classList.add("tarea");
    tareaDiv.innerHTML = `
    <div id="tarea${index}" class="tareas">
      <div class="labels-tarea">
      <ul>
        <li>
          <button name="botonTarea" onclick="eventoTarea()">${
            tarea.titulo
          }</button>
        </li>
      </ul>
      </div>
      <div class="estados-tarea" >
        <select id="status${index}" name="estado-tarea">
          <option value="pendiente" ${
            tarea.estado === "pendiente" ? "selected" : ""
          }>Pendiente</option>
          <option value="en-progreso" ${
            tarea.estado === "en-progreso" ? "selected" : ""
          }>En progreso</option>
          <option value="completada" ${
            tarea.estado === "completada" ? "selected" : ""
          }>Completada</option>
        </select>
      </div>
    </div>
    `;

    tareas.appendChild(tareaDiv);
    eventoEstado(index);
    crearPopUpParaTarea(tarea, index);
    eventoTarea();
  });
};

// Función para mostrar un mensaje si no hay tareas
const tareasVacio = () => {
  const tareas = document.getElementById("espacio-tareas");
  tareas.innerHTML = "";
  if (tareasArray.length == 0) {
    const mensaje = document.createElement("div");
    mensaje.innerHTML = `
      <div class="tareas-vacio">
        <p>
        No hay tareas por hacer :)
        <br>
        Aquí van tus tareas. ¡Agrega una!
        </p>
      </div>
    `;
    tareas.appendChild(mensaje);
  }
};

const popupsPorTarea = {};

// Función para crear un popup para una tarea
const crearPopUpParaTarea = (tarea, index) => {
  const tareaPopUp = document.createElement("div");
  tareaPopUp.classList.add("tarea-popup");
  tareaPopUp.innerHTML = `
    <div class="tarea-popup-content" id="tarea-popup${index}">
      <div class="popup-close" onclick="closeTarea()">&times;</div>
      <h2>${tarea.titulo}</h2>
      <p>${tarea.descripcion}</p>
      <p>${tarea.estado}</p>
    </div>
  `;
  popupsPorTarea[index] = tareaPopUp;
};

// Función para manejar el evento de clic en una tarea
const eventoTarea = () => {
  // Obtiene todos los elementos con el nombre "botonTarea"
  const botonTarea = document.getElementsByName("botonTarea");

  // Itera sobre cada botón de tarea
  botonTarea.forEach((boton, index) => {
    // Agrega un evento de clic a cada botón
    boton.addEventListener("click", () => {
      // Obtiene el popup correspondiente al índice del botón
      const popup = popupsPorTarea[index];

      // Añade el popup al elemento con id "espacio-tareas"
      document.getElementById("espacio-tareas").appendChild(popup);

      // Añade la clase "showTarea" al cuerpo del documento para mostrar el popup
      document.body.classList.add("showTarea");
    });
  });
};

/*METAS*/

// Función para asignar valores y agregar eventos al formulario de metas
const darValoresMeta = () => {
  const formulario = document.getElementById("form-metas");
  const tituloMeta = document.getElementById("title-meta");
  const descripcion = document.getElementById("description-meta");
  const fecha = document.getElementById("date-meta");

  // Función para agregar una nueva meta
  const agregarMeta = (event) => {
    event.preventDefault();

    const meta = {
      titulo: tituloMeta.value,
      descripcion: descripcion.value,
      fecha: fecha.value,
    };

    metasArray.push(meta);

    // Limpiar los campos del formulario
    tituloMeta.value = "";
    descripcion.value = "";
    fecha.value = "";

    enviarMeta(meta);
  };

  // Verificar si el evento submit ya está vinculado
  if (!isSubmitEventBoundMetas) {
    formulario.addEventListener("submit", agregarMeta);
    isSubmitEventBoundMetas = true;
  }
  metasVacio();
};

const enviarMeta = (meta) => {
  fetch("/api/metas/crear", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(meta),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("Envío exitoso", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

const recibirMetas = () => {
  fetch("/api/metas/obtener", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      metasArray = data.map((meta) => ({
        id_meta: meta.id_meta,
        titulo: meta.titulo,
        descripcion: meta.descripcion,
        fecha: meta.fecha,
      }));
      vistaMetas();
      console.log("Metas recibidas", data);
    })
    .catch((error) => {
      console.error("Error:", error);
    });
};

// Función para manejar el cambio de estado de una tarea
const eventoEstado = (index) => {
  const selectEstado = document.getElementById(`status${index}`);
  if (selectEstado) {
    selectEstado.addEventListener("change", (event) => {
      const nuevoEstado = event.target.value;
      tareasArray[index].estado = nuevoEstado;
      console.log("Tareas después de cambiar estado", tareasArray);
      actualizarTareas(tareasArray[index]);
    });
  } else {
    console.error(`El elemento select con ID status${index} no se encontró.`);
  }
};

// Función para mostrar un mensaje si no hay metas
const metasVacio = () => {
  const metas = document.getElementById("espacio-metas");
  metas.innerHTML = "";
  if (metasArray.length == 0) {
    const mensaje = document.createElement("div");
    mensaje.innerHTML = `
      <div class="metas-vacio">
        <p>
        No hay metas por hacer :)
        <br>
        Aquí van tus metas. ¡Agrega una!
        </p>
      </div>
    `;
    metas.appendChild(mensaje);
  }
};

// Función para mostrar las metas en la vista
const vistaMetas = () => {
  const metas = document.getElementById("espacio-metas");
  metas.innerHTML = "";
  metasArray.forEach((meta, index) => {
    const metaDiv = document.createElement("div");
    metaDiv.classList.add("meta");
    metaDiv.innerHTML = `
    <div id="meta${index}" class="meta">
      <div class="labels-meta">
      <ul>
        <li>
          <button class="botonMeta" name="botonMeta" onclick="eventoMeta()">${meta.titulo}</button>
        </li>
      </ul>
      </div>
    </div>
    `;
    metas.appendChild(metaDiv);
    crearPopUpMetas(meta, index);
    eventoMeta();
  });
};

// Función para manejar el evento de clic en una meta
const eventoMeta = () => {
  const botonMeta = document.getElementsByName("botonMeta");
  botonMeta.forEach((boton, index) => {
    boton.addEventListener("click", () => {
      const popup = popupsPorMeta[index];
      document.getElementById("espacio-metas").appendChild(popup);
      document.body.classList.add("showMeta");
    });
  });
};

const popupsPorMeta = {};

const crearPopUpMetas = (meta, index) => {
  const metaPopUp = document.createElement("div");
  metaPopUp.classList.add("meta-popup");
  metaPopUp.innerHTML = `
    <div class="meta-popup-content" id="meta-popup${index}">
      <div class="popup-meta-close" onclick="closeMeta()">&times;</div>
      <h2>${meta.titulo}</h2>
      <p>${meta.descripcion}</p>
      <p>${meta.fecha}</p>
    </div>`;
  popupsPorMeta[index] = metaPopUp;
};

//ENCABEZADO

const fechaEncabezado = () => {
  const fecha = document.getElementById("fecha-encabezado");
  const date = new Date();
  const fechaActual = date.getDate()  + "-" + (date.getMonth() + 1) + "-" + date.getFullYear() ;
  fecha.innerHTML = `
    <h2> Fecha: ${fechaActual}</h2>`;

}

const openForm = () => {
  document.body.classList.add("showForm");
  document.body.classList.remove("showFormMeta");
};

const closeForm = () => {
  document.body.classList.remove("showForm");
};

const closeTarea = () => {
  document.body.classList.remove("showTarea");
};

const openFormMeta = () => {
  document.body.classList.add("showFormMeta");
};

const closeFormMeta = () => {
  document.body.classList.remove("showFormMeta");
};

const closeMeta = () => {
  document.body.classList.remove("showMeta");
};

document.addEventListener("DOMContentLoaded", (event) => {
  darValores();
  darValoresMeta();
  recibirTareas();
  recibirMetas();
  fechaEncabezado();
});
