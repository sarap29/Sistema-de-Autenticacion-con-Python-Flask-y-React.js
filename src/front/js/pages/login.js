import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/home.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const { store, actions } = useContext(Context);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const enviarFormulario = async (event) => {
    event.preventDefault();
    
    if (email.trim() === "" || password.trim() === "") {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }
    
    try {
      // Llamada a la función que verifica el usuario en la base de datos
      await actions.loginUsuario(email, password);

      // Redirige al área privada inmediatamente después de la autenticación exitosa
      actions.areaPrivadaUsuario(email, password);

      // Redirige a la ruta '/private'
      navigate("/private");

    } catch (error) {
      // Manejo de errores, muestra un mensaje de error si el usuario no está registrado
      setError("Usuario no registrado");
      console.error("Error al iniciar sesión", error);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={enviarFormulario}>
        <h1><span>Inicio de sesión</span></h1>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="input-row">
          <span className="icon"><i className="fa fa-at"></i></span>
          <input
            type="text"
            id="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-row d-flex">
          <span className="icon"><i className="fa fa-lock"></i></span>
          <input
            type={showPassword ? "text" : "password"}
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="toggle-password" onClick={toggleShowPassword}>
            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
          </span>
        </div>

        <div className="submit-row d-flex">
          <input type="submit" value="Inicio de sesión" />

          <Link to="/registrar">
            <span className="reset"> or &nbsp; Regístrate</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
