import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

//Sección del Registro
const Register = () => {

    //Variables de estado
    const [username, setUsername] = useState("");
    const [avatar, setAvatar] = useState("");
    const [msgError, setMsgError] = useState("");

    //Variable de navegación
    const navigate = useNavigate();

    //Método para el manejador del submit
    const handleSubmit = (e) => {
        e.preventDefault();

        //Verificar que los datos estén llenos
        if(username==="" || avatar===""){
            setMsgError("El nombre y/o la imagen posee el/los campo(s) vacío(s)")
        }
        else{
            //Se redirige a la sección de Forum.jsx
            const userData = { username, avatar };
            navigate("/foro", { state: { userData }, replace: true });
        }
        
    };

    return (
        <>
        {/*Sección del formulario */}
        <form onSubmit={handleSubmit}>
            {/*Usuario*/}
            <h2>Ingrese su nombre de usuario:</h2>
            <input className="txt" type="text" placeholder="Ingrese su nombre" value={username} 
            onChange={(e) => setUsername(e.target.value)}/>
            {/*Imágen*/}
            <h2>Ingrese la imagen de su avatar:</h2>
            <input className="txt" type="text" placeholder="Ej: https://pbs.twimg.com/profile_images/h6VGOhH6.jpeg" 
            value={avatar} onChange={(e) => setAvatar(e.target.value)}/>
            <br />
            {/*Login */}
            <div className="login">
                <p className='error'>{msgError}</p>
                <input className="btn_login" type="submit" value="Ingresar" />
            </div>
        </form>
        </>
    );
};

export default Register;