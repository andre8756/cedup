
import './App.css'
import { useEffect } from 'react'
import Cadastro from './pages/Cadastro/Cadastro'

function App() {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.log('App mounted');
  }, [])

  return (
    <div className="app">
      {/* Visible debug banner to confirm App is rendering */}
      <div className="w-full text-center py-2 bg-yellow-100 text-yellow-800">APP RENDERED</div>
      <Cadastro />
    </div>
  )
}

export default App
