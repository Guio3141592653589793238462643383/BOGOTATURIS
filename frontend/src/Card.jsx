import { useState } from "react";

export default function Card() {
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => setDarkMode(!darkMode);

  return (
    <div
      className={`max-w-sm mx-auto p-6 rounded-lg shadow-md transition duration-500 ${
        darkMode ? "bg-gray-900 text-white" : "bg-white text-gray-800"
      }`}
    >
      <img
        src="http://i.pravatar.cc/150"
        alt="ana-imagen"
        className="rounded-full w-32 h-32 mx-auto border-4 border-purple-400"
      />
      <h2 className="mt-4 text-2xl font-semibold text-center">
        Jehimy Hernandez
      </h2>
      <p className="mt-2 text-center opacity-80">
        Desarrolladora Front-End apasionada por React y el diseño UI/UX
      </p>
      <button
        onClick={toggleTheme}
        className={`mt-6 mx-auto block px-6 py-2 rounded-lg font-semibold transition duration-300 ${
          darkMode
            ? "bg-purple-500 text-white hover:bg-purple-600"
            : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
      >
        {darkMode ? "☀️ MODO CLARO" : "🌙 MODO OSCURO"}
      </button>
    </div>
  );
}
