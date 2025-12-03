import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Cadastro from '../pages/Cadastro/Cadastro';
import Conta from '../pages/Conta/Conta';
import Home from '../pages/HomePage/Homepage';
import FilterForm from '../components/FiltroTransacoes/FiltroTransacoes';
import PerfilUsuario from '../pages/PerfilUsuario/PerfilUsuario';
import Relatorios from '../pages/Relatorios/Relatorios';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/Home" replace />} />
        <Route path='/Home' element={<Home />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/conta" element={<Conta />} />
        <Route path="/perfil" element={<PerfilUsuario />} />
        <Route path="/relatorios" element={<Relatorios />} />
        <Route path="/transacoes" element={<FilterForm />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
