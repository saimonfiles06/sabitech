import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ApiError } from "../api/ApiError.js";
import { useAuth } from "../auth/ContextoAuth.jsx";
import "./RegisterView.css";

export function RegisterView() {
  const [nombre, setNombre] = useState("");
  const [apellidos, setApellidos] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [confirmarPassword, setConfirmarPassword] = useState("");

  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] =
    useState(false);

  const [error, setError] = useState("");
  const [enviando, setEnviando] = useState(false);

  const { registrarse } = useAuth();
  const navegar = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");

    // Comprobar campos obligatorios
    if (
      !nombre.trim() ||
      !apellidos.trim() ||
      !correo.trim() ||
      !password ||
      !confirmarPassword
    ) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    // Validar formato del correo electrónico
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("Introduce un correo electrónico válido.");
      return;
    }

    // Longitud mínima de la contraseña (igual que en el servidor)
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }

    // Comprobar coincidencia de contraseñas
    if (password !== confirmarPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setEnviando(true);

    try {
      await registrarse({
        nombre: nombre.trim(),
        apellidos: apellidos.trim(),
        correo: correo.trim(),
        password,
        confirmarPassword,
      });
      navegar("/");
    } catch (fallo) {
      if (fallo instanceof ApiError && fallo.status === 429) {
        setError("Demasiados intentos. Espera un minuto y vuelve a probar.");
      } else if (fallo instanceof ApiError && fallo.body?.errors) {
        // Error de validación del servidor: se muestra el primer mensaje
        const primerosErrores = Object.values(fallo.body.errors)[0];
        setError(primerosErrores[0]);
      } else if (fallo instanceof ApiError) {
        setError(fallo.message);
      } else {
        setError("No se puede conectar con el servidor.");
      }
    } finally {
      setEnviando(false);
    }
  }

  return (
    <main className="login">
      <section className="login-contenedor">
        <header className="login-header">
          <h1>SABITECH</h1>
          <h2>Crear cuenta</h2>
          <p>Introduce tus datos para crear una cuenta.</p>
        </header>

        <form className="login-formulario" onSubmit={handleSubmit}>
          {/* Nombre */}
          <div className="login-campo">
            <label htmlFor="nombre">Nombre</label>

            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Joan"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              autoComplete="given-name"
              required
            />
          </div>

          {/* Apellidos */}
          <div className="login-campo">
            <label htmlFor="apellidos">Apellidos</label>

            <input
              type="text"
              id="apellidos"
              name="apellidos"
              placeholder="Rosell Martín"
              value={apellidos}
              onChange={(e) => setApellidos(e.target.value)}
              autoComplete="family-name"
              required
            />
          </div>

          {/* Correo electrónico */}
          <div className="login-campo">
            <label htmlFor="correo">Correo electrónico</label>

            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="ejemplo@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="email"
              required
            />
          </div>

          {/* Contraseña */}
          <div className="login-campo">
            <label htmlFor="password">Contraseña</label>

            <div className="login-password">
              <input
                type={mostrarPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="Introduce tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() => setMostrarPassword(!mostrarPassword)}
                aria-label={
                  mostrarPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                }
              >
                {mostrarPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {/* Confirmar contraseña */}
          <div className="login-campo">
            <label htmlFor="confirmarPassword">Confirmar contraseña</label>

            <div className="login-password">
              <input
                type={mostrarConfirmarPassword ? "text" : "password"}
                id="confirmarPassword"
                name="confirmarPassword"
                placeholder="Repite tu contraseña"
                value={confirmarPassword}
                onChange={(e) => setConfirmarPassword(e.target.value)}
                autoComplete="new-password"
                required
              />

              <button
                type="button"
                className="login-password-toggle"
                onClick={() =>
                  setMostrarConfirmarPassword(!mostrarConfirmarPassword)
                }
                aria-label={
                  mostrarConfirmarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarConfirmarPassword ? "Ocultar" : "Mostrar"}
              </button>
            </div>
          </div>

          {/* Mensaje de error */}
          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          {/* Botón de registro */}
          <button type="submit" className="login-boton" disabled={enviando}>
            {enviando ? "Creando cuenta..." : "Crear cuenta"}
          </button>
        </form>

        <footer className="login-footer">
          <p>
            ¿Ya tienes una cuenta? <Link to="/login">Inicia sesión</Link>
          </p>
        </footer>
      </section>
    </main>
  );
}
