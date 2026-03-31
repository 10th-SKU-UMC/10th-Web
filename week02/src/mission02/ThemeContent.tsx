import { ThemeProvider, useTheme } from "./context/ThemeProvider";
import Navbar from "./Navbar";

export default function ThemeContent() {  
    useTheme();
    return (
        <ThemeProvider>
            <div className='felx flex-col items-center justify-center min-h-screen'>
                <Navbar />
                <main className='fkex-1 w-full max-w-screen-lg'>
                    <ThemeContent />
                </main>
            </div>
        </ThemeProvider>
  )
} 