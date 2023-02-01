import React from "react";

const Error = () => {
  return (
    <div className="flex h-screen">
        <div className="text-center m-auto">
        <img className="text-center m-auto" src="https://cdn.dribbble.com/users/1192256/screenshots/6290585/1._friday.gif" alt="this slowpoke moves"  width="65%" height="65%"/>
        <h1 className="font-medium text-xl text-indigo-700">Oups, vous n'êtes pas autorisé à accéder à cette ressource.</h1>
        <p>Demander à votre administrateur pour y avoir accès</p>
        <button onClick={() => window.location.href=process.env.BASE_PATH + "/"} className="bg-indigo-700 text-white p-2 rounded-md hover:bg-indigo-500 mt-5">Retourner sur la page d'accueil</button>
    </div>
    </div>
  );
};


export default Error;
