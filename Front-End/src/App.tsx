
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
      <AppRoutes />
    </div>
  )
}

export default App
