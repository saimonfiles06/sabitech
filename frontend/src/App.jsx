import { Navigate, Route, Routes } from "react-router-dom";
import { InicioView } from "./views/InicioView.jsx";
import { LoginView } from "./views/LoginView.jsx";
import { RegisterView } from "./views/RegisterView.jsx";
import PerfilView from "./views/PerfilView.jsx";

function App() {
  return (
    <Routes>
      <Route path="/" element={<InicioView />} />
      <Route path="/login" element={<LoginView />} />
      <Route path="/registro" element={<RegisterView />} />
      <Route path="/perfil" element={<PerfilView />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
