import React, {useState} from "react";
import '../App.css';
import axios from "axios";

//Sección del Listado de Foros
const List = (props) =>{
    
    //Datos heredados del padre Forum.jsx
    const { user, userData } = props;

    //Variables de estado
    const [replyToCommentId, setReplyToCommentId] = useState(null);
    const [replyContent, setReplyContent] = useState("");
    const [replyToSubcommentId, setReplyToSubcommentId] = useState(null);
    const [replySubcommentContent, setReplySubcommentContent] = useState("");

    //Inicialización de los Likes de los comentarios
    const [commentLikes, setCommentLikes] = useState(
        user.comentarios.reduce((likes, comment) => {
            likes[comment.id] = Number(comment.likes) || 0;
            return likes;
        }, {})
    );

    //Inicialización de los Likes de los subcomentarios
    const [subcommentLikes, setSubcommentLikes] = useState(
        user.comentarios.reduce((likes, comment) => {
            if (comment.subcomentarios) {
                comment.subcomentarios.forEach(subcomment => {
                    likes[subcomment.id] = Number(subcomment.likes) || 0;

                    // Verifica los subcomentarios de subcomentarios
                    if (subcomment.subcomentarios) {
                        subcomment.subcomentarios.forEach(subsubcomment => {
                            likes[subsubcomment.id] = Number(subsubcomment.likes) || 0;
                        });
                    }
                });
            }
            return likes;
        }, {})
    );

    //Manejo del botón para responder al comentario
    const handleReplyClick = (commentId) => {
        setReplyToCommentId(commentId);
    };

    //Manejo del textarea para responder un comentario
    const handleReplyContentChange = (event) => {
        setReplyContent(event.target.value);
    };

    //Manejo del botón para responder al subcomentario
    const handleSubcommentReplyClick = (subcommentId) => {
        setReplyToSubcommentId(subcommentId);
    };

    //Manejo del textarea para responder un subcomentario
    const handleSubcommentReplyContentChange = (event) => {
        setReplySubcommentContent(event.target.value);
    };

    //Manejo del botón de Enviar la respuesta del comentario
    const handleReplySubmit = async () => {
        //Si existe el ID asignado
        if (replyToCommentId !== null && replyContent.trim() !== "") {
            try {
                //Construcción de los parámetros para el post en formato JSON
                const subcommentData = {
                    contenido: replyContent,
                    fecha_publicacion: getFechaActual(),
                    hora_publicacion: getHoraActual(),
                    likes: 1,
                    subcomentarios: null,
                    usuario: {
                        comentarios: null,
                        imagen: userData.avatar,
                        nombre: userData.username,
                    },
                };
    
                // Realiza la solicitud POST a la API
                await axios.post(`http://localhost:9000/api/v1/post/comentario/${replyToCommentId}/subcomentario`, subcommentData);
        
                //Limpia el estado de respuesta.
                setReplyToCommentId(null);
                setReplyContent("");
        
                //Actualizar los datos más recientes
                await axiosUpdateData();
    
            } catch (error) {
                //Mensaje de error
                console.error("Error al enviar el subcomentario:", error);
            }
        }
    };

    //Manejo del botón de Enviar la respuesta del subcomentario
    const handleSubcommentReplySubmit = async () => {
        //Si existe el ID asignado
        if (replyToSubcommentId !== null && replySubcommentContent.trim() !== "") {
            try {
                //Construcción de los parámetros para el post en formato JSON
                const subcommentData = {
                    contenido: replySubcommentContent,
                    fecha_publicacion: getFechaActual(),
                    hora_publicacion: getHoraActual(),
                    likes: 1,
                    subcomentarios: null,
                    usuario: {
                        comentarios: null,
                        imagen: userData.avatar,
                        nombre: userData.username,
                    },
                };
        
                // Realizar la solicitud POST a la API
                await axios.post(`http://localhost:9000/api/v1/post/comentario/${replyToSubcommentId}/subcomentario`, subcommentData);
        
                //Limpia el estado de respuesta.
                setReplyToSubcommentId(null);
                setReplySubcommentContent("");
        
                //Actualizar los datos más recientes
                await axiosUpdateData();
        
            } catch (error) {
                //Mensaje de error
                console.error("Error al enviar el subcomentario:", error);
            }
        }
    };

    //Función para actualizar los datos
    const axiosUpdateData = async () => {
        try {
            //Solicitud GET a la API
            const response = await axios.get('http://localhost:9000/api/v1/posts');

            //Actualiza los datos
            props.onUpdateUsers(Array.isArray(response.data.usuarios) ? response.data.usuarios : []);
        } catch (error) {
            //Mensaje de error
            console.error("Error al obtener los datos:", error);
        }
    };

    // Función para obtener la fecha actual
    const getFechaActual = () => {
        const fechaActual = new Date();
        return fechaActual.toISOString().split('T')[0];
    };

    // Función para obtener la hora actual
    const getHoraActual = () => {
        const horaActual = new Date();
        return horaActual.toTimeString().split(' ')[0];
    };

    //Manejo para incrementar el número de Likes de los comentarios
    const handleIncrementLikes = (commentId) => {
        setCommentLikes((prevLikes) => ({
            ...prevLikes,
            [commentId]: prevLikes[commentId] + 1,
        }));
    };

    //Manejo para incrementar el número de Likes de los subcomentarios
    const handleIncrementSubLikes = (subcommentId) => {
        setSubcommentLikes((prevLikes) => ({
            ...prevLikes,
            [subcommentId]: prevLikes[subcommentId] + 1,
        }));
    };

    //Manejo para decrementar el número de Likes de los comentarios
    const handleDecrementLikes = (commentId) => {
        setCommentLikes((prevLikes) => ({
            ...prevLikes,
            [commentId]: Math.max(prevLikes[commentId] - 1, 0),
        }));
    };

    //Manejo para decrementar el número de Likes de los subcomentarios
    const handleDecrementSubLikes = (subcommentId) => {
        setSubcommentLikes((prevLikes) => ({
            ...prevLikes,
            [subcommentId]: Math.max(prevLikes[subcommentId] - 1, 0),
        }));
    };

    //Manejo para renderizar los subcomentarios y los subcomentarios de los subcomentarios
    const renderSubcomments = (subcomments) => {
        //Si el formato obtenido es del tipo Array
        if (Array.isArray(subcomments)) {
            return (
                <div>
                    {/*Obteniendo el resultado de los subcomentarios */}
                    {subcomments.map((subcomment, idx) => (
                        <>
                        {/*Sección del subcomentario */}
                        <div key={idx}>
                            <div className="encabezado4">
                                {/*Sección de la imagen y del usuario*/}
                                {subcomment.usuario && (
                                    <>
                                    <div className="encabezado4_1">
                                        {/*Imágen de perfil */}
                                        <div className="subencabezado4">
                                            <img id="img1" src={subcomment.usuario.imagen} alt={subcomment.usuario.nombre} 
                                            onError={(e) => {
                                                e.target.src = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'; // Establece la imagen por defecto
                                            }}/>
                                        </div>
                                        {/*Usuario */}
                                        <div className="subencabezado4">
                                            <p id="sub_username1">{subcomment.usuario.nombre}</p>
                                        </div> 
                                    </div>
                                    {/*Sección de la fecha y hora de publicación*/}
                                    <div>
                                        <div className="subencabezado4"></div>
                                        <div className="subencabezado4"></div>
                                        <div className="subencabezado4_1">
                                            <p id="fecha_hora">Publicado el {subcomment.fecha_publicacion} a las {subcomment.hora_publicacion}</p>
                                        </div>
                                    </div>
                                    {/*Sección del texto del subcomentario*/}
                                    <div>
                                        <p id="comentario">{subcomment.contenido}</p>
                                    </div>
                                    {/*Sección de likes */}
                                    <div>
                                        <div className="likes">
                                            <button className="btn_like" onClick={() => handleIncrementSubLikes(subcomment.id)}>+</button>
                                            <button className="btn_like" onClick={() => handleDecrementSubLikes(subcomment.id)}>-</button>
                                            <p id="like">{subcommentLikes[subcomment.id]|| 1} points</p>
                                        </div>
                                    </div>
                                    {/* Sección de Responder al Subcomentario */}
                                    <div>
                                        {/*Si se obtiene el ID del subcomentario */}
                                        {replyToSubcommentId === subcomment.id ? (
                                            <>
                                                <textarea id="txt2"
                                                    placeholder="Escribe tu respuesta al subcomentario..."
                                                    value={replySubcommentContent}
                                                    onChange={handleSubcommentReplyContentChange}
                                                />
                                                <button className="btn_enviar" onClick={handleSubcommentReplySubmit}>Enviar</button>
                                            </>
                                        ) : (
                                            <>
                                            {/*Botón de Responder */}
                                            <button className="btn_enviar" onClick={() => handleSubcommentReplyClick(subcomment.id)}>Responder</button>
                                            </>
                                        )}
                                    </div>
                                    {/*Sección del texto del subcomentario*/}
                                    {subcomment.subcomentarios && (
                                        <div>
                                            {renderSubcomments(subcomment.subcomentarios)}
                                        </div>
                                    )}
                                    </>
                                )}
                            </div>
                        </div>
                        </>
                    ))}
                </div>
            );
        } else if (subcomments) {
            return null;
        }
        return null;
    };

    return (
        <>
            <div>
                {/*Obteniendo el resultado de la consulta*/}
                {user.comentarios && user.comentarios.map((comment, idx) => (
                    <>
                    {/*Sección del comentario*/}
                    <div key={idx}>
                        <div className="encabezado3">
                            {/*Sección de la imagen y del usuario*/}
                            <div className="encabezado3_1">
                                {/*Imágen de perfil */}
                                <div className="subencabezado3">
                                    <img id="img1" src={user.imagen} alt={user.nombre} 
                                    onError={(e) => {
                                        e.target.src = 'https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png'; // Establece la imagen por defecto
                                    }}/>
                                </div>
                                {/*Usuario */}
                                <div className="subencabezado3">
                                    <p id="sub_username1">{user.nombre}</p>
                                </div>    
                            </div>
                            {/*Sección de la fecha y hora de publicación*/}
                            <div>
                                <div className="subencabezado3"></div>
                                <div className="subencabezado3"></div>
                                <div className="subencabezado3_1">
                                    <p id="fecha_hora">Publicado el {comment.fecha_publicacion} a las {comment.hora_publicacion}</p>
                                </div>
                            </div>
                            {/*Sección del texto del comentario*/}
                            <div>
                                <p id="comentario">{comment.contenido}</p>
                            </div>
                            {/*Sección de Likes */}
                            <div>
                                <div className="likes">
                                    <button className="btn_like" onClick={() => handleIncrementLikes(comment.id)}>+</button>
                                    <button className="btn_like" onClick={() => handleDecrementLikes(comment.id)}>-</button>
                                    <p id="like">{commentLikes[comment.id]} points</p>
                                </div>
                            </div>
                            {/* Sección de Responder*/}
                            <div>
                                {/*Si tiene un ID existente*/}
                                {replyToCommentId === comment.id ? (
                                    <>
                                        <textarea id="txt2"
                                            placeholder="Escribe tu respuesta..."
                                            value={replyContent}
                                            onChange={handleReplyContentChange}
                                        />
                                        <button className="btn_enviar" onClick={handleReplySubmit}>Enviar</button>
                                    </>
                                ) : (
                                    <>
                                    {/*Botón de Responder*/}
                                    <button className="btn_enviar" onClick={() => handleReplyClick(comment.id)}>Responder</button>
                                    </>
                                )}
                            </div>
                            {/*Sección de subcomentarios */}
                            {comment.subcomentarios && (
                            <div>
                                {renderSubcomments(comment.subcomentarios)}
                            </div>
                            )}
                        </div>    
                    </div>
                    </>
                ))}
            </div>
        </>
    );
};

export default List;