import React from "react";

export default function Error() {
  return (
    <div className="flex h-screen">
      <div className="text-center m-auto">
        <img
          className="text-center m-auto"
          src="https://i1.wp.com/media.giphy.com/media/8L0Pky6C83SzkzU55a/source.gif?w=525&ssl=1"
          alt="Actuellement en train de pleurer, le gif ne se charge pas"
          width="65%"
          height="65%"
        />
        <h1 className="font-medium text-xl text-indigo-700">
          Oups une erreur est survenue...
        </h1>
        <p>La page que vous recherchez actuellement n'existe pas.</p>
        <button
          onClick={() => (window.location.href = process.env.BASE_PATH + "/")}
          className="bg-indigo-700 text-white p-2 rounded-md hover:bg-indigo-500 mt-5 back-button"
        >
          Retourner sur la page d'accueil
        </button>
      </div>
    </div>
  );
}
