import './App.css'
import ContextPage from './ContextPage.tsx';



// 할 일이 어떻게 생겼는지 정의
interface Task {
  id: number;
  text: string;
}

function App() {
  return (
    <>
      <ContextPage />
    </>
  )
}

export default App