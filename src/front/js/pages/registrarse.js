import React, { useContext, useState } from "react";
import { Context } from "../store/appContext";
import "../../styles/registrar.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const Registrar = () => {
  const { store, actions } = useContext(Context);
  const navigate = useNavigate();
  const [contact, setContact] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const enviarFormulario = async (event) => {
    event.preventDefault();

    if (contact.email.trim() === "" || contact.password.trim() === "") {
      setError("Por favor completa todos los campos requeridos.");
      return;
    }

    try {
      await actions.registrarUsuario(contact);
      // Registro exitoso, podrías redirigir si es necesario
      // navigate("/");
    } catch (error) {
      setError(`El usuario ${contact.email} ya existe. Por favor inicia sesión.`);
    }
  };

  return (
    <div className="login-wrapper">
      <form onSubmit={enviarFormulario}>
        <h1>
          <span>Regístrate</span>
        </h1>

        {error && (
          <div className="alert alert-danger">
            {error}
          </div>
        )}

        <div className="input-row">
          <span className="icon" id="raya">
            <i className="fa fa-at"></i>
          </span>
          <input
            type="text"
            id="registro"
            placeholder="Email"
            value={contact.email}
            onChange={(e) => setContact({ ...contact, email: e.target.value })}
          />
        </div>

        <div className="input-row">
          <span className="icon" id="raya">
            <i className="fa fa-lock"></i>
          </span>
          <input
            type={showPassword ? "text" : "password"}
            id="registro"
            placeholder="Password"
            value={contact.password}
            onChange={(e) => setContact({ ...contact, password: e.target.value })}
          />
          <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
            <i className={`fa ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
          </span>
        </div>

        <div className="submit-row d-flex">
          <Link to="/">
            <span className="reset"> Inicia sesión &nbsp;</span>
          </Link>
          <input type="submit" value=" Regístrate " />
        </div>
      </form>
    </div>
  );
};

export default Registrar;
