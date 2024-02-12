import './App.css';
import KanbanBoard from './components/KanbanBoard';

function App() {
  return (
    <>
      <h1 style={{
        fontFamily: 'Poppins, sans-serif',
        textAlign: 'center',
        fontSize: '2.0rem',
        fontWeight: 'bold',
        marginTop: '35px',
        fontStyle: 'italic',
      }}>Kanban Task Manager</h1>
      <KanbanBoard />
    </>
  );
}

export default App;
