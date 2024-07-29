let tareasArray = [];
let metasArray = [];
let taskIdCounter = 1;
let goalIdCounter = 1;
let isSubmitEventBoundTareas = false;
let isSubmitEventBoundMetas = false;

const darValores = () => {
  const formulario = document.getElementById("form");
  const titulo = document.getElementById("title");
  const descripcion = document.getElementById("description");
  const fecha = document.getElementById("date");

  const agregarTarea = (event) => {
    event.preventDefault();

    const tarea = {
      id: taskIdCounter++,
      titulo: titulo.value,
      descripcion: descripcion.value,
      fecha: fecha.value,
      estado: "pendiente",
    };

    tareasArray.push(tarea);



    titulo.value = "";
    descripcion.value = "";
    fecha.value = "";

    vistaTareas();
    enviarTarea(tarea);
  };

  if (!isSubmitEventBoundTareas) {
    formulario.addEventListener("submit", agregarTarea);
    isSubmitEventBoundTareas = true;
  }
  tareasVacio();
  
};

const enviarTarea = (tarea) => {
  fetch("/api/tareas", {
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

const darValoresMeta = () => {

  const formulario = document.getElementById("form-metas");
  const tituloMeta = document.getElementById("title-meta");
  const descripcion = document.getElementById("description-meta");
  const fecha = document.getElementById("date-meta");

  const agregarMeta = (event) => {
    event.preventDefault();
    metasArray.push({
      id: goalIdCounter++,
      titulo: tituloMeta.value,
      descripcion: descripcion.value,
      fecha: fecha.value,
    });

    tituloMeta.value = "";
    descripcion.value = "";
    fecha.value = "";
    vistaMetas();
    console.log(`Meta agregada con id ${goalIdCounter - 1}`, metasArray);
  }; 
  if (!isSubmitEventBoundMetas) {
    formulario.addEventListener("submit", agregarMeta);
    isSubmitEventBoundMetas = true;
  }
  metasVacio();
  
};

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
          <button name="botonTarea" onclick="eventoTarea()">${tarea.titulo}</button>
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

const eventoTarea = () => {
  const botonTarea = document.getElementsByName("botonTarea");
  botonTarea.forEach((boton, index) => {
    boton.addEventListener("click" , () => {
      const popup = popupsPorTarea[index];
      document.getElementById("espacio-tareas").appendChild(popup);
      document.body.classList.add("showTarea");
    });
  });
};

const eventoEstado = (index) => {
  const selectEstado = document.getElementById(`status${index}`);
  if (selectEstado) {
    selectEstado.addEventListener("change", (event) => {
      const nuevoEstado = event.target.value;
      tareasArray[index].estado = nuevoEstado;
      console.log("Tareas después de cambiar estado", tareasArray);
    });
  } else {
    console.error(`El elemento select con ID status${index} no se encontró.`);
  }
};

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

const eventoMeta = () => {
  const botonMeta = document.getElementsByName("botonMeta");
  botonMeta.forEach((boton, index) => {
    boton.addEventListener("click" , () => {
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
}

const closeFormMeta = () => {
  document.body.classList.remove("showFormMeta");
}

const closeMeta = () => {
  document.body.classList.remove("showMeta");
};

document.addEventListener("DOMContentLoaded", (event) => {
  darValores();
  darValoresMeta();
});
