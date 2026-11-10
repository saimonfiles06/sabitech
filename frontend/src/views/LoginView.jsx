import { useState } from "react";
import "./LoginView.css";

export function LoginView() {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    setError("");

    if (!correo.trim() || !password) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {
      setError("Introduce un correo electrónico válido.");
      return;
    }

    // Pendiente: conectar con Laravel Sanctum
    console.log({
      correo: correo.trim(),
      password,
    });
  }

  return (
    <main className="login">
      <section className="login-contenedor">
        <header className="login-header">
          <h1>SABITECH</h1>
          <h2>Iniciar sesión</h2>
          <p>Introduce tus credenciales para acceder a tu cuenta.</p>
        </header>

        <form className="login-formulario" onSubmit={handleSubmit}>
          <div className="login-campo">
            <label htmlFor="correo">Correo electrónico</label>

            <input
              type="email"
              id="correo"
              name="correo"
              placeholder="ejemplo@correo.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              autoComplete="username"
              required
            />
          </div>

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
                autoComplete="current-password"
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

          {error && (
            <p className="login-error" role="alert">
              {error}
            </p>
          )}

          <button type="submit" className="login-boton">
            Iniciar sesión
          </button>
        </form>

        <footer className="login-footer">
          <p>
            ¿Todavía no tienes una cuenta? <a href="/registro">Regístrate</a>
          </p>
        </footer>
      </section>
    </main>
  );
}
