import React from "react";

const Error = () => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-night-950">
      <div className="text-center m-auto px-4">
        <img
          className="text-center m-auto"
          src="https://cdn.dribbble.com/users/1192256/screenshots/6290585/1._friday.gif"
          alt="Actuellement en train de pleurer, le gif ne se charge pas"
          width="65%"
          height="65%"
        />
        <p className="font-mono text-xs uppercase tracking-wider text-brand-magenta mt-4">
          // Erreur 403
        </p>
        <h1 className="font-semibold text-xl text-gray-900 dark:text-white mt-1">
          Oups, vous n'êtes pas autorisé à accéder à cette ressource.
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Demander à votre administrateur pour y avoir accès
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
};

export default Error;
