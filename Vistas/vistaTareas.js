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