'use client'
import { useContext } from "react";
import { ThemeContext } from "@/context/ThemeContext";
import { BsFillMoonStarsFill } from "react-icons/bs";
import { RiSunLine } from "react-icons/ri";

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <button onClick={toggleTheme}>
      {theme === "light" ? <BsFillMoonStarsFill className="text-xl" /> : <RiSunLine className="text-xl" />}
    </button>
  );
}
