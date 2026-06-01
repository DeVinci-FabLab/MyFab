import React from "react";

export default function Error() {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-night-950">
      <div className="text-center m-auto px-4">
        <img
          className="text-center m-auto"
          src="https://i1.wp.com/media.giphy.com/media/8L0Pky6C83SzkzU55a/source.gif?w=525&ssl=1"
          alt="Actuellement en train de pleurer, le gif ne se charge pas"
          width="65%"
          height="65%"
        />
        <p className="font-mono text-xs uppercase tracking-wider text-brand-magenta mt-4">
          // Erreur 404
        </p>
        <h1 className="font-semibold text-xl text-gray-900 dark:text-white mt-1">
          Oups une erreur est survenue...
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          La page que vous recherchez actuellement n'existe pas.
        </p>
        <button
          onClick={() => (window.location.href = process.env.BASE_PATH + "/")}
          className="back-button bg-brand-magenta hover:bg-brand-magenta-dark text-white font-medium p-2 px-4 rounded-md mt-5"
        >
          Retourner sur la page d'accueil
        </button>
      </div>
    </div>
  );
}
