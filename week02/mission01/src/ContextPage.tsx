import { ThemeProvider } from './context/ThemeProvider';
import Navbar from "./Navbar";
import ThemeContent from './ThemeContent';

export default function ContextPage() {
    return (
        <>
            <ThemeProvider>
                <div className='flex flex-col items-center justify-center min-h-screen'>
                    <main className='flex-1 w-full'>
                        <Navbar />
                        <ThemeContent />
                    </main>
                </div>
            </ThemeProvider>
        </>
    );
};