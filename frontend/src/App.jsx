import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './components/Dashboard'  // Corrigido o caminho

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          {/* Futuras rotas podem ser adicionadas aqui */}
        </Routes>
      </div>
    </Router>
  )
}

export default App