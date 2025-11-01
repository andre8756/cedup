
import './App.css'
import { useEffect } from 'react'
import AppRoutes from './routes/AppRoutes'

function App() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('App mounted');
  }, [])

  return (
    <div className="app">
      {/* Visible debug banner to confirm App is rendering */}
      <div style={{width:'100%',textAlign:'center',padding:'0.5rem',background:'#fef3c7',color:'#92400e'}}>APP RENDERED</div>
      <AppRoutes />
    </div>
  )
}

export default App
