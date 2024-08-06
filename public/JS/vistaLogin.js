const signUpButton = document.getElementById("signUp");
const signInButton = document.getElementById("signIn");
const container = document.getElementById("container");

const loginArray = [];
const registerArray = [];

const iniciarSesion = () => {
  const correo = document.getElementById("correo-inicio");
  const contraseña = document.getElementById("contraseña-inicio");

  const data = {
    email: correo.value,
    contrasenia: contraseña.value,
  };

  loginArray.push(data);

  correo.value = "";
  contraseña.value = "";
};

const formularioInicio = () => {
  const form = document.getElementById("form-inicio");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    iniciarSesion();
    console.log(loginArray);
  });
};

const registro = () => {
  const nombre = document.getElementById("nombre");
  const apellido = document.getElementById("apellido");
  const correo = document.getElementById("email");
  const nombre_usuario = document.getElementById("nombre_usuario");
  const contraseña = document.getElementById("contraseña");

  const data = {
    nombre: nombre.value,
    apellido: apellido.value,
    correo_electronico: correo.value,
    nombre_usuario: nombre_usuario.value,
    contrasenia: contraseña.value,
  };

  registerArray.push(data);
  enviarRegistro(data);

  nombre.value = "";
  apellido.value = "";
  correo.value = "";
  nombre_usuario.value = "";
  contraseña.value = "";

  
};

const formularioRegistro = () => {
  const form = document.getElementById("form-registro");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    registro();
    console.log(registerArray);
  });
};

const enviarRegistro = async (data) => {
    fetch("http://localhost:3000/api/registro", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
};

signUpButton.addEventListener("click", () => {
  container.classList.add("right-panel-active");
});

signInButton.addEventListener("click", () => {
  container.classList.remove("right-panel-active");
});

formularioInicio();
formularioRegistro();
