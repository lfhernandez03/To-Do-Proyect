let tareasArray = [];
let taskIdCounter = 1;

const darValores = () => {
  const formulario = document.getElementById("form");
  const titulo = document.getElementById("title");
  const descripcion = document.getElementById("description");
  const fecha = document.getElementById("date");

  let isSubmitEventBound = false;

  const agregarTarea = (event) => {
    event.preventDefault();
    tareasArray.push({
      id: taskIdCounter++,
      titulo: titulo.value,
      descripcion: descripcion.value,
      fecha: fecha.value,
      estado: "pendiente",
    });

    titulo.value = "";
    descripcion.value = "";
    fecha.value = "";

    vistaTareas();
    console.log(`Tarea agregada con id ${taskIdCounter - 1}`, tareasArray);
  };

  if (!isSubmitEventBound) {
    formulario.addEventListener("submit", agregarTarea);
    isSubmitEventBound = true;
  }

  tareasVacio();
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

const eventoCheckbox = () => {
  const checkboxes = document.getElementsByName("tarea");
  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener("change", actualizarContador);
  });
};

const actualizarContador = () => {
  const checkboxes = document.getElementsByName("tarea");
  let checkedCount = Array.from(checkboxes).filter(
    (checkbox) => checkbox.checked
  ).length;
  document.getElementById("eliminar").innerText = `Eliminar (${checkedCount})`;
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

const eventoEliminar = () => {
  let botonEliminar = document.getElementById("eliminar");
  botonEliminar.addEventListener("click", eliminarTareasSeleccionadas);
};

const eliminarTareasSeleccionadas = () => {
  const checkboxes = document.getElementsByName("tarea");
  let indicesParaEliminar = [];
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      indicesParaEliminar.push(index);
    }
    console.log("Tareas después de eliminar", tareasArray);
  });

  for (let i = indicesParaEliminar.length - 1; i >= 0; i--) {
    let index = indicesParaEliminar[i];
    checkboxes[index].closest("div").remove();
    tareasArray.splice(index, 1);
  }

  actualizarContador();
  if (tareasArray.length === 0) {
    document.getElementById("boton-eliminar").remove();
  }
};

const openForm = () => {
  document.body.classList.add("showForm");
};

const closeForm = () => {
  document.body.classList.remove("showForm");
};

const openTarea = () => {
  document.body.classList.add("showTarea");
};

const closeTarea = () => {
  document.body.classList.remove("showTarea");
};

document.addEventListener("DOMContentLoaded", (event) => {
  darValores();
});
