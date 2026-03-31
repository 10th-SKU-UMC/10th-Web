import { ThemeProvider } from "./context/Themeprovider";
import Navber from "./Navber";
import ThemeContent from "./ThemeContent";

export default function ContextPage() {
  return (
    <ThemeProvider>
        <div className="w-full h-screen flex flex-col items-center justify-center min-h-screen">
            <Navber />
            <ThemeContent />
        </div>
    </ThemeProvider>
  )
}
