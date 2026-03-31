import { ThemeProvider } from "./mission02/context/ThemeProvider";
import Navbar from "./mission02/Navbar";

function App() {
  return (
    <ThemeProvider>
      <Navbar />
    </ThemeProvider>
  );
}

export default App;