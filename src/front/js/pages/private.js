import React, { useContext, useEffect } from "react";
import { Context } from "../store/appContext";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import error from "../../img/error.png";
import hola from "../../img/hola.png";



export const Private = () => {
	const { store, actions } = useContext(Context);
	const navigate = useNavigate();
    const borrar = () =>{
		actions.deslogarUsuario()
		navigate ('/')
	}
	const token = sessionStorage.getItem('token')

	return (
		<div>
		{token && token != null && token != undefined ? (
			<div className="text-center mt-5">
			<img className="hola" src={hola} />
			<h1>Bienvenido a tu área privada</h1>
			<button className="btn btn-danger" onClick={borrar}>Cerrar sesión</button> 
				
		</div>

		): (
			<div className="text-center mt-5">
				
				<img className="error" src={error} />
				<h1>Tienes que iniciar sesión para acceder</h1>
				<Link to="/">
				<button className="btn btn-danger">Inicia sesión</button> </Link>
			</div>
		)} 
	</div>
		
	)
};