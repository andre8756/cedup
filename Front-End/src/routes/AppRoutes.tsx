import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from '../pages/Login/Login';
import Cadastro from '../pages/Cadastro/Cadastro';
import Conta from '../pages/Conta/Conta';
import Dashboard from '../pages/Dashboard/Dashboard';

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path='/dashboard' element={<Dashboard />}/>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Cadastro />} />
        <Route path="/conta" element={<Conta />} />
        {/* catch-all: redirect to login for now */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
