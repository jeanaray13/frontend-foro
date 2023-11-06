import React from "react";
import Register from "../Components/Register";

//Sección de Bienvenida
const Welcome = () => {
  return (
    <>
      <div className="encabezado">
        <h1 className="title">
          ¡Portal Forográfico: Tu Entrada Exclusiva al Mundo del Foro!
        </h1>
      </div>
      <div className="fondo">
        <Register/>
      </div>
    </>
  );
};

export default Welcome;
