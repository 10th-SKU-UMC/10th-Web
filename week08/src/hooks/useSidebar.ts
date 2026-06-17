import { useState, useEffect } from "react";

const MD_BREAKPOINT = 768;

export default function useSidebar() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const open = () => setIsOpen(true);
  const close = () => setIsOpen(false);
  const toggle = () => setIsOpen((prev) => !prev);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < MD_BREAKPOINT) {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return { isOpen, open, close, toggle };
}
