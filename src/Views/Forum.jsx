import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from 'axios';
import List from "../Components/List";
import '../App.css';

//Sección del Foro
const Forum = () => {

    //Variable que recibe los datos enviados a través del useNavigate
    const location = useLocation();
    const userData = location.state ? location.state.userData : null;

    //Variables de estado
    const [loaded, setLoaded] = useState(false);
    const [users, setUsers] = useState([]);
    const [postContent, setPostContent] = useState("");
    const [updateList, setUpdateList] = useState(false);

    //Variable de navegación
    const navigate = useNavigate();

    //Método para el manejo del botón Publicar
    const handlePublishClick = () => {
        //Variables para la obtención de la fecha y hora actual
        const today = new Date();
        const fecha = today.toISOString().split('T')[0];
        const hora = today.toTimeString().split(' ')[0];

        //Construcción de los parámetros para el post en formato JSON
        const newComment = {
            contenido: postContent,
            fecha_publicacion: fecha,
            hora_publicacion: hora,
            likes: 1,
            subcomentarios: null,
            usuario: null
        };

        const newUser = {
            nombre: userData.username,
            imagen: userData.avatar,
            comentarios: [newComment]
        };
    
        //Solicitud POST al servidor
        axios.post('http://localhost:9000/api/v1/post/comentario', newUser)
            .then(response => {
                //En caso de que la petición es exitosa
                console.log('Comentario publicado con éxito:', response.data);
                setPostContent("");
                setUpdateList(prevState => !prevState); //Actualiza el listado
                
            })
            .catch(error => {
                //Mensaje de error
                console.error('Error al publicar el comentario:', error);
            });
    };

    //Hook para renderizar la aplicación
    useEffect(
        ()=>{
            axios.get('http://localhost:9000/api/v1/posts')
            .then(res => {
                //En caso de que la petición es exitosa
                setUsers(Array.isArray(res.data.usuarios) ? res.data.usuarios : []);
                setLoaded(true);
            });
    },[updateList]);

    return (
        <>
        {/*Sección del encabezado para publicar */}
        <div className="background-fondo">
            <div className="encabezado2">
                {/*Imagen de perfil */}
                <div className="subencabezado2">
                    <img id="img1" src={userData.avatar} alt="Avatar" 
                    onError={(e) => {
                        e.target.src = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'; // Establece la imagen por defecto
                    }}/>
                </div>
                {/*Usuario */}
                <div className="subencabezado2">
                    <p id="sub_username">{userData.username}</p>
                </div>
                {/*Textarea para escribir*/}
                <div className="subencabezado2_1">
                    <textarea id="txt1" type="text" placeholder="¿Qué estás pensando?" value={postContent}
                    onChange={(e) => setPostContent(e.target.value)}/>
                </div>
                <br/>
                {/*Botón de Publicar */}
                <button id="btn_publicar" onClick={handlePublishClick}>Publicar</button>
            </div>
            {/*Botón para Cerrar Sesión */}
            <div className="button_logout">
                <button id="btn_logout" onClick={()=>navigate('/',{replace:true})}>Cerrar Sesión</button>
            </div>
            {/*Sección del listado de los Foros publicados */}
            <div>
                {loaded && users.map((user, index) => (<List key={index} user={user} userData={userData} onUpdateUsers={setUsers}/>))}
            </div>
        </div>
        </>
    );
};

export default Forum;