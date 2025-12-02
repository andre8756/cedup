import './App.css'
import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'

function App() {
  useEffect(() => {
    console.log("BASE_URL:", import.meta.env.VITE_API_BASE_URL);
    window.__APP_ENV__ = import.meta.env;
  }, []);

  return (
    <div id="app">
      <AppRoutes />
    </div>
  )
}

export default App
