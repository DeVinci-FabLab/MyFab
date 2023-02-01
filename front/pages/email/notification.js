import React from "react";
import Steps from "../../components/steps"

const Notification = () => {

    const steps = [
        { id: "Etape 1", name: "Validation du fichier STL", status: "complete"},
        { id: "Etape 2", name: "Lancement de l'impression", status: "complete" },
        { id: "Etape 3", name: "Pièce mise à disposition", status: "current" },
      ];
    return (
        <div className="font-sans min-w-screen min-h-screen bg-blue-50 py-8 px-4">

            <div className="max-w-md mx-auto">

                <div className="bg-white p-8 shadow-md">

                    <div className="p-5 h-64 flex flex-col items-center justify-center text-center tracking-wide leading-normal bg-gray-100 -mx-8 -mt-8">
                        <img src="../logo.png" width="50%" />
                        <p className="text-lg  font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-blue-400 to-indigo-500 mt-5">Votre ticket #1234 a été mis à jour !</p>
                    </div>

                    <div className="space-y-3 py-8 border-b">
                    <div className="mb-5">
                    <Steps steps={steps} />
                    </div>
                        <p>Bonjour <span className="font-bold text-indigo-500">Elias</span> !</p>
                        <p>Nous voulions juste t'informer qu'un membre du FabLab vient de lancer l'impression de ta pièce. Tu receveras une nouvelle notification quand ta pièce sera disponible.</p>
                        <p>En te souhaitant une excellente journée.</p>
                        <div className="text-center m-auto">
                        </div>
                        <p className="text-sm">
                            Cordialement, le Devinci FabLab.
                        </p>
                    </div>

                    <div className="mt-8 text-center">
                        <button className="bg-indigo-700 text-white p-2 rounded-md hover:bg-indigo-500"><a href="/panel/12345">Accéder à mon ticket</a></button>

                    </div>

                </div>

                <div className="text-center text-sm text-grey-darker mt-8">


                    <p className="leading-loose">
                        Un problème ? Une question ? Contactez-nous à <a href="#" className="text-grey-darkest">fablab@devinci.fr</a>
                    </p>

                </div>


            </div>

        </div>

    );
};

export default Notification;
