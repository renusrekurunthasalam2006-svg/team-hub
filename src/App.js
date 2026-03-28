import Sidebar from './components/Sidebar'
import Dashboard from './components/Dashboard'
import Messages from './components/Messages'

function App() {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <Dashboard />
    </div>
  )
}

export default App